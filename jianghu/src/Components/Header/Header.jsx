import React, {Component} from 'react';
import {Icon, Layout, Avatar, Badge, Dropdown, Menu, Modal} from "antd";
import {withRouter} from 'react-router-dom'
import './css/index.styl'
import screenfull from "screenfull";
import {connect} from "react-redux";
import HeadImg from './../../Common/images/headImg.png'
import config from "../../Config";

const {Header} = Layout;
const { confirm } = Modal;

const store = connect(
    state => ({
        adminInfo: state.adminInfo,
    }),
    null
);

@store @withRouter
class MyHeader extends Component {
    state = {
        isFullscreen: false, //控制全屏
    };
    render() {
        let {adminInfo} = this.props;
        return (
            <Header
                style={{background: '#fff', padding: 0, position: 'relative', overflow: 'hidden', userSelect: 'none'}}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}
                />
                <ul className="head-nav">
                    <li>
                        <Dropdown overlay={() =>this.initMenu()}>
                            <div>
                                <Badge count={0}>
                                    <Avatar src={adminInfo.admin && adminInfo.admin.headImg ? adminInfo.admin.headImg : HeadImg} style={{border: '.1rem solid #f1f1f1'}} size={40} icon="user"/>
                                </Badge>
                                <span style={{paddingLeft: '.6rem'}}>{adminInfo.admin && adminInfo.admin.username}
                            </span>
                            </div>
                        </Dropdown>
                    </li>
                </ul>
            </Header>
        );
    }

    initMenu(){
        let {isFullscreen} = this.state;
        return (
            <Menu onClick={(e) =>this.handleMenuClick(e)}>
                <Menu.ItemGroup title="用户中心">
                    <Menu.Item key="/layout/mine">
                        <Icon type="user"/>
                        个人中心
                    </Menu.Item>
                    <Menu.Item key="loginOut">
                        <Icon type="logout" />
                        退出登录
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="设置中心">
                    <Menu.Item key="isFullscreen">
                        <Icon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} />
                        切换全屏
                    </Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        )
    }

    async handleMenuClick(e) {
        const panes = this.props.panes.slice();
        const activeMenu = e.key;
        switch (e.key) {
            case '/layout/mine':
                if (!panes.find(i => i.key === activeMenu)) {
                    panes.push({
                        name: '个人中心',
                        key: activeMenu
                    })
                }
                await this.props.onChangeState({
                    panes,
                    activeMenu
                });
                this.props.history.replace(e.key);
                break;
            case 'loginOut':
                this.loginOut();
                break;
            case 'isFullscreen':
                this.toggleFullscreen();
                break;
            default:
                break
        }
    }
    //切换全屏
    toggleFullscreen = () => {
        if (screenfull.enabled) {
            screenfull.toggle().then(() => {
                this.setState({
                    isFullscreen: screenfull.isFullscreen
                })
            });
        }
    };

    /*退出登录*/
    loginOut(){
        confirm({
            title: '退出账号',
            content: '确定退出你的账号吗?',
            okText: '退出',
            cancelText: '取消',
            onOk() {
                config.delCache('token');
                window.location.href = '/login'
            }
        });
    }

    /**
     * 切换侧边栏的折叠和展开
     */
    toggleCollapsed = () => {
        this.props.onChangeState({
            collapsed: !this.props.collapsed
        })
    }
}

export default MyHeader;
