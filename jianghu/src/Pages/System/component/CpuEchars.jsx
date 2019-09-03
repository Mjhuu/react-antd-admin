import React, {Component} from 'react';
import echarts from 'echarts'

class CpuEchars extends Component {
    constructor(props) {
        super(props);
        this.echarts = null;
        this.title = 'CPU';
        this.count = 0;
    }

    render() {
        this.count++;
        if (this.count > 1) {
            this._initEcharts();
        }
        return (
            <section id="cpu_box" className="cpu-box">

            </section>
        );
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.echarts.resize();
        })
    }

    _initEcharts() {
        let {cpuX, cpuY} = this.props;
        this.echarts = echarts.init(document.getElementById('cpu_box'));
        let option = {
            title: {
                text: this.title
            },
            tooltip: {},
            legend: {
                data: ['CPU使用率（%）']
            },
            xAxis: {
                type: 'category',
                data: cpuX,
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'CPU使用率（%）',
                data: cpuY,
                type: 'line',
                color: ['#58afed'], //折线颜色
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            }]
        };
        this.echarts.setOption(option);
        this.props.loading ? this.echarts.showLoading() : this.echarts.hideLoading();
    }
}

export default CpuEchars;
