import shiny from 'eslint-config-shiny'

export default [
    ...(await shiny({ configs: ['node', 'format'] })),
    {
        rules: {
            'ts/no-dynamic-delete': 0,
            'sonarjs/prefer-object-spread': 0
        }
    }
]
