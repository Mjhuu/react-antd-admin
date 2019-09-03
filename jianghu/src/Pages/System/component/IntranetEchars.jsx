import React, {Component} from 'react';
import echarts from 'echarts'

class IntranetEchars extends Component {
    constructor(props){
        super(props);
        this.echarts = null;
        this.title = '网络(内网)';
        this.count = 0;
        this.colors = ['#58afed', 'rgb(242, 172, 56)', '#675bba'];
    }
    render() {
        this.count ++;
        if(this.count > 1){
            this._initEcharts();
        }
        return (
            <section id="intranet_box" className="intranet-box">

            </section>
        );
    }
    componentDidMount() {
        window.addEventListener('resize', ()=>{
            this.echarts.resize();
        })
    }
    _initEcharts(){
        let {IntranetRX, IntranetTX, IntranetX} = this.props;
        this.echarts = echarts.init(document.getElementById('intranet_box'));
        let option = {
            color: this.colors,
            title: {
                text: this.title
            },
            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data:['出网kbps', '入网kbps']
            },
            grid: {
                top: 70,
                bottom: 50
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: this.colors[1]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '入网kbps  ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: IntranetX
                },
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: this.colors[0]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '出网kbps  ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: IntranetX
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name:'出网kbps',
                    type:'line',
                    xAxisIndex: 1,
                    smooth: true,
                    data: IntranetTX,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1
                            }
                        }
                    }
                },
                {
                    name:'入网kbps',
                    type:'line',
                    smooth: true,
                    data: IntranetRX,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1
                            }
                        }
                    }
                }
            ]
        };
        this.echarts.setOption(option);
        this.props.loading ? this.echarts.showLoading() : this.echarts.hideLoading();
    }
}

export default IntranetEchars;
