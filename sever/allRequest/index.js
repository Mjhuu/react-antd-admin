import {reqIpAndAddress} from "../ajax";

export const getIpAndAddress = async (req)=>{
    let ip = req.ip.split(':').pop();
    let res = await reqIpAndAddress({
        key: 'RUDBZ-4SML6-MY2SQ-M57GK-YRW7V-55F2S',
        // ip //上线时打开
    });
    if (res.status === 0) {
        return res.result
    } else {
        return {code: 500, data: '获取ip地址失败'}
    }
};