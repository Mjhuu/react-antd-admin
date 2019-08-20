export function setCookie(key, value, day, path) {
    //1、处理默认保存的路径
    let index = window.location.pathname.lastIndexOf('/');
    let currentPath = window.location.pathname.slice(0,index);
    // path = path || currentPath;
    path = '/';
    //2、处理默认保存的domain
    // let domain = 'hotsalevideo.com';//上线打开
    //测试专用
    //3、处理默认的过期时间
    if(!day){
        document.cookie = key+"="+value+";path="+path;
    }else {
        let date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = key+"="+value+";expires="+date.toGMTString()+";path="+path;
    }
    /*//上线打开
    //3、处理默认的过期时间
    if(!day){
        document.cookie = key+"="+value+";path="+path+";domain="+domain;
    }else {
        let date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = key+"="+value+";expires="+date.toGMTString()+";path="+path+";domain="+domain;
    }*/
}
export function getCookie(key) {
    let res = document.cookie.split(';');
    for(let i =0;i< res.length;i++){
        let temp = res[i].split('=');
        if(temp[0].trim() === key){
            return temp[1];
        }
    }
}
export function delCookie(key, path) {
    setCookie(key,getCookie(key),-1,path);
}

