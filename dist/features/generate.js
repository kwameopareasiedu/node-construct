/* node-construct@v0.4.0 */
"use strict";var __awaiter=this&&this.__awaiter||function(e,i,l,s){return new(l=l||Promise)(function(t,r){function o(e){try{n(s.next(e))}catch(e){r(e)}}function a(e){try{n(s.throw(e))}catch(e){r(e)}}function n(e){var r;e.done?t(e.value):((r=e.value)instanceof l?r:new l(function(e){e(r)})).then(o,a)}n((s=s.apply(e,i||[])).next())})},__generator=this&&this.__generator||function(t,o){var a,n,i,l={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},e={next:r(0),throw:r(1),return:r(2)};return"function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function r(r){return function(e){return function(r){if(a)throw new TypeError("Generator is already executing.");for(;l;)try{if(a=1,n&&(i=2&r[0]?n.return:r[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,r[1])).done)return i;switch(n=0,i&&(r=[2&r[0],i.value]),r[0]){case 0:case 1:i=r;break;case 4:return l.label++,{value:r[1],done:!1};case 5:l.label++,n=r[1],r=[0];continue;case 7:r=l.ops.pop(),l.trys.pop();continue;default:if(!(i=0<(i=l.trys).length&&i[i.length-1])&&(6===r[0]||2===r[0])){l=0;continue}if(3===r[0]&&(!i||r[1]>i[0]&&r[1]<i[3])){l.label=r[1];break}if(6===r[0]&&l.label<i[1]){l.label=i[1],i=r;break}if(i&&l.label<i[2]){l.label=i[2],l.ops.push(r);break}i[2]&&l.ops.pop(),l.trys.pop();continue}r=o.call(t,l)}catch(e){r=[6,e],n=0}finally{a=i=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,e])}}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.generate=void 0;var path=require("path"),recast_1=require("recast"),moment=require("moment"),prettier_1=require("prettier"),lodash_1=require("lodash"),log_1=require("../core/log"),path_1=require("../core/path"),misc_1=require("../core/misc"),file_1=require("../core/file"),folder_1=require("../core/folder"),name_1=require("../core/name");exports.generate=function(m,_,h,v){return __awaiter(void 0,void 0,void 0,function(){var r,t,o,a,n,i,l,s,p,c,u,d,f;return __generator(this,function(e){return folder_1.createFolder(path.resolve(m,h)),folder_1.createFolder(path.resolve(m,_)),ensureObjectionConfig(m,_),ensureRootModel(m,_),r=name_1.generateModelNameFrom(v),t=name_1.generateModelFolderNameFrom(v),o=name_1.generateDatabaseTableNameFrom(v),a=path.resolve(__dirname,"../../templates/model.js.ejs"),n=file_1.renderTemplate(a,{modelName:r,databaseTableName:o}),i=path.resolve(m,_,t),l=path.resolve(i,"index.js"),folder_1.createFolder(i),file_1.writeFile(l,prettier_1.format(n,misc_1.prettierConfig)),s=path.resolve(__dirname,"../../templates/model-migration.js.ejs"),p=file_1.renderTemplate(s,{databaseTableName:o}),c=path.resolve(m,h,moment().format("YYYYMMDDHHmmssSSS")+"_create_"+o+"_table.js"),file_1.writeFile(c,prettier_1.format(p,misc_1.prettierConfig)),u=path.resolve(__dirname,"../../templates/model-crud.js.ejs"),d=file_1.renderTemplate(u,{modelName:r}),f=path.resolve(i,"crud.js"),file_1.writeFile(f,prettier_1.format(d,misc_1.prettierConfig)),updateDBRootIndex(m,_),log_1.logSuccess("Successfully generated "+r+" model and related files!\n"),[2]})})};var ensureObjectionConfig=function(e,r){var t,o=path.resolve(e,"knexfile.js"),a=path.resolve(e,r,"config.js"),n=path.relative(path.resolve(e,r),o),i=path.resolve(__dirname,"../../templates/objection-config.js.ejs");path_1.pathExists(a)||(t=file_1.renderTemplate(i,{knexfilePath:n}),file_1.writeFile(a,t),log_1.logSuccess("Objection config file created!\n"))},ensureRootModel=function(e,r){var t=path.resolve(e,r,"root.js"),o=path.resolve(__dirname,"../../templates/root-model.js.ejs");path_1.pathExists(t)||(file_1.writeFile(t,file_1.readFile(o)),log_1.logSuccess("Root model created!\n"))},updateDBRootIndex=function(e,r){var t={type:"Program",body:[{type:"ExpressionStatement",expression:{type:"AssignmentExpression",operator:"=",left:{type:"MemberExpression",object:{type:"Identifier",name:"module"},property:{type:"Identifier",name:"exports"},computed:!1},right:{type:"ObjectExpression",properties:folder_1.readFolder(path.resolve(e,r),folder_1.FolderContent.FOLDER).map(function(e){return{type:"Property",method:!1,shorthand:!1,computed:!1,key:{type:"Identifier",name:lodash_1.camelCase(e)},value:{type:"CallExpression",callee:{type:"Identifier",name:"require"},arguments:[{type:"Literal",value:e,raw:'"'+e+'"'}]},kind:"init"}})}}}],sourceType:"module"},o=path.resolve(e,r,"index.js");file_1.writeFile(o,prettier_1.format(recast_1.print(t).code,misc_1.prettierConfig))};