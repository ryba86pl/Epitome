(function(e){var t=function(){return{}};typeof define=="function"&&define.amd?define("epitome",[],t):e.Epitome=t(e)})(this),function(e){var t=function(){var e=function(t,n,r){r=r||[];if(t===n)return t!==0||1/t==1/n;if(t==null||n==null)return t===n;var i=typeOf(t),s=typeOf(n);if(i!=s)return!1;switch(i){case"string":return t==String(n);case"number":return t!=+t?n!=+n:t==0?1/t==1/n:t==+n;case"date":case"boolean":return+t==+n;case"regexp":return t.source==n.source&&t.global==n.global&&t.multiline==n.multiline&&t.ignoreCase==n.ignoreCase}if(typeof t!="object"||typeof n!="object")return!1;var o=r.length;while(o--)if(r[o]==t)return!0;r.push(t);var u=0,a=!0;if(i=="array"){u=t.length,a=u==n.length;if(a)while(u--)if(!(a=u in t==u in n&&e(t[u],n[u],r)))break}else{if("constructor"in t!="constructor"in n||t.constructor!=n.constructor)return!1;for(var f in t)if(t.hasOwnProperty(f)){u++;if(!(a=n.hasOwnProperty(f)&&e(t[f],n[f],r)))break}if(a){for(f in n)if(n.hasOwnProperty(f)&&!(u--))break;a=!u}}return r.pop(),a};return e};typeof define=="function"&&define.amd?define("epitome-isequal",["./epitome"],t):e.Epitome.isEqual=t(e.Epitome)}(this),function(e){var t=function(e){return new Class({Implements:[Options,Events],_attributes:{},properties:{id:{get:function(){var e=this._attributes.id||String.uniqueID();return this.cid||(this.cid=e),this._attributes.id}}},validators:{},options:{defaults:{}},collections:[],initialize:function(e,t){return t&&t.defaults&&(this.options.defaults=Object.merge(this.options.defaults,t.defaults)),e=e&&typeOf(e)==="object"?e:{},this.set(Object.merge(this.options.defaults,e)),this.setOptions(t),this.fireEvent("ready")},set:function(){this.propertiesChanged=this.validationFailed=[],this._set.apply(this,arguments),this.propertiesChanged.length&&this.fireEvent("change",this.get(this.propertiesChanged)),this.validationFailed.length&&this.fireEvent("error",[this.validationFailed])},_set:function(t,n){if(!t||typeof n=="undefined")return this;if(this.properties[t]&&this.properties[t].set)return this.properties[t].set.call(this,n);if(this._attributes[t]&&e(this._attributes[t],n))return this;var r=this.validate(t,n);if(this.validators[t]&&r!==!0){var i={};return i[t]={key:t,value:n,error:r},this.validationFailed.push(i),this.fireEvent("error:"+t,i[t]),this}return n===null?delete this._attributes[t]:this._attributes[t]=n,this.fireEvent("change:"+t,n),this.propertiesChanged.push(t),this}.overloadSetter(),get:function(e){return e&&this.properties[e]&&this.properties[e].get?this.properties[e].get.call(this):e&&typeof this._attributes[e]!="undefined"?this._attributes[e]:null}.overloadGetter(),unset:function(){var e=Array.prototype.slice.apply(arguments),t={},n=e.length;return n?(Array.each(Array.flatten(e),function(e){t[e]=null}),this.set(t),this):this},toJSON:function(){return Object.clone(this._attributes)},empty:function(){var e=Object.keys(this.toJSON()),t=this;this.fireEvent("change",[e]),Array.each(e,function(e){t.fireEvent("change:"+e,null)},this),this._attributes={},this.fireEvent("empty")},destroy:function(){this._attributes={},this.fireEvent("destroy")},validate:function(e,t){return e in this.validators?this.validators[e].call(this,t):!0}})};typeof define=="function"&&define.amd?define("epitome-model",["./epitome-isequal"],t):e.Epitome.Model=t(e.Epitome.isEqual)}(this),function(e){var t=new Class({Extends:Request,options:{secure:!0},initialize:function(e){this.parent(e),Object.append(this.headers,{Accept:"application/json","X-Request":"JSON"})},success:function(e){var t;try{t=this.response.json=JSON.decode(e,this.options.secure)}catch(n){this.fireEvent("error",[e,n]);return}e&&t==null&&this.status!=204?this.onFailure():this.onSuccess(t,e)}}),n=function(e){var n="sync:",r={create:"POST",read:"GET",update:"PUT",delete_:"DELETE"};return new Class({Extends:e,properties:{urlRoot:{set:function(e){this.urlRoot=e,delete this._attributes.urlRoot},get:function(){var e=this.urlRoot||this.options.urlRoot||"no-urlRoot-set";return e.charAt(e.length-1)!="/"&&(e+="/"),e}}},options:{emulateREST:!1,useJSON:!1},initialize:function(e,t){this.setupSync(),this.parent(e,t)},sync:function(e,t){var n={};e=e&&r[e]?r[e]:r.read,n.method=e;if(e==r.create||e==r.update)n.data=t||this.toJSON();return this.options.useJSON&&["POST","PUT","DELETE"].contains(e)?(n.data=JSON.encode(n.data),n.urlEncoded=!1,this.request.setHeader("Content-type","application/json")):n.urlEncoded=!0,n.url=[this.get("urlRoot"),this.get("id")].join(""),n.url.slice(-1)!=="/"&&(n.url+="/"),this.request.setOptions(n),this.request[e](t),this},setupSync:function(){var e=this,i=0,s=function(){i++};return this.getRequestId=function(){return i+1},this.request=new t({link:"chain",url:this.get("urlRoot"),emulation:this.options.emulateREST,onRequest:s,onCancel:function(){this.removeEvents(n+i)},onSuccess:function(t){t=e.parse&&e.parse(t),e.fireEvent(n+i,[t]),e.fireEvent("sync",[t,this.options.method,this.options.data]),e.isNewModel=!1},onFailure:function(){e.fireEvent(n+"error",[this.options.method,this.options.url,this.options.data])}}),Object.each(r,function(t,n){e[n]=function(e){this.sync(n,e)}}),this},_throwAwaySyncEvent:function(e,t){e=e||n+this.getRequestId();var r=this,i={};return i[e]=function(e){e&&typeof e=="object"&&(r.set(e),t&&t.call(r,e)),r.removeEvents(i)},this.addEvents(i)}.protect(),parse:function(e){return e},fetch:function(){return this._throwAwaySyncEvent(n+this.getRequestId(),function(){this.fireEvent("fetch"),this.isNewModel=!1}),this.read(),this},save:function(e,t){var r=["update","create"][+this.isNew()];if(e){var i=typeOf(e),s=i=="object"||i=="string"&&typeof t!="undefined";s&&this._set.apply(this,arguments)}return this._throwAwaySyncEvent(n+this.getRequestId(),function(){this.fireEvent("save"),this.fireEvent(r)}),this[r](),this},destroy:function(){this._throwAwaySyncEvent(n+this.getRequestId(),function(){this._attributes={},this.fireEvent("destroy")}),this.delete_()},isNew:function(){return typeof this.isNewModel=="undefined"&&(this.isNewModel=!this.get("id")),this.isNewModel}})};typeof define=="function"&&define.amd?define("epitome-model-sync",["./epitome-model"],n):e.Epitome.Model.Sync=n(e.Epitome.Model)}(this),function(e){var t=function(t){var n=function(){var t=typeof e.localStorage=="object"&&!!e.localStorage.getItem,n="localStorage",r="sessionStorage",i=function(n){var r,i="epitome-"+n,s={},o="model";if(t)try{s=JSON.decode(e[n].getItem(i))||s}catch(u){t=!1}if(!t)try{r=JSON.decode(e.name),r&&typeof r=="object"&&r[i]&&(s=r[i])}catch(u){h()}var a={store:function(e){e=e||this.toJSON(),l([o,this.get("id")].join(":"),e),this.fireEvent("store",e)},eliminate:function(){return c([o,this.get("id")].join(":")),this.fireEvent("eliminate")},retrieve:function(){var e=f([o,this.get("id")].join(":"))||null;return this.fireEvent("retrieve",e),e}},f=function(e){return s[e]||null},l=function(r,o){s=t?JSON.decode(e[n].getItem(i))||s:s,s[r]=o;if(t)try{e[n].setItem(i,JSON.encode(s))}catch(u){}else h();return this},c=function(r){delete s[r];if(t)try{e[n].setItem(i,JSON.encode(s))}catch(o){}else h()},h=function(){var t={},n=JSON.decode(e.name);t[i]=s,e.name=JSON.encode(Object.merge(t,n))};return function(e){return e&&(o=e),new Class(Object.clone(a))}};return{localStorage:i(n),sessionStorage:i(r)}}();return n};typeof define=="function"&&define.amd?define("epitome-storage",["./epitome"],t):e.Epitome.Storage=t(e)}(this),function(e){var t=function(t){var n=["forEach","each","invoke","filter","map","some","indexOf","contains","getRandom","getLast"];Function.extend({monitorModelEvents:function(e,t){var n=this;return t=t||this,!e||!e.fireEvent?this:function(r,i,s){n.apply(t,arguments),e.getModelByCID(t.cid)&&e.fireEvent(r,Array.flatten([t,i]),s)}}});var r=new Class({Implements:[Options,Events],model:t,_models:[],initialize:function(e,t){return this.setOptions(t),e&&this.setUp(e),this.id=this.options.id||String.uniqueID(),this.fireEvent("ready")},setUp:function(e){return e=Array.from(e),Array.each(e,this.addModel.bind(this)),this.addEvent("destroy",this.removeModel.bind(this)),this},addModel:function(e,t){var n;return typeOf(e)=="object"&&!instanceOf(e,this.model)&&(e=new this.model(e)),e.cid=e.cid||e.get("id")||String.uniqueID(),n=this.getModelByCID(e.cid),n&&t!==!0?this.fireEvent("add:error",e):(n&&t===!0&&(this._models[this._models.indexOf(e)]=e),e.fireEvent=Function.monitorModelEvents.apply(e.fireEvent,[this,e]),this._models.push(e),e.collections.include(this),this.length=this._models.length,this.fireEvent("add",[e,e.cid]).fireEvent("reset",[e,e.cid]))},removeModel:function(e,t){var n=this;return e=Array.from(e),Array.each(e,function(e){e.collections.erase(n),e.collections.length||delete e.fireEvent,Array.erase(n._models,e),n.length=n._models.length,t||n.fireEvent("remove",[e,e.cid])}),this.fireEvent("reset",[e])},get:function(e){return this[e]},getModelByCID:function(e){var t=null;return this.some(function(n){return n.cid==e&&(t=n)}),t},getModelById:function(e){var t=null;return this.some(function(n){return n.get("id")==e&&(t=n)}),t},getModel:function(e){return this._models[e]},toJSON:function(){var e=function(e){return e.toJSON()};return Array.map(this._models,e)},empty:function(e){return this.removeModel(this._models,e),this.fireEvent("empty")},sort:function(e){if(!e)return this._models.sort(),this.fireEvent("sort");if(typeof e=="function")return this.model.sort(e),this.fireEvent("sort");var t="asc",n=e.split(","),r=function(e,t){return e<t?-1:e>t?1:0};return this._models.sort(function(e,i){var s=0;return Array.some(n,function(n){n=n.trim();var o=n.split(":"),u=o[0],f=o[1]?o[1]:t,l=e.get(u),h=i.get(u),p=r(l,h),d={asc:p,desc:-p};return typeof d[f]=="undefined"&&(f=t),s=d[f],s!=0}),s}),this.fireEvent("sort")},reverse:function(){return Array.reverse(this._models),this.fireEvent("sort")},find:function(t){var n=e.Slick.parse(t),r=[],i=this,s={"=":function(e,t){return e==t},"!=":function(e,t){return e!=t},"^=":function(e,t){return e.indexOf(t)===0},"*=":function(e,t){return e.indexOf(t)!==-1},"$=":function(e,t){return e.indexOf(t)==e.length-t.length},"*":function(e){return typeof e!="undefined"}},o=function(e){return!e||!s[e]?null:s[e]},u=function(e){var t=e.key,n=e.value||null,r=e.tag||null,s=o(e.operator);i=i.filter(function(e){var i,o;return r&&t?(i=e.get(r),o=i?i[t]:null):r?o=e.get(r):o=e.get(t),o!==null&&n!==null&&s!==null?s(o,n):o!=null})};if(n.expressions.length){var a,f,l,c,h,p=n.expressions,d,v,m;e:for(f=0;c=p[f];f++){for(a=0;h=c[a];a++){l=h.attributes,d=h.id,d&&(v={key:"id",value:d,operator:"="},l||(l=[]),l.push(v)),m=h.tag,m&&m!="*"&&(l||(l=[{key:null,value:"",operator:"*"}]),l=Array.map(l,function(e){return e.tag=m,e}));if(!l)continue e;Array.each(l,u)}r[f]=i,i=this}}return[].combine(Array.flatten(r))},findOne:function(e){var t=this.find(e);return t.length?t[0]:null}});return Array.each(n,function(e){r.implement(e,function(){return Array.prototype[e].apply(this._models,arguments)})}),r};typeof define=="function"&&define.amd?define("epitome-collection",["./epitome-model"],t):e.Epitome.Collection=t(e.Epitome.Model)}(this),function(e){var t=function(e){var t="no-urlRoot-set",n="fetch:";return new Class({Extends:e,options:{urlRoot:t},initialize:function(e,t){this.setupSync(),this.parent(e,t)},setupSync:function(){var e=this,t=0,r=function(){t++};return this.getRequestId=function(){return t+1},this.request=new Request.JSON({link:"chain",url:this.options.urlRoot,emulation:this.options.emulateREST,onRequest:r,onCancel:function(){this.removeEvents(n+t)},onSuccess:function(r){r=e.parse&&e.parse(r),e.fireEvent(n+t,[[r]])},onFailure:function(){e.fireEvent(n+"error",[this.options.method,this.options.url,this.options.data])}}),this},parse:function(e){return e},fetch:function(e){return this._throwAwayEvent(function(t){e?(this.empty(),Array.each(t,this.addModel.bind(this))):this.processModels(t),this.fireEvent("fetch",[t])}),this.request.get(),this},processModels:function(e){var t=this;Array.each(e,function(e){var n=e.id&&t.getModelById(e.id);n?n.set(e):t.addModel(e)})},_throwAwayEvent:function(e){var t=n+this.getRequestId(),r=this,i={};if(!e||typeof e!="function")return;return i[t]=function(t){e.apply(r,t),r.removeEvents(i)},this.addEvents(i)}.protect()})};typeof define=="function"&&define.amd?define("epitome-collection-sync",["./epitome-collection"],t):e.Epitome.Collection.Sync=t(e.Epitome.Collection)}(this),function(e){var t=function(){return new Class({options:{evaluate:/<%([\s\S]+?)%>/g,normal:/<%=([\s\S]+?)%>/g,noMatch:/.^/,escaper:/\\|'|\r|\n|\t|\u2028|\u2029/g,unescaper:/\\(\\|'|r|n|t|u2028|u2029)/g},Implements:[Options],initialize:function(e){this.setOptions(e);var t=this.options.unescaper,n=this.escapes={"\\":"\\","'":"'",r:"\r",n:"\n",t:"	",u2028:"\u2028",u2029:"\u2029"};return Object.each(n,function(e,t){this[e]=t},n),this.unescape=function(e){return e.replace(t,function(e,t){return n[t]})},this},template:function(e,t){var n=this.options,r=this.escapes,i=this.unescape,s=n.noMatch,o=n.escaper,u,a=["var __p=[],print=function(){__p.push.apply(__p,arguments);};","with(obj||{}){__p.push('",e.replace(o,function(e){return"\\"+r[e]}).replace(n.normal||s,function(e,t){return"',\nobj['"+i(t)+"'],\n'"}).replace(n.evaluate||s,function(e,t){return"');\n"+i(t)+"\n;__p.push('"}),"');\n}\nreturn __p.join('');"].join(""),f=new Function("obj","_",a);return t?f(t):(u=function(e){return f.call(this,e)},u.source="function(obj){\n"+a+"\n}",u)}})};typeof define=="function"&&define.amd?define("epitome-template",["./epitome"],t):e.Epitome.Template=t(e.Epitome)}(this),function(e){var t=function(e,t,n){return new Class({Implements:[Options,Events],element:null,collection:null,model:null,options:{template:"",events:{}},initialize:function(e){return e&&e.collection&&(this.setCollection(e.collection),delete e.collection),e&&e.model&&(this.setModel(e.model),delete e.model),this.setOptions(e),this.options.element&&(this.setElement(this.options.element,this.options.events),delete this.options.element),this.fireEvent("ready")},setElement:function(e,t){return this.element&&this.detachEvents()&&this.destroy(),this.element=document.id(e),t&&this.attachEvents(t),this},setCollection:function(e){var t=this,r=function(e){return function(){t.fireEvent(e+":collection",arguments)}};return instanceOf(e,n)&&(this.collection=e,this.collection.addEvents({change:r("change"),fetch:r("fetch"),add:r("add"),remove:r("remove"),sort:r("sort"),reset:r("reset"),error:r("error")})),this},setModel:function(e){var n=this,r=function(e){return function(){n.fireEvent(e+":model",arguments)}};return instanceOf(e,t)&&(this.model=e,this.model.addEvents({change:r("change"),destroy:r("destroy"),empty:r("empty"),error:r("error")})),this},attachEvents:function(e){var t=this;return Object.each(e,function(e,n){t.element.addEvent(n,function(n){t.fireEvent(e,arguments)})}),this.element.store("attachedEvents",e),this},detachEvents:function(){var e=this.element.retrieve("attachedEvents");return e&&this.element.removeEvents(e).eliminate("attachedEvents"),this},template:function(t,n){n=n||this.options.template;var r=this.Template||(this.Template=new e);return r.template(n,t)},render:function(){return this.fireEvent("render")},empty:function(e){return e?this.element.empty():this.element.set("html",""),this.fireEvent("empty")},dispose:function(){return this.element.dispose(),this.fireEvent("dispose")},destroy:function(){return this.element.destroy(),this.fireEvent("destroy")}})};typeof define=="function"&&define.amd?define("epitome-view",["./epitome-template","./epitome-model","./epitome-collection"],t):e.Epitome.View=t(e.Epitome.Template,e.Epitome.Model,e.Epitome.Collection)}(this),function(e){var t=function(){var e="hashchange",t="on"+e in window,n=[window,document],r,i=function(e){var t={},n=/([^&=]+)=([^&]*)/g,r;while(r=n.exec(e))t[decodeURIComponent(r[1])]=decodeURIComponent(r[2]);return t};return Element.Events.hashchange={onAdd:function(){var i=location.hash,s=function(){if(i==location.hash)return;i=location.hash,n.invoke("fireEvent",e,i.indexOf("#")==0?i.substr(1):i)};t&&(window.onhashchange=s)||(r=s.periodical(100))},onRemove:function(){t&&(window.onhashchange=null)||clearInterval(r)}},new Class({Implements:[Options,Events],options:{triggerOnLoad:!0},routes:{},boundEvents:{},initialize:function(t){var n=this;this.setOptions(t),this.options.routes&&(this.routes=this.options.routes),window.addEvent(e,function(e){var t=location.hash,r=t.split("?")[0],s=t.split("?")[1]||"",o=!0,u;for(u in n.routes){var a=[],f=n.normalize(u,a,!0,!1),l=f.exec(r),c=!1;if(l){o=!1,n.req=l[0];var h=l.slice(1),p={};Array.each(h,function(e,t){typeof a[t]!="undefined"&&(p[a[t].name]=e)}),n.route=u,n.param=p||{},n.query=s&&i(s),c=n.routes[u],n.fireEvent("before",c),c&&n.$events[c]?(n.fireEvent(c+":before"),n.fireEvent(c,Object.values(n.param))):n.fireEvent("error",["Route",c,"is undefined"].join(" ")),n.fireEvent("after",c),c&&n.fireEvent(c+":after");break}}o&&n.fireEvent("undefined")}),this.fireEvent("ready"),this.options.triggerOnLoad&&window.fireEvent(e)},navigate:function(t,n){location.hash==t&&n?window.fireEvent(e):location.hash=t},normalize:function(e,t,n,r){return e instanceof RegExp?e:(e=e.concat(r?"":"/?").replace(/\/\(/g,"(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(e,n,r,i,s,o){return t.push({name:i,optional:!!o}),n=n||"",[o?"":n,"(?:",o?n:"",(r||"")+(s||r&&"([^/.]+?)"||"([^/]+?)")+")",o||""].join("")}).replace(/([\/.])/g,"\\$1").replace(/\*/g,"(.*)"),new RegExp("^"+e+"$",n?"":"i"))},addRoute:function(e){return!e||!e.route||!e.id||!e.events?this.fireEvent("error","Please include route, id and events in the argument object when adding a route"):e.id.length?this.routes[e.route]?this.fireEvent("error",'Route "{route}" or id "{id}" already exists, aborting'.substitute(e)):(this.routes[e.route]=e.id,this.addEvents(this.boundEvents[e.route]=e.events),this.fireEvent("route:add",e)):this.fireEvent("error","Route id cannot be empty, aborting")},removeRoute:function(e){return!e||!this.routes[e]||!this.boundEvents[e]?this.fireEvent("error","Could not find route or route is not removable"):(this.removeEvents(this.boundEvents[e]),delete this.routes[e],delete this.boundEvents[e],this.fireEvent("route:remove",e))}})};typeof define=="function"&&define.amd?define("epitome-router",["./epitome"],t):e.Epitome.Router=t(e.Epitome)}(this)