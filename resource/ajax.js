/**
 * 原生ajax封装
 * author:JM
 * Released on: August 11, 2016
 * @param {String} [param.type="get"]-post或get不区分大小写
 * @param {String} param.url - 请求地址
 * @param {Object} param.data - {a:1,b:2}
 * @param {String} [param.dataType = 'json'] - 预期服务器返回的数据类型 {'xml','text','json'}
 * @param {Boolean} [param.async=true] true为异步 false为同步
 * @param {Function} param.success 成功函数返回responseText
 * @param {Function} param.error 失败返回xhr对象
 */
;(function (window,undefined) {
    "use strict";
    var ajax = function (param){
        var xhr;
        if(typeof XMLHttpRequest !== 'undefined'){
            xhr =  new XMLHttpRequest();
        }else if(typeof ActiveXObject !== 'undefined'){
            var version = [
                "MSXML2.XMLHttp.6.0",
                "MSXML2.XMLHttp.3.0",
                "MSXML2.XMLHttp"
            ];
            for (var i=0;i< version.length;i++){
                try{
                    xhr = new ActiveXObject(version[i]);
                }catch (e){
                    //跳过
                }
            }
        }else{
            throw new Error("Your browser don't support SHR object !");
        }
        var url = param.url;
        var data = (function(data){
            var arr = [];
            for(var i in data){
                arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
            }
            return arr.join("&");
        })(param.data);
        var dataType = param.dataType || 'json';
        var type = param.type || 'GET';
        if(type.toUpperCase() === 'GET'){
            url += url.indexOf("?") === -1 ? "?"+ data:"&"+data;
        }
        var async = typeof param.async === 'undefined'? true : param.async;
        xhr.open(type,url,async);
        if(type.toUpperCase() === 'POST'){
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(data);
        }else{
            xhr.send(null);
        }
        //异步
        if(async === true){
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    getDataBack(xhr);
                    xhr = null;
                }
            }
        }else{
            getDataBack(xhr);
            xhr = null;
        }
        function getDataBack(xhr) {
            if(xhr.status === 200){
                if (dataType.toUpperCase() === "TEXT"){
                    if (param.success !== null){
                        param.success(xhr.responseText); // 普通文本
                    }
                }else if(dataType.toUpperCase() === "XML"){
                    if (param.success !== null){
                        param.success(xhr.responseXML); // 接收xml文档
                    }
                }else if (dataType.toUpperCase() === "JSON"){
                    if (param.success !== null) {
                        try{
                            param.success(eval("("+xhr.responseText+")")); //将json字符串转换为js对象)
                        }catch (e){
                            param.error(xhr.responseText);
                        }
                    }
                }
            }else{
                param.error(xhr);
            }

        }
    };
    window.ajax = ajax;
})(window);

// readyState有五种状态：
// 0 (未初始化)： (XMLHttpRequest)对象已经创建，但还没有调用open()方法；
// 1 (载入)：已经调用open() 方法，但尚未发送请求；
// 2 (载入完成)： 请求已经发送完成；
// 3 (交互)：可以接收到部分响应数据；
// 4 (完成)：已经接收到了全部数据，并且连接已经关闭。

// 如此一来，你应该就能明白readyState的功能，而status实际是一种辅状态判断，只是status更多是服务器方的状态判断。关于status，由于它的状态有几十种，我只列出平时常用的几种：
// 100——客户必须继续发出请求
// 101——客户要求服务器根据请求转换HTTP协议版本
// 200——成功
// 201——提示知道新文件的URL
// 300——请求的资源可在多处得到
// 301——删除请求数据
// 404——没有发现文件、查询或URl
// 500——服务器产生内部错误

