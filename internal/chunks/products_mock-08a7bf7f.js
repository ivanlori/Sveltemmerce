import{S as y,i as B,s as N,e as w,k as O,t as Q,c as j,a as F,n as R,g as U,d as h,b as I,a3 as S,f as T,H as A,I as V,a4 as W,r as D,u as f,w as E,x as g,h as x,a5 as z,F as q,W as G,j as b,m as L,o as P,K as H,v,D as J,Q as X}from"./vendor-11bfac7b.js";import{c as C,p as K}from"./store-b2df3f3d.js";function Y(o){let e,i;return e=new q({props:{icon:G}}),{c(){b(e.$$.fragment)},l(t){L(e.$$.fragment,t)},m(t,r){P(e,t,r),i=!0},p:H,i(t){i||(g(e.$$.fragment,t),i=!0)},o(t){f(e.$$.fragment,t),i=!1},d(t){v(e,t)}}}function Z(o){let e,i;return e=new q({props:{icon:J}}),{c(){b(e.$$.fragment)},l(t){L(e.$$.fragment,t)},m(t,r){P(e,t,r),i=!0},p:H,i(t){i||(g(e.$$.fragment,t),i=!0)},o(t){f(e.$$.fragment,t),i=!1},d(t){v(e,t)}}}function $(o){let e,i,t,r,s,u,c,p,l;const a=[Z,Y],d=[];function k(n,m){return n[3]?0:1}return i=k(o),t=d[i]=a[i](o),{c(){e=w("button"),t.c(),r=O(),s=Q(o[2]),this.h()},l(n){e=j(n,"BUTTON",{class:!0});var m=F(e);t.l(m),r=R(m),s=U(m,o[2]),m.forEach(h),this.h()},h(){I(e,"class",u=""+(S(`btn ${o[0]}`)+" svelte-ik7k77"))},m(n,m){T(n,e,m),d[i].m(e,null),A(e,r),A(e,s),c=!0,p||(l=V(e,"click",W(function(){z(o[1])&&o[1].apply(this,arguments)})),p=!0)},p(n,[m]){o=n;let _=i;i=k(o),i===_?d[i].p(o,m):(D(),f(d[_],1,1,()=>{d[_]=null}),E(),t=d[i],t?t.p(o,m):(t=d[i]=a[i](o),t.c()),g(t,1),t.m(e,r)),(!c||m&4)&&x(s,o[2]),(!c||m&1&&u!==(u=""+(S(`btn ${o[0]}`)+" svelte-ik7k77")))&&I(e,"class",u)},i(n){c||(g(t),c=!0)},o(n){f(t),c=!1},d(n){n&&h(e),d[i].d(),p=!1,l()}}}function tt(o,e,i){let{className:t}=e,{onClick:r}=e,{text:s}=e,{remove:u}=e;return o.$$set=c=>{"className"in c&&i(0,t=c.className),"onClick"in c&&i(1,r=c.onClick),"text"in c&&i(2,s=c.text),"remove"in c&&i(3,u=c.remove)},[t,r,s,u]}class M extends y{constructor(e){super();B(this,e,tt,$,N,{className:0,onClick:1,text:2,remove:3})}}function et(o){let e,i;return e=new M({props:{className:"",onClick:o[9],remove:!1,text:"Add to Cart"}}),{c(){b(e.$$.fragment)},l(t){L(e.$$.fragment,t)},m(t,r){P(e,t,r),i=!0},p(t,r){const s={};r&1&&(s.onClick=t[9]),e.$set(s)},i(t){i||(g(e.$$.fragment,t),i=!0)},o(t){f(e.$$.fragment,t),i=!1},d(t){v(e,t)}}}function it(o){let e,i;return e=new M({props:{className:"remove",onClick:o[8],remove:!0,text:"Remove from Cart"}}),{c(){b(e.$$.fragment)},l(t){L(e.$$.fragment,t)},m(t,r){P(e,t,r),i=!0},p(t,r){const s={};r&1&&(s.onClick=t[8]),e.$set(s)},i(t){i||(g(e.$$.fragment,t),i=!0)},o(t){f(e.$$.fragment,t),i=!1},d(t){v(e,t)}}}function rt(o){let e,i,t,r,s;const u=[it,et],c=[];function p(l,a){return(i==null||a&3)&&(i=!!l[1].find(l[7])),i?0:1}return t=p(o,-1),r=c[t]=u[t](o),{c(){e=w("div"),r.c()},l(l){e=j(l,"DIV",{});var a=F(e);r.l(a),a.forEach(h)},m(l,a){T(l,e,a),c[t].m(e,null),s=!0},p(l,[a]){let d=t;t=p(l,a),t===d?c[t].p(l,a):(D(),f(c[d],1,1,()=>{c[d]=null}),E(),r=c[t],r?r.p(l,a):(r=c[t]=u[t](l),r.c()),g(r,1),r.m(e,null))},i(l){s||(g(r),s=!0)},o(l){f(r),s=!1},d(l){l&&h(e),c[t].d()}}}function ot(o,e,i){let t;X(o,C,n=>i(1,t=n));let{id:r}=e,{title:s}=e,{price:u}=e,{img:c}=e;function p(n){K.update(m=>m+1),C.update(m=>[...m,{title:s,price:u,img:c,id:n}])}function l(n){K.update(m=>m-1),C.update(m=>m.filter(_=>_.id!==n))}const a=n=>n.id===r,d=()=>l(r),k=()=>p(r);return o.$$set=n=>{"id"in n&&i(0,r=n.id),"title"in n&&i(4,s=n.title),"price"in n&&i(5,u=n.price),"img"in n&&i(6,c=n.img)},[r,t,p,l,s,u,c,a,d,k]}class st extends y{constructor(e){super();B(this,e,ot,rt,N,{id:0,title:4,price:5,img:6})}}var lt=[{id:1,title:"Product 1",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:50.6,img:"https://loremflickr.com/320/240",rating:2},{id:2,title:"Product 2",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:34.99,img:"https://loremflickr.com/320/240",rating:4},{id:3,title:"Product 3",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:90.8,img:"https://loremflickr.com/320/240",rating:5},{id:4,title:"Product 4",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:20.49,img:"https://loremflickr.com/320/240",rating:3},{id:5,title:"Product 5",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:100,img:"https://loremflickr.com/320/240",rating:4},{id:6,title:"Product 6",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:83.5,img:"https://loremflickr.com/320/240",rating:5},{id:7,title:"Product 7",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:30.49,img:"https://loremflickr.com/320/240",rating:5},{id:8,title:"Product 8",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:205,img:"https://loremflickr.com/320/240",rating:5},{id:9,title:"Product 9",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:80,img:"https://loremflickr.com/320/240",rating:2},{id:10,title:"Product 10",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:79.99,img:"https://loremflickr.com/320/240",rating:5},{id:11,title:"Product 11",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:40,img:"https://loremflickr.com/320/240",rating:4},{id:12,title:"Product 12",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:43.99,img:"https://loremflickr.com/320/240",rating:4},{id:13,title:"Product 13",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:120,img:"https://loremflickr.com/320/240",rating:5},{id:14,title:"Product 14",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:99,img:"https://loremflickr.com/320/240",rating:3},{id:15,title:"Product 15",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:79.99,img:"https://loremflickr.com/320/240",rating:4},{id:16,title:"Product 16",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:50,img:"https://loremflickr.com/320/240",rating:3},{id:17,title:"Product 17",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:60,img:"https://loremflickr.com/320/240",rating:4},{id:18,title:"Product 18",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:109,img:"https://loremflickr.com/320/240",rating:5},{id:19,title:"Product 19",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:20.5,img:"https://loremflickr.com/320/240",rating:5},{id:20,title:"Product 20",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:58,img:"https://loremflickr.com/320/240",rating:4},{id:21,title:"Product 21",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:99,img:"https://loremflickr.com/320/240",rating:5},{id:22,title:"Product 22",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:39.99,img:"https://loremflickr.com/320/240",rating:4},{id:23,title:"Product 23",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:20,img:"https://loremflickr.com/320/240",rating:2},{id:24,title:"Product 24",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit,",price:39,img:"https://loremflickr.com/320/240",rating:5}];export{st as B,lt as d};
