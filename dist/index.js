function u(e){return!!e.configs.recommended}function f(e){let n=Object.keys(e),t=n.length,o={plugins:{},rules:{}},s,i;for(let r=0;r<t;r++)s=n[r],i=e[s],o.plugins[s]=i,u(i)&&(o.rules=Object.assign(o.rules,i.configs.recommended.rules));return o}function a(e,n){return e==="eslint"?n:`${e}/${n}`}function m(e,n){let t=e.length,o=n.length,s={},i,r;for(let c=0;c<o;c++)for(i=n[c],r=0;r<t;r++)s[a(i,e[r])]=0;return s}function d(e,n){for(let t=n.length-1;t>=0;t--)delete e.rules[n[t]]}function x(e,n,t){let o=e.length,s=n.length,i=t.length,r={},c,l;for(let p=0;p<o;p++){for(c=e[p],l=0;l<s;l++)r[a(n[l],c)]=0;for(l=0;l<i;l++)r[a(t[l],c)]=2}return r}function g(e,n){let t=n.length;if(!t||!e.length)return e.slice();let o;for(let s=0;s<t;s++)if(o=e.indexOf(n[s]),o>-1&&e.splice(o,1),!e.length)return[];return e.slice()}var b=["brace-style","no-extra-parens","object-curly-spacing","quote-props"],B=["array-bracket-newline","array-bracket-spacing","array-element-newline","max-attributes-per-line","singleline-html-element-content-newline"],N=[...b,"arrow-parens","indent","semi","quotes","lines-around-comment","padding-line-between-statements","space-before-function-paren"],O=["class-methods-use-this","consistent-return","dot-notation","func-call-spacing","no-array-constructor","no-dupe-class-members","no-loss-of-precision","no-redeclare","no-throw-literal","no-unused-vars","no-unused-expressions","no-use-before-define","no-useless-constructor","require-await"],h=["comma-dangle","comma-spacing","key-spacing","keyword-spacing","lines-between-class-members","no-extra-semi","space-before-blocks","space-infix-ops"],V=[...g(h,["lines-between-class-members","no-extra-semi","space-before-blocks"]),"block-spacing","func-call-spacing"],E=["arrow-spacing","dot-location","no-trailing-spaces","space-in-parens"],$=["jsx-closing-bracket-location","jsx-closing-tag-location","jsx-equals-spacing","jsx-indent","jsx-indent-props","jsx-no-multi-spaces","jsx-self-closing-comp","jsx-tag-spacing","jsx-wrap-multilines"];export{E as DeprecatedStyleList,h as EsStyleReplaceList,O as EsTsReplaceList,N as GeneralBanList,$ as JsxStyleReplaceList,V as StyleVueReplaceList,b as VueBanList,B as VueStyleBanList,f as apply,m as ban,d as deleteRules,x as replace};
//# sourceMappingURL=index.js.map
