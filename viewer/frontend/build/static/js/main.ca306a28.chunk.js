(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{65:function(e,t,c){},66:function(e,t,c){"use strict";c.r(t);var a=c(0),n=c(9),r=c.n(n),s=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,129)).then((function(t){var c=t.getCLS,a=t.getFID,n=t.getFCP,r=t.getLCP,s=t.getTTFB;c(e),a(e),n(e),r(e),s(e)}))},i=c(33),l=c(106),j=c(117),o=c(111),d=c(126),b=c(109),u=c(119),h=c(123),O=c(122),m=c(118),x=c(120),f=c(121),p=c(125),g=c(115),v=c(124),C=c(127),N=c(116),S=c(112),y=c(6),F=Object(l.a)((function(e){return{root:{"& > *":{margin:e.spacing(1)}},title:{marginTop:e.spacing(3),marginBottom:e.spacing(3)},tableGrid:{marginTop:e.spacing(2)},properties:{width:"80%"},formControl:{width:"80%"},margin:{marginTop:e.spacing(2),marginBottom:e.spacing(2)}}})),T=function(){var e=Object(a.useState)(!1),t=Object(i.a)(e,2),c=t[0],n=t[1],r=Object(a.useState)(""),s=Object(i.a)(r,2),l=s[0],T=s[1],J=Object(a.useState)("date"),w=Object(i.a)(J,2),B=w[0],E=w[1],I=Object(a.useState)("DESC"),V=Object(i.a)(I,2),k=V[0],D=V[1];Object(a.useEffect)((function(){if(""===l)return!1;console.log(JSON.parse(l))}));var A=F();return Object(y.jsxs)(y.Fragment,{children:[Object(y.jsxs)(b.a,{children:[Object(y.jsx)(o.a,{variant:"h5",className:A.title,children:"\ud83d\udcaa\u9032\u6357\u30ea\u30b9\u30c8\ud83d\udcaa"}),Object(y.jsxs)(S.a,{container:!0,justify:"center",className:A.margin,children:[Object(y.jsx)(S.a,{item:!0,xs:3,children:Object(y.jsx)(p.a,{id:"limit",label:"\u8868\u793a\u4ef6\u6570",type:"number",placeholder:"\u5168\u4ef6",defaultValue:100,autoComplete:"off",className:A.properties})}),Object(y.jsx)(S.a,{item:!0,xs:3,children:Object(y.jsx)(p.a,{id:"name",label:"\u30e6\u30fc\u30b6\u30fc\u540d",placeholder:"\u5168\u54e1",defaultValue:"*",autoComplete:"off",className:A.properties})})]}),Object(y.jsxs)(S.a,{container:!0,justify:"center",className:A.margin,children:[Object(y.jsx)(S.a,{item:!0,xs:3,children:Object(y.jsxs)(g.a,{className:A.formControl,children:[Object(y.jsx)(d.a,{id:"order-by-select",children:"\u30bd\u30fc\u30c8\u3059\u308b\u5024"}),Object(y.jsxs)(v.a,{labelId:"order-by-select",id:"order-by-select",value:B,defaultValue:"date",onChange:function(e){E(e.target.value)},children:[Object(y.jsx)(C.a,{value:"date",children:"\u65e5\u4ed8"}),Object(y.jsx)(C.a,{value:"name",children:"\u540d\u524d"}),Object(y.jsx)(C.a,{value:"content",children:"\u5185\u5bb9"})]})]})}),Object(y.jsx)(S.a,{item:!0,xs:3,children:Object(y.jsxs)(g.a,{className:A.formControl,children:[Object(y.jsx)(d.a,{id:"order-select",children:"\u30bd\u30fc\u30c8\u9806"}),Object(y.jsxs)(v.a,{labelId:"order-select",id:"order-select",value:k,defaultValue:"ASC",onChange:function(e){D(e.target.value)},children:[Object(y.jsx)(C.a,{value:"ASC",children:"\u6607\u9806"}),Object(y.jsx)(C.a,{value:"DESC",children:"\u964d\u9806"})]})]})})]}),Object(y.jsx)(j.a,{variant:"outlined",color:"secondary",onClick:function(){c||n(!0);for(var e="",t=0,a=["name","limit"];t<a.length;t++){var r=a[t],s=""===e?"?":"&";"limit"===r&&(e="".concat(e).concat(s,"order=").concat(B,",").concat(k),s="&");var i=document.querySelector("#".concat(r)).value;""!==i&&"*"!==i&&(e="".concat(e).concat(s).concat(r,"=").concat(i))}fetch("/api".concat(e)).then((function(e){return e.json()})).then((function(e){T(e.result),setTimeout((function(){return n(!1)}),2500)}))},className:A.margin,disabled:c,children:"\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3059\u308b"})]}),Object(y.jsx)(S.a,{container:!0,justify:"center",className:A.tableGrid,children:""===l||0===JSON.parse(l).length?Object(y.jsx)(o.a,{children:""===l?"\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3059\u308b\u30dc\u30bf\u30f3\u3092\u62bc\u3057\u3066\u306d":"\u30c7\u30fc\u30bf\u304c\u898b\u3064\u304b\u3089\u306a\u3044\u3088\uff01"}):Object(y.jsx)(m.a,{component:N.a,children:Object(y.jsxs)(u.a,{className:A.table,"aria-label":"simple table",children:[Object(y.jsx)(x.a,{children:Object(y.jsxs)(f.a,{children:[Object(y.jsx)(O.a,{children:"\u30e6\u30fc\u30b6\u30fc"}),Object(y.jsx)(O.a,{children:"\u6295\u7a3f\u65e5\u6642"}),Object(y.jsx)(O.a,{children:"\u6295\u7a3f\u5185\u5bb9"})]})}),Object(y.jsx)(h.a,{children:JSON.parse(l).map((function(e,t){var c=e.name,a=e.content,n=e.date;return Object(y.jsxs)(f.a,{children:[Object(y.jsx)(O.a,{children:c}),Object(y.jsx)(O.a,{children:n}),Object(y.jsx)(O.a,{children:a})]},t)}))})]})})})]})};c(65);r.a.render(Object(y.jsx)(y.Fragment,{children:Object(y.jsx)(T,{})}),document.getElementById("root")),s()}},[[66,1,2]]]);
//# sourceMappingURL=main.ca306a28.chunk.js.map