import React, {Component} from 'react';
import {Icon, Menu, Badge} from "antd";
import {menu} from './menu'

import {withRouter} from 'react-router-dom'
import {connect} from "react-redux";
import './css/index.styl'

const store = connect(
    state => ({
        joinChatRoomList: state.joinChatRoomList
    }),
    null
);

@store @withRouter
class MySider extends Component {
    constructor(props){
        super(props);
        this.state = {
            openKeys : []
        }
    }
    render() {
        let {activeMenu} = this.props;
        let {openKeys} = this.state;
        return (
            <Menu onOpenChange={(openKeys) =>this.onOpenChange(openKeys)} theme="dark" mode="inline" selectedKeys={[activeMenu]} openKeys={openKeys}>
                {this.renderMenu(menu)}
            </Menu>
        );
    }
    componentDidMount() {
        let pathname = this.props.location.pathname;
        this._initData(menu, 'children', pathname);
        this.setState({
            openKeys: [pathname.substr(0, pathname.lastIndexOf('/'))]
        })
    }
    onOpenChange(openKeys){
        //此函数的作用只展开当前父级菜单（父级菜单下可能还有子菜单）
        if (openKeys.length === 0 || openKeys.length === 1) {
            this.setState({
                openKeys
            });
            return
        }
        //最新展开的菜单
        const latestOpenKey = openKeys[openKeys.length - 1];
        //只适用于3级菜单
        if (latestOpenKey.includes(openKeys[0])) {
            this.setState({
                openKeys
            })
        } else {
            this.setState({
                openKeys: [latestOpenKey]
            })
        }
    }
    _initData = (arr, childList, key) =>{
        if(key === '/layout/mine'){
            return this.addPane({
                name: '个人中心',
                key
            });
        }
        if(key === '/layout/power/role_manage/departmentManage' || key === '/layout/power/role_manage/titleManage'){
            return this.addPane({
                name: '级别管理',
                key: '/layout/power/role_manage'
            });
        }
        arr.forEach(value => {
            if(value.key === key){
                return this.addPane(value);
            }
            if(value.hasOwnProperty(childList)){
                this._initData(value[childList], childList, key);
            }
        });
    };
    /**
     * 生成侧边栏菜单
     */
    renderMenu = (menu) => {
        let {joinChatRoomList} = this.props;
        let noAllReadCount = 0;
        joinChatRoomList.forEach(v=>{
            noAllReadCount += v.noReadMsgCount
        });
        if (Array.isArray(menu)) {
            return menu.map(item => {
                if (!item.children || !item.children.length) {
                    return (
                        <Menu.Item key={item.key || item.name}>
                            <div onClick={() => this.addPane(item)}>
                                {item.icon && <Icon type={item.icon} />}<span>{item.name}</span> {
                                item.key === '/layout/chat' && <Badge dot count={noAllReadCount} />
                            }
                            </div>
                        </Menu.Item>
                    )
                } else {
                    return (
                        <Menu.SubMenu key={item.key} title={<span>{item.icon && <Icon type={item.icon} />}<span>{item.name}</span></span>}>
                            {this.renderMenu(item.children)}
                        </Menu.SubMenu>
                    )
                }
            })
        }
    };
    /**
     * 点击侧边栏菜单添加标签页
     */
    addPane = async (item) => {
        const panes = this.props.panes.slice();
        const activeMenu = item.key;
        //如果标签页不存在就添加一个
        if (!panes.find(i => i.key === activeMenu)) {
            panes.push({
                name: item.name,
                key: item.key
            })
        }
        await this.props.onChangeState({
            panes,
            activeMenu
        });
        this.props.history.replace(activeMenu);
    }
}

export default MySider;
