import ajax from './ajax'

export const reqIpAndAddress = (data)=>ajax('https://apis.map.qq.com/ws/location/v1/ip', data);
