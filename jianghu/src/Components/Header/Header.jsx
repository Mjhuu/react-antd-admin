import React, {Component} from 'react';
import {Icon, Layout, Avatar, Badge, Button} from "antd";
import './css/index.styl'
const { Header} = Layout;

class MyHeader extends Component {
    render() {
        return (
            <Header style={{ background: '#fff', padding: 0, position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}
                />
                <ul className="head-nav">
                    <li>
                        <Badge count={1}>
                            <Avatar style={{border: '.1rem solid #f1f1f1'}} size={40} icon="user" />
                        </Badge>
                        <span style={{paddingLeft: '.6rem'}}>
                            超级管理员
                        </span>
                    </li>
                    <li>
                        <Button>退出</Button>
                    </li>
                </ul>
            </Header>
        );
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
