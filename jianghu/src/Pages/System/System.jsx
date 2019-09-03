import React, {Component} from 'react';

import moment from 'moment'

import {message, DatePicker} from "antd";
import {getSystemInfo, getCpuData} from './../../Api/index'

import CpuEchars from './component/CpuEchars'
import InternetEchars from './component/InternetEchars'
import IntranetEchars from './component/IntranetEchars'

import './css/index.styl'

const { RangePicker } = DatePicker;

/*不可选择的日期*/
function disabledDate(current) {
    return current && current > moment().endOf('day');
}

class System extends Component {
    constructor(props) {
        let StartTime = new Date();
        let EndTime = new Date();
        StartTime.setMinutes(EndTime.getMinutes() - 60);
        super(props);
        this.state = {
            sysTemInfo: {},
            configurationInfo: {
                Cpu: {name: 'CPU', value: ''},
                Memory: {name: '内存', value: ''},
                IoOptimized: {name: '实例类型', value: ''},
                OSName: {name: '操作系统', value: ''},
                IpAddress: {name: '公网IP', value: '', color: true},
                PrimaryIpAddress: {name: '私有IP', value: '', color: true},
                InternetChargeType: {name: '带宽计费方式', value: ''},
                InternetMaxBandwidthOut: {name: '当前使用带宽', value: ''},
                VpcId: {name: '专有网络', value: '', color: true},
                VSwitchId: {name: '虚拟交换机', value: '', color: true}
            }, //配置信息
            payInfo: {
                PayType: {name: '付费方式', value: ''},
                ExpiredTime: {name: '到期时间', value: ''},
                AutoType: {name: '自动续费（续费周期）', value: '', color: true},
                CreationTime: {name: '创建时间', value: ''}
            }, //付费信息
            dateFormat: 'YYYY/MM/DD HH:mm',
            StartTime,
            EndTime,
            cpuInfo: [], //Cpu信息
            cpuX: [],
            cpuY: [],
            InternetRX: [], // 外网入网数据流量
            InternetTX: [], // 外网出网数据流量
            InternetX: [], // 外网横坐标
            IntranetRX: [], // 内网入网数据流量
            IntranetTX: [], // 内网出网数据流量
            IntranetX: [], // 内网横坐标
            cpuShow: false,
        };
    }

