import {getIpAndAddress} from "../ajax";
const Core = require('@alicloud/pop-core');

let client = new Core({
    accessKeyId: 'LTAIki4qMD7dYkqi',
    accessKeySecret: '36iFH90NM4W7LAOS0pOFroibgjNHc3',
    endpoint: 'https://ecs.aliyuncs.com',
    apiVersion: '2014-05-26'
});

function timeToZ(date){
    return (JSON.stringify(new Date(date)).substr(1, JSON.stringify(new Date(date)).lastIndexOf('.') - 1)+'Z')
}
class AliController {
    /*获取系统信息*/

    systemInfo(req, res, next){
        let params = {
            "RegionId": "cn-shanghai"
        };
        let requestOption = {
            method: 'POST'
        };
        client.request('DescribeInstances', params, requestOption).then((result) => {
            return res.json({
                code: 200,
                result
            })
        }, (ex) => {
            return res.json({
                code: 500,
                data: '服务器内部错误',
                err: ex
            })
        });
    }
    /*获取cpu信息*/
    cpuData(req, res, next) {
        let {StartTime, EndTime, Period} = req.query;

        let params = {
            "RegionId": "cn-shanghai",
            "InstanceId": "i-uf668brirm0afksq9ixk",
            "StartTime": timeToZ(StartTime),
            "EndTime": timeToZ(EndTime),
            "Period": Period
        };
        let requestOption = {
            method: 'POST'
        };
        client.request('DescribeInstanceMonitorData', params, requestOption).then((result) => {
            return res.json({
                code: 200,
                result
            })
        }, (ex) => {
            return res.json({
                code: 500,
                data: '服务器内部错误',
                err: ex
            })
        });
    }
}

export default new AliController();
