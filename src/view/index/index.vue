<!-- 头部的meta标签和link标签 -->
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preload" as="image" href="images/home/slerf.png">
    <link rel="icon" href="images/coin.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:description" content="SLERFIN">
    <meta name="twitter:image:type" content="image/png">
    <meta name="twitter:image:width" content="855">
    <meta name="twitter:image:height" content="714">
    <meta property="og:image" content="https://www.slerf.wtf/images/bath.png">
    <meta name="twitter:image" content="https://www.slerf.wtf/images/bath.png">
    <meta property="og:description" content="SLERFIN">
    <meta property="og:image:type" content="image/png">
    <meta property="og:title" content="$SLERF">
    <title>$SLERF</title>
    <meta name="description" content="SLERFIN">
  </head>
<template>
    <div>
      <div class="headerNew">
        <a href="index.htm">
          <div class="headerNew-item active">HOME</div>
        </a>
        <a href="integrations.html">
          <div class="headerNew-item">INTEGRATIONS</div>
        </a>
        <a href="slerfdex.html">
          <div class="headerNew-item">SLERFDEX</div>
        </a>
        <a href="history.html">
          <div class="headerNew-item">HISTORY</div>
        </a>
        <a href="vote.html">
          <div class="headerNew-item">VOTE</div>
        </a>
        <a href="disclaimer.html">
          <div class="headerNew-item">DISCLAIMER</div>
        </a>
      </div>
      <div class="overflow-hidden">
        <div id="mouse-parallax-container" style="overflow:none;position:relative;width:110vw;height:100vh" class="parallax">
          <div class="paraChild" style="background-image:url(images/home/1.png);transform:none"></div>
          <div class="paraChild" style="background-image:url(images/home/2.png);width:105%;margin-left:-2.5%;height:108%;top:-2%;transform:none">
            <img class="slerfHome" src="/images/home/slerf.png">
          </div>
          <div class="paraChild" style="background-image:url(images/home/text.png);background-position:center 40%;background-size:54vh;transform:none"></div>
          <div class="paraChild" style="background-image:url(images/home/3.png);width:105%;margin-left:-2.5%;height:108%;top:-4%;transform:none"></div>
          <div class="paraChild" style="background-image:url(images/home/4.png);width:105%;margin-left:-2.5%;height:108%;top:-4%;transform:none"></div>
        </div>
      </div>
      <div style="position:fixed;z-index:9999;top:16px;left:16px;right:16px;bottom:16px;pointer-events:none"></div>
    </div>
  </template>
 
  
