import { GlobalAbort } from 'src/constants'
import { OperationCancelledError } from 'src/errors'
import type { CancelablePromiseInternals, CancelablePromiseCallback, CancelablePromiseOpts } from 'src/types'
import type { AnyFunction, OnFulfilled, OnRejected, SimpleVoidFunction } from 'typestar'

const noop = () => {}

function defaultInternals(): CancelablePromiseInternals {
    return { isCanceled: false, onCancelList: [] }
}

function runCallbacks(callbacks: unknown[]): void {
    for (const callback of callbacks) {
        if (typeof callback === 'function') {
            try {
                callback()
            } catch (err) {
                console.error(err)
            }
        }
    }
}

const AbortOptions: AddEventListenerOptions = { once: true }

export default class CancelablePromise<T> {
    readonly #internals: CancelablePromiseInternals
    readonly #promise: Promise<T>
    readonly #signal?: AbortSignal
    #abortListener?: AnyFunction;
    [Symbol.toStringTag] = 'CancelablePromise'

    constructor(
        executor: CancelablePromiseCallback<T> = noop,
        opts: CancelablePromiseOpts<T> = { internals: defaultInternals(), signal: GlobalAbort.signal }
    ) {
        this.cancel = this.cancel.bind(this)
        const internals = (this.#internals = opts.internals)
        const signal = (this.#signal = opts.signal)
        this.#promise =
            opts.promise ||
            new Promise<T>((resolve, reject) => {
                if (signal) {
                    this.#abortListener = () => {
                        this.cancel()
                        reject(new OperationCancelledError())
                    }
                    signal.addEventListener('abort', this.#abortListener, AbortOptions)
                }
                executor(resolve, reject, onCancel => {
                    internals.onCancelList.push(onCancel)
                })
            })
    }

    cancel(): void {
        const internals = this.#internals
        let callbacks = internals.onCancelList
        internals.isCanceled = true
        runCallbacks(callbacks)
        callbacks = []
        this.cleanup()
    }

    private cleanup(): void {
        this.#signal?.removeEventListener('abort', this.#abortListener!)
    }

    catch<TResult>(onRejected?: OnRejected<TResult>): CancelablePromise<T | TResult> {
        const internals = this.#internals
        return CancelablePromise.From<T | TResult>(this.#promise.catch(createCallback(this.#internals, onRejected)), internals)
    }

    finally(onFinally?: SimpleVoidFunction | null, runWhenCanceled?: boolean): CancelablePromise<T> {
        const internals = this.#internals
        let callbacks = internals.onCancelList
        if (runWhenCanceled) callbacks.push(onFinally)

        return CancelablePromise.From<T>(
            this.#promise.finally(
                createCallback(internals, () => {
                    if (onFinally) {
                        if (runWhenCanceled) callbacks = callbacks.filter(callback => callback !== onFinally)
                        onFinally()
                        this.cleanup()
                    }
                })
            ),
            internals
        )
    }

    isCanceled(): boolean {
        return this.#internals.isCanceled
    }

    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: OnFulfilled<T, TResult1>,
        onRejected?: OnRejected<TResult2>
    ): CancelablePromise<TResult1 | TResult2> {
        const internals = this.#internals
        return CancelablePromise.From<TResult1 | TResult2>(
            this.#promise.then(createCallback(internals, onFulfilled), createCallback(internals, onRejected)),
            internals
        )
    }

    static all<T>(promises: Promise<T>[]): CancelablePromise<Awaited<T>[]> {
        return makeAllCancelable(promises, Promise.all(promises))
    }

    static allSettled<T>(promises: Promise<T>[]): CancelablePromise<PromiseSettledResult<Awaited<T>>[]> {
        return makeAllCancelable(promises, Promise.allSettled(promises))
    }

    static any<T>(promises: Promise<T>[]): CancelablePromise<Awaited<T>> {
        return makeAllCancelable(promises, Promise.any(promises))
    }

    static From<T>(promise: Promise<T>, internals: CancelablePromiseInternals = defaultInternals()) {
        return new CancelablePromise<T>(noop, { internals, promise })
    }

    static race<T>(promises: Promise<T>[]): CancelablePromise<Awaited<T>> {
        return makeAllCancelable(promises, Promise.race(promises))
    }

    static reject(reason: Error): CancelablePromise<never> {
        return CancelablePromise.From(Promise.reject(reason), defaultInternals())
    }

    static resolve<T>(value: T | PromiseLike<T>): CancelablePromise<Awaited<T>> {
        return CancelablePromise.From(Promise.resolve(value), defaultInternals())
    }
}

export function isCancelablePromise<T>(promise: unknown): promise is CancelablePromise<T> {
    return promise instanceof CancelablePromise
}

function createCallback(internals: CancelablePromiseInternals, onResult?: AnyFunction | null) {
    if (onResult) {
        return (arg?: unknown) => {
            if (internals.isCanceled) return arg
            const result = onResult(arg)
            if (isCancelablePromise(result)) internals.onCancelList.push(result.cancel)
            return result
        }
    }
}

function promiseAllFinalizer(internals: CancelablePromiseInternals): void {
    if (!internals.isCanceled) return
    runCallbacks(internals.onCancelList)
}

function makeAllCancelable<T, P>(iterable: Iterable<T>, promise: Promise<P>): CancelablePromise<P> {
    const internals = defaultInternals()
    internals.onCancelList.push(() => {
        for (const resolvable of iterable) {
            if (isCancelablePromise(resolvable)) {
                resolvable.cancel()
            }
        }
    })
    const signal = GlobalAbort.signal
    return CancelablePromise.From<P>(
        new Promise((resolve, reject) => {
            const callback = () => reject(new OperationCancelledError())
            GlobalAbort.signal.addEventListener('abort', callback)
            promise
                .then(data => {
                    signal.removeEventListener('abort', callback)
                    resolve(data)
                })
                .catch(reject)
                .finally(() => promiseAllFinalizer(internals))
        }),
        internals
    )
}
