import React, {Component} from 'react';
import { Layout, Tabs } from 'antd';
import {withRouter} from 'react-router-dom'
import './css/index.styl'
const TabPane = Tabs.TabPane;
const { Content } = Layout;

@withRouter
class MyContent extends Component {
    render() {
        const { panes, activeMenu } = this.props;
        return (
            <Content
                className="content"
            >
                {
                    panes.length ? (
                        <Tabs
                            style={{ height: '40px' }}
                            tabBarStyle={{ background: '#f0f2f5', marginBottom: 0 }}
                            onEdit={this.onEdit}
                            onChange={this.onChange}
                            activeKey={activeMenu}
                            type="editable-card"
                            hideAdd>
                            {
                                panes.map(item => {
                                    return (
                                            <TabPane style={{height: activeMenu !== item.key ? '0' : '100%', }} key={item.key} tab={item.name} closable={item.closable}>
                                                <div className='tabpane-box'>

                                                </div>
                                            </TabPane>
                                        )
                                    }
                                )
                            }
                        </Tabs>
                    ) : (
                        <div className='bg-box'>
                            {this.props.children}
                        </div>
                    )
                }
                <div className="content-box">
                    <div className="content-inner">
                        {this.props.children}
                    </div>
                </div>
            </Content>
        );
    }
    /**
     *  标签页的改变触发的函数
     */
    onChange = async (activeKey) => {
        await this.props.onChangeState({
            activeMenu: activeKey
        });
        this.props.history.replace(activeKey);
    };
    onEdit = (targetKey, action) => {
        if (action === 'remove') {
            this.remove(targetKey)
        }
    };
    /**
     * 关闭标签页
     */
    remove = async (targetKey) => {
        let activeMenu = this.props.activeMenu;
        let panes = this.props.panes.slice();
        let preIndex = panes.findIndex(item => item.key === targetKey) - 1;
        preIndex = Math.max(preIndex, 0);

        panes = panes.filter(item => item.key !== targetKey);

        if (targetKey === activeMenu) {
            activeMenu = panes[preIndex] ? panes[preIndex].key : ''
        }
        await this.props.onChangeState({
            activeMenu,
            panes
        });
        this.props.history.replace(activeMenu);
    }
}

export default MyContent;