<script>
export default {
  name: 'MyComponent',
  mounted() {
    // 动态加载外部脚本
    const scripts = [
      'https://unpkg.com/react/umd/react.development.js',
      'https://unpkg.com/react-dom/umd/react-dom.development.js',
      '_next/static/chunks/fd9d1056-fa5001f299af462d.js',
      '_next/static/chunks/69-90fc80338b430e38.js',
      '_next/static/chunks/main-app-a91ab301754ae529.js',
      '_next/static/chunks/792-67ab32c2c125a4f9.js',
      '_next/static/chunks/269-d1c5be6ae3f8f97e.js',
      '_next/static/chunks/app/page-beb1b6f2693ccba3.js',
      '_next/static/chunks/3a91511d-c113a601daae95c0.js',
      '_next/static/chunks/113-35038c2b8339c77e.js',
      '_next/static/chunks/486-90549e8f08e389c6.js',
      '_next/static/chunks/229-18f2c54b8a0fdbb6.js',
      '_next/static/chunks/app/layout-49405347e7683e8d.js',
      '_next/static/chunks/polyfills-c67a75d1b6f99dc8.js'
    ];

    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = '';
      document.head.appendChild(script);
    });

    // 内联脚本
    const inlineScripts = [
      '(self.__next_f = self.__next_f || []).push([0]); self.__next_f.push([2, null])',
      'self.__next_f.push([1, "1:HL[\'/_next/static/css/db7989e5bf89980e-new.css\',\'style\',{\'crossOrigin\':\'\'}]\n0:\'$L2\'\n"])',
      'self.__next_f.push([1, "3:I[47690,[],\'\']\n5:I[77831,[],\'\']\n6:I[48836,[\'792\',\'static/chunks/792-67ab32c2c125a4f9.js\',\'269\',\'static/chunks/269-d1c5be6ae3f8f97e.js\',\'931\',\'static/chunks/app/page-beb1b6f2693ccba3.js\'],\'\']\n7:I[98690,[\'814\',\'static/chunks/3a91511d-c113a601daae95c0.js\',\'113\',\'static/chunks/113-35038c2b8339c77e.js\',\'486\',\'static/chunks/486-90549e8f08e389c6.js\',\'229\',\'static/chunks/229-18f2c54b8a0fdbb6.js\',\'185\',\'static/chunks/app/layout-49405347e7683e8d.js\'],\'WalletContextProvider\']\n8:I[24840,[\'814\',\'static/chunks/3a91511d"])',
      'self.__next_f.push([1, "-c113a601daae95c0.js\',\'113\',\'static/chunks/113-35038c2b8339c77e.js\',\'486\',\'static/chunks/486-90549e8f08e389c6.js\',\'229\',\'static/chunks/229-18f2c54b8a0fdbb6.js\',\'185\',\'static/chunks/app/layout-49405347e7683e8d.js\'],\'NextAuthProvider\'])\n9:I[5613,[],\'\']\na:I[31778,[],\'\']\nb:I[18009,[\'814\',\'static/chunks/3a91511d-c113a601daae95c0.js\',\'113\',\'static/chunks/113-35038c2b8339c77e.js\',\'486\',\'static/chunks/486-90549e8f08e389c6.js\',\'229\',\'static/chunks/229-18f2c54b8a0fdbb6.js\',\'185\',\'static/chunks/app/layout-49405347e7683"])',
      'self.__next_f.push([1, "e8d.js"],"Toaster"]\nd:I[48955,[],\'\']\ne:[]\n"])',
      'self.__next_f.push([1, "2:[[[\'$\',\'link\',\'0\',{\'rel\':\'stylesheet\',\'href\':\'/_next/static/css/db7989e5bf89980e-new.css\',\'precedence\':\'next\',\'crossOrigin\':\'\'}]],[\'$\',\'$L3\',null,{\'buildId\':\'0buux6il8KjjtuDZbRamN\',\'assetPrefix\':\'\',\'initialCanonicalUrl\':\'/\',\'initialTree\':[\'\',{\'children\':[\'__PAGE__\',{}]},\'$undefined\',\'$undefined\',true],\'initialSeedData\':[\'\',{\'children\':[\'__PAGE__\',{},[\'$L4\',[\'$\',\'$L5\',null,{\'propsForComponent\':{\'params\':{}},\'Component\':\'$6\',\'isStaticGeneration\':true}],null]]},[null,[\'$\',\'html\',null,{\'lang\':\'en\',\'children\':[[\'$\',\'head\',null,{\'children\':[[\'$\',\'link\',null,{\'rel\':\'icon\',\'href\':\'/images/coin.png\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:card\',\'content\':\'summary_large_image\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:description\',\'content\':\'SLERFIN\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:image:type\',\'content\':\'image/png\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:image:width\',\'content\':\'855\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:image:height\',\'content\':\'714\'}],[\'$\',\'meta\',null,{\'property\':\'og:image\',\'content\':\'https://www.slerf.wtf/images/bath.png\'}],[\'$\',\'meta\',null,{\'name\':\'twitter:image\',\'content\':\'https://www.slerf.wtf/images/bath.png\'}],[\'$\',\'meta\',null,{\'property\':\'og:description\',\'content\':\'SLERFIN\'}],[\'$\',\'meta\',null,{\'property\':\'og:image:type\',\'content\':\'image/png\'}],[\'$\',\'meta\',null,{\'property\':\'og:title\',\'content\':\'$$SLERF\'}],[\'$\',\'link\',null,{\'href\':\'https://fonts.googleapis.com/css?family=Baloo+2:400,800&display=swap\',\'rel\':\'stylesheet\'}]]}],[\'$\',\'body\',null,{\'children\':[\'$\',\'$L7\',null,{\'children\':[\'$\',\'$L8\',null,{\'children\':[[\'$\',\'$L9\',null,{\'parallelRouterKey\':\'children\',\'segmentPath\':[\'children\'],\'loading\':\'$undefined\',\'loadingStyles\':\'$undefined\',\'loadingScripts\':\'$undefined\',\'hasLoading\':false,\'error\':\'$undefined\',\'errorStyles\':\'$undefined\',\'errorScripts\':\'$undefined\',\'template\':[\'$\',\'$La\',null,{}],\'templateStyles\':\'$undefined\',\'templateScripts\':\'$undefined\',\'notFound\':[[\'$\',\'title\',null,{\'children\':\'404: This page could not be found.\'}],[\'$\',\'div\',null,{\'style\':{\'fontFamily\':\'system-ui,\\\'Segoe UI\\\',Roboto,Helvetica,Arial,sans-serif,\\\'Apple Color Emoji\\\',\\\'Segoe UI Emoji\\\',\'height\':\'100vh\',\'textAlign\':\'center\',\'display\':\'flex\',\'flexDirection\':\'column\',\'alignItems\':\'center\',\'justifyContent\':\'center\'},\'children\':[[\'$\',\'div\',null,{\'children\':[[\'$\',\'style\',null,{\'dangerouslySetInnerHTML\':{\'__html\':\'body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\'}}],[\'$\',\'h1\',null,{\'className\':\'next-error-h1\',\'style\':{\'display\':\'inline-block\',\'margin\':\'0 20px 0 0\',\'padding\':\'0 23px 0 0\',\'fontSize\':24,\'fontWeight\':500,\'verticalAlign\':\'top\',\'lineHeight\':\'49px\'},\'children\':\'404\'}],[\'$\',\'div\',null,{\'style\':{\'display\':\'inline-block\'},\'children\':[[\'$\',\'h2\',null,{\'style\':{\'fontSize\':14,\'fontWeight\':400,\'lineHeight\':\'49px\',\'margin\':0},\'children\':\'This page could not be found.\'}}]]}]]}]]}],\'notFoundStyles\':[],\'styles\':null}],[\'$\',\'$Lb\',null,{\'position\':\'bottom-center\'}]]}]}]}]]}],null]],\'initialHead\':[false,\'$Lc\'],\'globalErrorComponent\':\'$d\',\'missingSlots\':\'$We\'}]]\n"])',
      'self.__next_f.push([1, "c:[[\'$\',\'meta\',\'0\',{\'name\':\'viewport\',\'content\':\'width=device-width, initial-scale=1\'}],[\'$\',\'meta\',\'1\',{\'charSet\':\'utf-8\'}],[\'$\',\'title\',\'2\',{\'children\':\'$$SLERF\'}],[\'$\',\'meta\',\'3\',{\'name\':\'description\',\'content\':\'SLERFIN\'}],[\'$\',\'link\',\'4\',{\'rel\':\'icon\',\'href\':\'/images/coin.png\'}]]\n4:null\n"])',
      'self.__next_f.push([1, ""])'
    ];

    inlineScripts.forEach(scriptContent => {
      const script = document.createElement('script');
      script.innerHTML = scriptContent;
      document.head.appendChild(script);
    });
  }
}
</script>

<style>
/* 引入外部CSS */
@import url('_next/static/css/db7989e5bf89980e-new.css');
@import url('_next/static/css/tailwind-out.css');
@import url('https://fonts.googleapis.com/css?family=Baloo+2:400,800&display=swap');

/* 其他样式 */
</style>