    render() {
        let {sysTemInfo, configurationInfo, payInfo, dateFormat, StartTime, EndTime, cpuX, cpuY, cpuShow, InternetRX, InternetTX, IntranetRX, IntranetTX, InternetX, IntranetX} = this.state;
        return (
            <div className="system-box">
                <div className="left">
                    {/*配置信息*/}
                    <section>
                        <h2>配置信息</h2>
                        <ul>
                            {
                                Object.keys(configurationInfo).map((key) => (
                                    <li key={key}>
                                        <div className="left">
                                            {configurationInfo[key].name}：
                                        </div>
                                        <div style={ configurationInfo[key].color ? {color: '#06C', cursor: 'pointer'} : {}} className="right">
                                            {configurationInfo[key].value}
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </section>
                    {/*付费信息*/}
                    <section>
                        <h2>付费信息</h2>
                        <ul>
                            {
                                Object.keys(payInfo).map((key) => (
                                    <li key={key}>
                                        <div className="left">
                                            {payInfo[key].name}：
                                        </div>
                                        <div className="right">
                                            <span style={ payInfo[key].color ? {color: 'red', cursor: 'pointer'} : {}}>
                                                {payInfo[key].value}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </section>
                </div>
                <div className="right">
                    <section className="base-status">
                        <div className="left">
                            {
                                sysTemInfo.status ? (
                                    <svg t="1566430361337" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="1840" width="200" height="200">
                                        <path
                                            d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512S793.6 1024 512 1024zM512 57.6C262.4 57.6 57.6 262.4 57.6 512s204.8 454.4 454.4 454.4 454.4-204.8 454.4-454.4S761.6 57.6 512 57.6z"
                                            p-id="1841" fill="#009900"></path>
                                        <path d="M384 332.8 742.4 512 384 691.2Z" p-id="1842" fill="#009900"></path>
                                    </svg>
                                ) : (
                                    <svg t="1566430361337" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="1840" width="200" height="200">
                                        <path
                                            d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512S793.6 1024 512 1024zM512 57.6C262.4 57.6 57.6 262.4 57.6 512s204.8 454.4 454.4 454.4 454.4-204.8 454.4-454.4S761.6 57.6 512 57.6z"
                                            p-id="1841" fill="#d81e06"></path>
                                        <path d="M384 332.8 742.4 512 384 691.2Z" p-id="1842" fill="#d81e06"></path>
                                    </svg>
                                )
                            }
                            <p style={{color: sysTemInfo.status ? "#090" : "#d81e06"}}>{sysTemInfo.status ? '运行中' : '已停止'}</p>
                        </div>
                        <div className="right">
                            <ul>
                                <li>
                                    <span style={{color: '#999'}}>网络类型： </span>{sysTemInfo.InstanceNetworkType}
                                </li>
                                <li>
                                    <span style={{color: '#999'}}>付费方式： </span>{payInfo['PayType'].value} <span style={{color: 'red', cursor: 'pointer'}}>{payInfo['AutoType'].value}</span>
                                </li>
                                <li>
                                    <span style={{color: '#999'}}>到期时间： </span>{payInfo['ExpiredTime'].value}
                                </li>
                            </ul>
                        </div>
                    </section>
                    {/*监控信息*/}
                    <section className="control">
                        <nav>
                            <span>监控信息</span>
                            <RangePicker defaultValue={[moment(StartTime, dateFormat), moment(EndTime, dateFormat)]}
                                showTime
                                disabledDate={disabledDate}
                                format={dateFormat}
                                onChange={this.dataChange}
                                onOk={() => this._reqCpuData()}
                            />
                        </nav>
                        <CpuEchars
                            cpuX={cpuX}
                            cpuY={cpuY}
                            loading={!cpuShow}
                        />
                        {/* 外网出入网 */}
                        <InternetEchars
                            InternetX={InternetX}
                            title={"网络(外网)"}
                            InternetRX={InternetRX}
                            InternetTX={InternetTX}
                            loading={!cpuShow}
                        />
                        {/* 内网出入网 */}
                        <IntranetEchars
                            IntranetX={IntranetX}
                            IntranetRX={IntranetRX}
                            IntranetTX={IntranetTX}
                            loading={!cpuShow}
                        />
                    </section>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._reqSystemInfo();
        this._reqCpuData();
    }
    dataChange = (dates, dateStrings) =>{
        let {StartTime, EndTime} = this.state;
        StartTime = dateStrings[0];
        EndTime = dateStrings[1];
        this.setState({
            StartTime: new Date(StartTime),
            EndTime: new Date(EndTime)
        })
    };
    /*获取Cpu信息*/
    async _reqCpuData(){
        let {StartTime, EndTime, dateFormat, cpuX, cpuY, InternetRX, InternetTX, IntranetRX, IntranetTX, InternetX, IntranetX} = this.state;
        let dateV = moment(EndTime).diff(moment(StartTime), 'hour');
        let Period = 60;
        if(dateV <= 6){
            Period = 60
        }else if(dateV <= 24){
            Period = 600
        }else if(dateV < 24 * 15){
            Period = 3600
        }else {
            return message.warning('查询间隔日期不得超过15天');
        }
        this.setState({
            cpuShow: false,
        });
        cpuY = [];
        cpuX = [];
        InternetRX = [];
        InternetTX = [];
        InternetX = [];
        IntranetRX = [];
        IntranetTX = [];
        IntranetX = [];
        let data = await getCpuData({
            StartTime: moment(StartTime).format(dateFormat),
            EndTime: moment(EndTime).format(dateFormat),
            Period
        });
        if(data.code === 200){
            let cpuInfo = data.result.MonitorData.InstanceMonitorData;
            cpuInfo.forEach(v =>{
                let formatTime = moment(v.TimeStamp).format(dateFormat);
                if(v.CPU){
                    cpuX.push(formatTime);
                    cpuY.push(v.CPU);
                }
                if(v.InternetRX && v.InternetTX){
                    InternetRX.push(v.InternetRX);
                    InternetTX.push(v.InternetTX);
                    InternetX.push(formatTime);
                }
                if(v.IntranetRX && v.IntranetTX){
                    IntranetRX.push(v.IntranetRX);
                    IntranetTX.push(v.IntranetTX);
                    IntranetX.push(formatTime);
                }
            });
            this.setState({
                cpuInfo, cpuY, cpuX, InternetRX, InternetTX, IntranetRX, IntranetTX,InternetX, IntranetX, cpuShow: true
            })
        }else {
            message.warning(data.data);
        }
    }
    /*获取系统信息*/
    async _reqSystemInfo(){
        let data = await getSystemInfo();
        if(data.code === 200){
            let {sysTemInfo, configurationInfo, payInfo} = this.state;
            sysTemInfo = data.result.Instances.Instance[0];
            configurationInfo['Cpu'].value = sysTemInfo.Cpu + '核';
            configurationInfo['Memory'].value = sysTemInfo.Memory / 1024 + 'GiB';
            configurationInfo['IoOptimized'].value = sysTemInfo.IoOptimized ? ' I/O优化' : '非I/O优化';
            configurationInfo['OSName'].value = sysTemInfo.OSName;
            configurationInfo['IpAddress'].value = sysTemInfo.PublicIpAddress.IpAddress[0];
            configurationInfo['PrimaryIpAddress'].value = sysTemInfo.NetworkInterfaces.NetworkInterface[0].PrimaryIpAddress;
            configurationInfo['InternetChargeType'].value = sysTemInfo.InternetChargeType === 'PayByBandwidth' ? '按带宽计费' : '按流量计费';
            configurationInfo['InternetMaxBandwidthOut'].value = sysTemInfo.InternetMaxBandwidthOut + 'Mbps';
            configurationInfo['VpcId'].value = sysTemInfo.VpcAttributes.VpcId;
            configurationInfo['VSwitchId'].value = sysTemInfo.VpcAttributes.VSwitchId;
            payInfo['PayType'].value = '包年包月';
            payInfo['AutoType'].value = '(手动续费)';
            payInfo['ExpiredTime'].value = moment(sysTemInfo.ExpiredTime).format('YYYY-MM-DD HH:mm:ss') + ' 到期';
            payInfo['CreationTime'].value = moment(sysTemInfo.CreationTime).format('YYYY-MM-DD HH:mm:ss');
            sysTemInfo.InstanceNetworkType = String(sysTemInfo.InstanceNetworkType).toLowerCase() === 'vpc' ? '专有网络' : '经典网络';
            sysTemInfo.status = String(sysTemInfo.Status).toLowerCase() === "running";
            this.setState({
                sysTemInfo, configurationInfo, payInfo
            });
        }else {
            message.warning(data.data);
        }
    }
}

export default System;
