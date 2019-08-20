import React, {Component} from 'react';

import MyHeader from './../Header/Header'
import MySider from './../Sider/Sider'
import MyContent from './../Content/Content'

import {withRouter} from 'react-router-dom'

import { Layout } from 'antd';
import './css/index.styl'

const { Sider } = Layout;

@withRouter
class LayOut extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            panes: [
                {
                    name: '系统设置',
                    key: '/layout',
                    closable: false
                }
            ], //打开的标签页列表
            activeMenu: '/layout',  //活动的菜单
        }
    }
    render() {
        let {collapsed, panes, activeMenu} = this.state;
        return (
            <div className="out-box">
                <Layout className="out-box">
                    <div className="outer-contain" style={{
                        maxWidth: !this.state.collapsed ? '200px' : '80px'
                    }}>
                        <Sider trigger={null} collapsible collapsed={this.state.collapsed} className="sider-box">
                            <div className="logo">
                                <svg onClick={() => this.backHome()} style={{
                                    transform: !this.state.collapsed ? 'scale(.8)' : 'scale(.6)', cursor: 'pointer'
                                }} t="1566194943703" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" p-id="1831" width="200" height="200">
                                    <path
                                        d="M150.588235 0h722.82353c83.169882 0 150.588235 67.418353 150.588235 150.588235v722.82353c0 83.169882-67.418353 150.588235-150.588235 150.588235H150.588235C67.418353 1024 0 956.581647 0 873.411765V150.588235C0 67.418353 67.418353 0 150.588235 0z m354.725647 475.196235a132.186353 132.186353 0 1 0 0-264.372706 132.186353 132.186353 0 0 0 0 264.372706z m32.933647 30.765177a30.117647 30.117647 0 0 0-18.236235 27.678117v249.072942a30.117647 30.117647 0 0 0 41.110588 28.02447 546.846118 546.846118 0 0 1 83.727059-25.449412 487.604706 487.604706 0 0 1 95.247059-11.248941 30.117647 30.117647 0 0 0 29.590588-30.117647V490.661647a30.117647 30.117647 0 0 0-31.503059-30.087529c-32.768 1.505882-65.249882 5.767529-97.445647 12.754823a560.986353 560.986353 0 0 0-102.490353 32.632471z m-65.852235 0a560.986353 560.986353 0 0 0-102.490353-32.632471 585.728 585.728 0 0 0-97.460706-12.754823A30.117647 30.117647 0 0 0 240.941176 490.661647v253.259294a30.117647 30.117647 0 0 0 29.605648 30.117647 487.604706 487.604706 0 0 1 95.232 11.248941c28.16 6.113882 56.079059 14.607059 83.727058 25.449412a30.117647 30.117647 0 0 0 41.110589-28.039529v-249.072941a30.117647 30.117647 0 0 0-18.221177-27.663059z"
                                        fill="#ffffff" p-id="1832"></path>
                                </svg>
                            </div>
                            <MySider
                                panes={panes}
                                activeMenu={activeMenu}
                                onChangeState={this._setState}
                            />
                        </Sider>
                    </div>
                    <Layout>
                        <MyHeader
                            collapsed={collapsed}
                            onChangeState={this._setState}
                        />
                        <MyContent
                            panes={panes}
                            activeMenu={activeMenu}
                            onChangeState={this._setState}
                        >
                            {this.props.children}
                        </MyContent>
                    </Layout>
                </Layout>
            </div>
        );
    }
    _setState = async (obj) => {
        await this.setState(obj);
    };
    async backHome(){
        await this.setState({
            activeMenu: '/layout'
        });
        this.props.history.replace('/layout');
    }
    componentDidMount() {

    }
}

export default LayOut;
