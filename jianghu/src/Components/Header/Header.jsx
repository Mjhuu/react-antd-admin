import React, {Component} from 'react';
import {Icon, Layout, Avatar, Badge, Dropdown, Menu, Modal} from "antd";
import {withRouter} from 'react-router-dom'
import './css/index.styl'

const {Header} = Layout;
const { confirm } = Modal;

@withRouter
class MyHeader extends Component {
    render() {
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
                                <Badge count={1}>
                                    <Avatar style={{border: '.1rem solid #f1f1f1'}} size={40} icon="user"/>
                                </Badge>
                                <span style={{paddingLeft: '.6rem'}}>
                                超级管理员
                            </span>
                            </div>
                        </Dropdown>
                    </li>
                </ul>
            </Header>
        );
    }

    initMenu(){
        return (
            <Menu onClick={(e) =>this.handleMenuClick(e)}>
                <Menu.Item key="/layout/mine">
                    <Icon type="user"/>
                    个人中心
                </Menu.Item>
                <Menu.Item key="loginOut">
                    <Icon type="export" />
                    退出登录
                </Menu.Item>
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
            default:
                break
        }
    }

    /*退出登录*/
    loginOut(){
        confirm({
            title: '退出账号',
            content: '确定退出你的账号吗?',
            okText: '退出',
            cancelText: '取消',
            onOk() {
                alert(2)
            },
            onCancel() {},
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
