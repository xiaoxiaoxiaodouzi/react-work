import isoFetch from "isomorphic-fetch";
import { base } from '../services/base'


//覆盖原生的fetch方法，解决mock不生效的问题
// eslint-disable-next-line
fetch = isoFetch;
/**
 * 将对象转为'key=value'字符串数组，用来拼接到url上。
 * 对象值为数组也能处理成key=a&key=b
 * @param {Object} params query参数对象
 */
const getQueryParams = params => {
    let queryParams = [];
    if (params) {
        for (let key in params) {
            let value = params[key];
            if (Array.isArray(value)) {
                value.forEach(v => {
                    queryParams.push(key + "=" + v);
                })
            } else if (value !== undefined && value !== "") queryParams.push(key + "=" + params[key]);
        }
    }
    return queryParams
}
/**
 * 处理请求返回，如果有正确返回内容，转json。如果返回数据为空(204)，返回空的promise；
 * 如果错误返回，做错误处理
 * @param {Object} response 请求的返回数据
 * @param {String/boolean} errorMessage 错误信息
 */
const responseHandle = (response, errorMessage) => {
    if (response.ok) {
        //如果返回内容为空，返回一个空的Promise对象，确保能够正确进入then的回调
        if (response.status === 204) return new Promise((resolve, reject) => { resolve() });
        else {
            if (response.headers&&response.headers.get('Content-Type')&&response.headers.get('Content-Type').indexOf('application/json') !== -1) {
                return response.json();
            }
            return response.text();
        }
    } else return remoteErrorHandle(errorMessage, response);
}
/**
 * 请求错误的处理。
 * 如果errorMessage为false或者undefined，不显示错误信息；
 * 如果errorMessage指定为字符串，显示指定的错误信息；
 * 如果errorMessage为true，智能显示错误信息：如果请求返回信息中包含errorMessage，显示errorMessage信息；如果没有，显示defaultMessage指定的默认信息；如果未定义，显示“后台错误！”；
 * 不管错误信息是否显示，都会抛出"请求xxx出错"的异常，可以在catch(error)中捕获，并且能够从error.response中拿到请求返回的数据。
 * 抛出异常之后不会再进入then回调。
 * @param {String/boolean} errorMessage 指定错误信息显示
 * @param {Object} response 请求再错误情况下的返回数据
 * @param {String} defaultMessage 指定默认的错误信息
 */
const remoteErrorHandle = (errorMessage, response, defaultMessage) => {
    return new Promise((resolve, reject) => {
        reject(response);
        if (response.status === 401 || response.status === 402) {
            if(base.safeMode){
                window.location.href = '#/login';
            }else{
                let loginUrl = response.headers.get('loginurl');
                // if(window.location.href.endsWith('#/')){
                //     window.location.reload();
                // }else{
                    window.location.href = loginUrl
                // }
            }
        } else {
            if (errorMessage === undefined) errorMessage = true;
            if (errorMessage) {
                let info = defaultMessage || "后台错误！",description;
                if (typeof errorMessage === "string") info = errorMessage;
                response.json().then(jsonRes => {
                    if (jsonRes.errorMessage && errorMessage === true){
                        info = jsonRes.errorMessage;
                    }else description = jsonRes.errorMessage;
                    base.ampMessage(info,description);
                }).catch(error => {
                    base.ampMessage(info);
                });
            } else {
                var error = new Error("请求:" + response.url + " 出错！");
                error.response = response;
                throw error;
            }
        }
    })
}

const getAmpEnvId = () => {
    if(base.environment){
        return base.environment;
    }
}
const getSafeMode = ()=>{
    return base.safeMode;
}
const getHttpHeader = (headers)=>{
    let baseHttpHeaders = { 'accept': 'application/json','Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'AMP-ENV-ID': getAmpEnvId()};
    if(!baseHttpHeaders['Safe-Mode']&&getSafeMode())baseHttpHeaders['Safe-Mode'] = true;
    let httpHeaders = Object.assign(baseHttpHeaders,headers);
    // if(!httpHeaders['AMP-ENV-ID'])message.warning('没有选中任何环境！');
    return httpHeaders;
}

class C2Fetch {
    static urlBase = "";
    static get(url, params, errorMessage, headers) {
        let queryParams = getQueryParams(params);
        let queryUrl = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
        let httpHeaders = getHttpHeader(headers);
        return fetch(this.urlBase + url + queryUrl, { credentials: "include", headers: httpHeaders }).then(response => responseHandle(response, errorMessage));
    }
    static post(url, bodyParams, queryParams, errorMessage, headers) {
        let parray = getQueryParams(queryParams);
        let queryUrl = parray.length > 0 ? "?" + parray.join("&") : "";
        return fetch(this.urlBase + url + queryUrl, {
            method: "POST", credentials: "include",
            headers: getHttpHeader(headers),
            body: typeof bodyParams === 'string' ? bodyParams : JSON.stringify(bodyParams)
        }).then(response => responseHandle(response, errorMessage));
    }
    static put(url, bodyParams, queryParams, errorMessage) {
        let parray = getQueryParams(queryParams);
        let queryUrl = parray.length > 0 ? "?" + parray.join("&") : "";
        return fetch(this.urlBase + url + queryUrl, {
            method: "PUT", credentials: "include",
            headers: getHttpHeader(),
            body: JSON.stringify(bodyParams)
        }).then(response => responseHandle(response, errorMessage));
    }
    static delete(url, params, errorMessage) {
        let queryParams = getQueryParams(params);
        let queryUrl = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
        return fetch(this.urlBase + url + queryUrl, {
            method: "DELETE", credentials: "include",
            headers: getHttpHeader()
        }).then(response => responseHandle(response, errorMessage));
    }

    static postFile(url, file, queryParams, errorMessage, headers) {
        let parray = getQueryParams(queryParams);
        let queryUrl = parray.length > 0 ? "?" + parray.join("&") : "";
        return fetch(this.urlBase + url + queryUrl, {
            method: "POST", credentials: "include",
            headers:{'X-Requested-With': 'XMLHttpRequest','AMP-ENV-ID': getAmpEnvId()},
            body: file
        }).then(response => responseHandle(response, errorMessage));
    }

    /**
     * 
     * @param {String} url 下载url,必须返回一个文件流
     * @param {String} fileName 下载的文件名称
     */
    static download(url,fileName,errorMessage){
        fetch(url,{headers:getHttpHeader()}).then(res=>{
            if(res.ok){
                res.blob().then(blob=>{
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    // var filename = res.headers.get('Content-Disposition');
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);       
                })
            }else{  
                remoteErrorHandle(errorMessage,res);
            }
        });
    }
}

export default C2Fetch;