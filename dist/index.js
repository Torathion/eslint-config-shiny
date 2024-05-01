import{open as be}from"node:fs/promises";import{join as Ce}from"node:path";async function m(e){return JSON.parse((await e.readFile()).toString())}var xe={arrowParens:"arrow-parens",bracketSpacing:"block-spacing",endOfLine:"linebreak-style",quoteProps:"quote-props",semi:"semi",singleQuote:"quotes",trailingComma:"comma-dangle"},Le=new Set(["block-spacing","comma-dangle","quotes","quote-props"]),we={printWidth:"code",tabWidth:"tabWidth"},Oe=new Set(["printWidth","tabWidth","useTabs"]),Se=new Set(["avoid","false","none","preserve"]),ke=new Set(["plugins","bracketSameLine","parser","editorconfig","embeddedLanguageFormatting","experimentalTernaries","jsxBracketSameLine","jsxSingleQuote","singleAttributePerLine","vueIndentScriptAndStyle","htmlWhitespaceSensitivity","proseWrap","insertPragma","requirePragma","filepath","rangeStart","rangeEnd"]),te="@stylistic/js",ne="@stylistic/ts",Y=`${te}/max-len`,Z=`${ne}/indent`;function ee(e,t,r,n){if(e)return e;let i=[2,t&&r?"tab":r||4];return n&&i.push(n),i}function Re(e,t,r,n){let i=r==="tabWidth";if(r==="printWidth"||i){let o=t[Y];o||(o=t[Y]=[2,{}]),o[1][we[r]]=n}let s=r==="useTabs";if((s||i)&&e.indent){let o=t[Z];if(o||(o=t[Z]=[2,{}]),s&&n&&(o[1]="tab"),i&&typeof n=="number"&&(o[1]=o[1]==="tab"?o[1]:n,!o[2])){let a=Math.floor(n/2);o[2]={ArrayExpression:a,CallExpression:a,ObjectExpression:a,ImportDeclaration:a,ignoreComments:!1,SwitchCase:a,MemberExpression:a,VariableDeclarator:"first",StaticBlock:n,flatTernaryExpressions:!1,offsetTernaryExpressions:!1,FunctionExpression:{body:n,parameters:a}}}e.configs.includes("vue")&&(t["vue/html-indent"]=ee(t["vue/html-indent"],s,n)),e.configs.includes("react")&&(t["@stylistic/jsx/jsx-indent"]=ee(t["@stylistic/jsx/jsx-indent"],s,n,{checkAttributes:!0,indentLogicalExpressions:!0}))}}function je(e,t,r,n){switch(r){case"semi":e["@stylistic/ts/member-delimiter-style"]=[2,{multiline:{delimiter:n?"none":"semi"},singleline:{delimiter:"semi",requireLast:!1}}];break}}function ve(e,t,r){typeof r=="boolean"&&(r=`${r}`);let n=Se.has(r),i=xe[t],s=Le.has(i)?ne:te,o=0;switch(i){case"block-spacing":o=[2,n?"never":"always"],e[`${s}/object-curly-spacing`]=o;break;case"arrow-parens":case"quote-props":o=n?0:[2,r];break;case"semi":o=[2,n?"never":"always"];break;case"quotes":o=[2,n?"double":"single",{avoidEscape:!0}];break;case"comma-dangle":o=n?[2,"never"]:[2,r==="all"?"always":"only-multiline"];break;case"linebreak-style":o=[2,r==="lf"?"unix":"windows"];break;default:throw new Error(`Unknown prettier option ${t}.`)}e[`${s}/${i}`]=o,je(e,s,i,n)}async function R(e){let t,r={};try{t=await be(Ce(e.root,".prettierrc"),"r")}catch{return{name:"prettier-apply",rules:[]}}let n=await m(t);for(let i of Object.keys(n))ke.has(i)||(Oe.has(i)?Re(e,r,i,n[i]):ve(r,i,n[i]));return await t.close(),{name:"prettier-apply",rules:[r]}}import{fdir as Fe}from"fdir";async function j(e){let r=await new Fe().withFullPaths().withMaxDepth(1).crawl(e.root).withPromise(),n=r.length,i=[],s;for(let o=0;o<n;o++)s=r[o],s.includes("tsconfig")&&s.includes("json")&&i.push(s);return{languageOptions:{parserOptions:{project:i}},name:"tsconfig-resolve"}}import{open as Te}from"node:fs/promises";import{join as Ee}from"node:path";async function v(e,t){let r,n=[];try{r=await Te(Ee(e,t),"r")}catch{return{ignores:n,name:`parse-${t}`}}for await(let i of r.readLines())!i.length||i[0]==="#"||(i[0]==="*"&&i[1]==="."?n.push(i,`**/${i}`):n.push(i,i[0]==="!"||i[0]==="/"?`${i}/**`:`**/${i}/**`));return await r.close(),{ignores:[...new Set(n)],name:`parse-${t}`}}import{dirname as Me}from"node:path";import{fileURLToPath as Be}from"node:url";var Ae=new Set(["angular","web","cypress","format","fp","jest","json","node","react","base","test-base","test-angular","test-web","test-react","test-vue","tsdoc","vitest","vue"]);function $(e){return Ae.has(e)}function d(e){return e?Array.isArray(e)?e.slice():[e]:[]}function y(e,t){return Array.prototype.push.apply(e,t),e}function h(e){for(let t in e)return!1;return!0}function $e(e,t){return[...new Set((e??[]).slice().concat(t??[]))]}function D(e,t,r,n=[]){let i=[...new Set(Object.keys(e??[]).concat(Object.keys(t)??[]))],s,o,a;for(let l of i)n.includes(l)||(r.includes(l)?e[l]=t[l]??e[l]:(s=e[l],o=t[l],Array.isArray(s)?a=$e(s,o):typeof s=="object"&&s!==null?a=Object.assign({},s,o):a=o??s,e[l]=a))}function De(e,t){if(!t.languageOptions){e.languageOptions??={};return}let r=t.languageOptions,n=e.languageOptions??={};D(n,r,["parser"],["parserOptions"]);let i=r.parserOptions;if(!i){n.parserOptions??={};return}n.parserOptions?D(n.parserOptions,i,["parser"]):n.parserOptions=i}function qe(e){let t=Object.keys(e);for(let r of t)(Array.isArray(e[r])&&!e[r].length||h(e[r]))&&delete e[r]}function b(e,t){let r=Object.assign({},e);return De(r,t),D(r,t,["name"],["extends","languageOptions"]),qe(r),r}var O=new Map;async function re(e){if(O.has(e))return O.get(e);let t=await import(`file://${Me(Be(import.meta.url))}/profiles/${e}.js`);return O.set(e,t.config),t.default??t.config}function We(e){let t={};return e.parserOptions?t={parserOptions:e.parserOptions}:e.languageOptions&&(t=e.languageOptions,t.globals=d(e.languageOptions.globals)),{files:e.files,ignores:e.ignores,languageOptions:t,linterOptions:e.linterOptions,name:"extended-file",plugins:e.plugins??{},processor:d(e.processor),rules:d(e.rules),settings:e.settings}}async function Ge(e,t){let r;if(typeof e=="string"&&$(e))if(O.has(e))r=O.get(e);else{let n=await re(e);Array.isArray(n)?(r=n.shift(),y(t,n)):r=n}else typeof e!="string"&&(r=We(e));return r}async function ie(e,t){if(!e.extends)return e;let r=e.extends.length,n=e,i;for(let s=0;s<r;s++)i=await Ge(e.extends[s],t),i&&(i.extends&&(i=await ie(i,t)),n=b(i,n),i=void 0);return n}async function Ie(e){if(!e.length)return[];let t=[];for(let r=0;r<e.length;r++)t.push(await ie(e[r],e));return t}async function q(e){let t=e.configs,r=t.length,n=new Array(r);for(let s=0;s<r;s++)n[s]=re(t[s]);let i=await Promise.all(n);return Ie(i.flat())}function M(e,t){let r=t.length;if(!r||!e.length)return e.slice();let n;for(let i=0;i<r;i++)if(n=e.indexOf(t[i]),n>-1&&e.splice(n,1),!e.length)return[];return e.slice()}var _e=["brace-style","no-extra-parens","object-curly-spacing","quote-props"];var se=[..._e,"arrow-parens","indent","semi","quotes","lines-around-comment","padding-line-between-statements","space-before-function-paren"],oe=["class-methods-use-this","consistent-return","dot-notation","default-param-last","no-array-constructor","no-loop-func","no-loss-of-precision","no-redeclare","no-throw-literal","no-unused-vars","no-unused-expressions","no-use-before-define","no-useless-constructor","require-await"],B=["comma-spacing","func-call-spacing","key-spacing","keyword-spacing","lines-between-class-members","no-extra-semi","space-before-blocks","space-infix-ops"],ae=["type-annotation-spacing"],Jt=[...M(B,["lines-between-class-members","no-extra-semi","space-before-blocks"]),"block-spacing","func-call-spacing"],le=["arrow-spacing","eol-last","no-trailing-spaces","space-in-parens"];function P(...e){return Object.assign({},...e)}var C="?([cm])[jt]s?(x)";var fe=`**/*${C}`,Ut=[`**/__tests__/**/*.${C}`,`**/*.spec.${C}`,`**/*.test.${C}`,`**/*.bench.${C}`,`**/*.benchmark.${C}`];function W(e){return!!e.configs.recommended}function G(e){let t=Object.keys(e),r=t.length,n={plugins:{},rules:{}},i,s;for(let o=0;o<r;o++)i=t[o],s=e[i],n.plugins[i]=s,W(s)&&(n.rules=Object.assign(n.rules,s.configs.recommended.rules));return n}function x(e,t){return e==="eslint"?t:`${e}/${t}`}function I(e,t){let r=e.length,n=t.length,i={},s,o;for(let a=0;a<n;a++)for(s=t[a],o=0;o<r;o++)i[x(s,e[o])]=0;return i}function L(e,t,r){let n=e.length,i=t.length,s=r.length,o={},a,l;for(let f=0;f<n;f++){for(a=e[f],l=0;l<i;l++)o[x(t[l],a)]=0;for(l=0;l<s;l++)o[x(r[l],a)]=2}return o}function S(e){let t=new Map,r=e.length,n=`merged-processor:${e[0].meta?.name??"unknown"}`;for(let i=1;i<r;i++)n=`${n}+${e[i].meta?.name??"unknown"}`;return{meta:{name:n},postprocess(i,s){let o=t.get(s),a=[];t.delete(s);let l=0,f;for(let c=0;c<r;c++)f=i.slice(l,l+o[c]),l+=o[c],y(a,e[c].postprocess?.(f,s)??[]);return a},preprocess(i,s){let o=new Array(r),a=[];t.set(s,o);let l;for(let f=0;f<r;f++)l=e[f].preprocess?.(i,s)??[],o[f]=l.length,y(a,l);return a},supportsAutofix:!0}}function Je(e,t){let r=e.length;if(!r)return-1;let n;for(let i=0;i<r;i++)if(n=t.indexOf("/"),n>=0&&e[i].startsWith(t.substring(0,n)))return i;return-1}function F(e,t){if(!e)return;let r=Object.keys(t),n=e.length,i,s,o;for(let a=0;a<n;a++){s=e[a].rules??e[a],o={};for(let l in s)i=Je(r,l),i>=0?o[l.replace(r[i],t[r[i]])]=s[l]:o[l]=s[l];e[a]=Object.assign({},o)}}function He(e){let t=e.languageOptions;if(!t||h(t))return!0;if(t.parserOptions){let r=t.parserOptions;return h(r)?!0:r.project&&!r.project.length}return!!t.globals&&h(t.globals)}function Ne(){return[I(se,["eslint","@typescript-eslint","@stylistic/ts"]),L(oe,["eslint"],["@typescript-eslint"]),L(B,["eslint","@typescript-eslint"],["@stylistic/ts"]),L(le,["eslint"],["@stylistic/js"]),L(ae,["@typescript-eslint"],["@stylistic/ts"])]}function ce(e,t,r,n,i,s){let o=t[n];o?.length?e[n]=o:i?e[n]=r[0][n]??s:e[n]=s}var Ue=[fe],ze=[];function _(e,t,r){let n=t.length,i=new Array(n),s,o,a;for(let l=0;l<n;l++){if(s=t[l],o=s.apply?G(s.apply):{},ce(o,s,t,"files",r,Ue),ce(o,s,t,"ignores",r,ze),s.languageOptions&&(a=o.languageOptions=s.languageOptions,a.globals=P(...d(s.languageOptions.globals))),He(o)&&delete o.languageOptions,s.linterOptions&&(o.linterOptions=s.linterOptions),s.settings&&(o.settings=s.settings),s.processor&&(o.processor=S(s.processor)),o.plugins=P(o.plugins??{},s.plugins??{}),e.rename&&F(s.rules??[],e.rename),o.rules=P(o.rules??{},...s.rules??[]),r&&l===0){let f=Ne();F(f,e.rename),o.rules=P(o.rules,...f),o.languageOptions.parserOptions.tsconfigRootDir=e.root}i[l]=o}return i}var Ke=new Set(["base","fp","react","vue","angular","node","test-base","test-angular","test-react","test-vue","test-web"]);function J(e){let t=!1;for(let r=e.configs.length-1;r>=0;r--)if(Ke.has(e.configs[r])){t=!0;break}return t}import{existsSync as pe}from"node:fs";import{mkdir as Qe,open as Ve,writeFile as Xe}from"node:fs/promises";import{join as ge}from"node:path";var H={"editor.codeActionsOnSave":{"source.fixAll.eslint":"explicit"},"eslint.experimental.useFlatConfig":!0,"eslint.rules.customizations":[{rule:"style/*",severity:"off"},{rule:"format/*",severity:"off"},{rule:"*-indent",severity:"off"},{rule:"*-spacing",severity:"off"},{rule:"*-spaces",severity:"off"},{rule:"*-order",severity:"off"},{rule:"*-dangle",severity:"off"},{rule:"*-newline",severity:"off"},{rule:"*quotes",severity:"off"},{rule:"*semi",severity:"off"}],"eslint.validate":["javascript","javascriptreact","typescript","typescriptreact","vue","html","markdown","json","jsonc","yaml","toml","astro"]},Ye=Object.keys(H);async function N(e){let t=ge(e.root,".vscode"),r=ge(t,"settings.json");pe(t)||await Qe(t),pe(r)||await Xe(r,JSON.stringify(H),"utf8");let n=await Ve(r,"r+"),i=await m(n),s=!0;for(let o of Ye)if(i[o]){s=!1;break}if(s){let o=Buffer.from(JSON.stringify(Object.assign(i,H)));await n.write(o,0,o.byteLength,0)}await n.close()}import{join as tt}from"node:path";import nt from"ora";import{existsSync as Ze}from"node:fs";import{join as et}from"node:path";var T;function w(e){return T!==void 0||(T=e.cache&&Ze(et(e.root,".temp","shiny-config.json"))),T}import*as g from"yoctocolors";var ue=[g.yellow("Fetching configs..."),g.cyan("Applying plugins..."),g.blueBright("Parsing profiles...")],rt=[g.yellow("Applying cache...")],U=["yellow","cyan","blue"];function*z(e){let t=Date.now();e.cache&&!w(e)&&(ue.push(g.magentaBright(`Caching final config under ${tt(e.root,".temp","shiny-config.json")}`)),U.push("magenta"));let r=w(e)?rt:ue,n=nt(r[0]);n.color=U[0],n.start(),yield;let i=r.length,s;for(s=1;s<i;s++)n.succeed(),n.color=U[s],n.text=r[s],n.start(),yield;n.color="green",n.text=g.greenBright(`Ready to lint after ${Date.now()-t}ms!`),n.succeed()}import{existsSync as me}from"node:fs";import{mkdir as it,writeFile as st}from"node:fs/promises";import{join as de}from"node:path";function ot(e,t,r){for(let n of t)if(e[n]===r)return n;return r}function K(e){return e.includes("/")&&!e.includes("@")?`@${e}`:e}async function Q(e,t){let r=de(e.root,".temp"),n=de(r,"shiny-config.json");if(me(r)||await it(r),me(n))return;let i=e.rename?Object.keys(e.rename):[],s=e.rename?Object.values(e.rename):[],o=t.length,a=[],l,f,c=[],p,u;for(let E=0;E<o;E++){p={},c=[],f=t[E],l=f.plugins??{};for(let A of Object.keys(l))c.push(K(s.includes(A)?ot(e.rename,i,A):A));p.plugins=c,p.rules=f.rules,p.files=f.files,p.ignores=f.ignores,p.settings=f.settings,p.linterOptions=f.linterOptions,u=f.languageOptions,u&&(p.languageOptions=Object.assign({},u),u.parser&&(p.languageOptions.parser=K(u.parser.meta?.name??""),u.parserOptions?.parser?.meta&&(p.languageOptions.parserOptions.parser=K(u.parserOptions.parser.meta?.name??"")))),f.processor&&(p.processor=f.processor.meta?.name??""),a.push(p)}await st(n,JSON.stringify({data:a}),"utf8")}import{open as at}from"node:fs/promises";import{join as ye}from"node:path";function V(e,t){if(!e.plugins)return;let r=Object.keys(t);for(let n of r)e.plugins[n]&&(e.plugins[t[n]]=e.plugins[n],delete e.plugins[n])}var he="eslint-plugin-";async function k(e){return(await import(e)).default}function lt(e){if(e.includes("@")){let t=e.indexOf("/");return t>0?`${e.substring(0,t)}/${he}${e.substring(t+1)}`:`${e}/eslint-plugin`}return`${he}${e}`}async function ft(e){if(!e.plugins?.length)return;let t=e.plugins.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=k(lt(e.plugins[s]));let n=await Promise.all(r),i={};for(let s=0;s<t;s++)i[e.plugins[s]]=n[s];e.plugins=i}async function ct(e){if(!e.languageOptions)return;let t=e.languageOptions,r=t.parser;r&&(t.parser=await k(r));let n=t.parserOptions?.parser;n&&(t.parserOptions.parser=await k(n))}function pt(e){let t=e.length,r=[],n;for(let i=0;i<t;i++)n=e[i],typeof n=="function"?r.push(n({blocks:{customBlocks:!0,script:!1,styles:!0,template:!1}})):r.push(n);return r}async function gt(e){let t=e.processor;if(!t)return;let r=t.includes("merged-processor")?t.substring(t.indexOf(":")+1).split("+"):[t],n=[];r[0]==="eslint-plugin-vue"&&(n.push((await k(r[0])).processors[".vue"]),r.shift()),n.push(...await Promise.all(r.map(async i=>k(i)))),e.processor=n.length===1?n[0]:S(pt(n))}async function X(e){let t=ye(ye(e.root,".temp"),"shiny-config.json"),r=[],n=await at(t,"r"),i=(await m(n)).data,s=i.length,o;for(let a=0;a<s;a++)o=i[a],await Promise.all([ft(o),ct(o),gt(o)]),V(o,e.rename),r.push(o);return await n.close(),r}var Pe={cache:!0,configs:["base"],ignoreFiles:[".eslintignore",".gitignore"],patchVSCode:!0,prettier:!0,indent:!1,rename:{"@arthurgeron/react-usememo":"use-memo","@microsoft/sdl":"sdl","@typescript-eslint":"ts"},root:process.cwd()};async function ut(e){let t=Object.assign({},Pe,e);if(t.rename=Object.assign({},Pe.rename,e.rename??{}),!t.configs.length&&!t.cache)return[];let n=z(t);if(n.next(),w(t)){let c=await X(t);return n.next(),c}let i=J(t),s=[q(t),j(t)];if(i&&t.prettier&&s.push(R(t)),t.ignoreFiles.length)for(let c=t.ignoreFiles.length-1;c>=0;c--)s.push(v(t.root,t.ignoreFiles[c]));t.patchVSCode&&s.push(N(t));let o=(await Promise.all(s)).filter(Boolean);n.next();let a=o.shift(),l=a.shift();for(let c of o)l=b(l,c);a.unshift(l),n.next();let f=_(t,a,i);return t.cache&&(n.next(),await Q(t,f)),n.next(),f}export{ut as default,P as merge,y as mergeArr};
