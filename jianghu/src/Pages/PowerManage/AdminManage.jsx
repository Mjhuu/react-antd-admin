import React, {Component} from 'react';
import './css/adminManage.styl'
import {Button, message, Table, Icon, Popconfirm, Divider, Modal, Descriptions, Switch, Input, Select} from "antd";
import {connect} from "react-redux";
import {getAdminList, freezeAdmin, delAdmin} from "../../Api";
import moment from "moment";

const { Option, OptGroup } = Select;
const store = connect(
    state => ({adminInfo: state.adminInfo}),
    null
);

@store
class AdminManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dateFormat: 'YYYY/MM/DD HH:mm:ss',
            showAdminModel: false, // 管理员详细信息窗口
            showAddAdminModel: false,// 添加管理员窗口
            showAdminInfo: {},// 查看管理员的基本信息
            adminList: [], // 管理员列表
            pagination: {
                total: 0,
                current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
                pageSize: 10,
                showQuickJumper: true
            },
        }
    }

    render() {
        let {pagination, adminList, loading, showAdminModel, showAdminInfo, showAddAdminModel} = this.state;
        const columns = [
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                render: (text) => text && text === 1 ? '正常' : <span className="red">异常/冻结</span>,
            },
            {
                title: '用户名',
                dataIndex: 'username',
                align: 'center'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                align: 'center'
            },
            {
                title: '注册时间',
                dataIndex: 'createdAt',
                align: 'center'
            },
            {
                title: '上次登录地址',
                dataIndex: 'loginIpAndAddress',
                align: 'center',
                render: (text, record) => record.ipAddress ? text : <span style={{color: '#aeaeae'}}>{text}</span>
            },
            {
                title: '上次登录时间',
                dataIndex: 'loginTime',
                align: 'center',
                render: (text, record) => record.loginTime ? text : <span style={{color: '#aeaeae'}}>尚未登录</span>
            },
            {
                title: '角色',
                dataIndex: 'roleName',
                align: 'center',
                render: (text, record) => record.power === 0 ?
                    <span style={{color: '#ffaa06'}}>{record.roleName}</span> : record.roleName
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{textAlign: 'center'}}>
                        <span className='see' onClick={() => this.showInfoModal(record)}><Icon type="eye"/> 查看</span>
                        {
                            this.props.adminInfo.roleInfo ? this.props.adminInfo.roleInfo.power === 0 && this.props.adminInfo.admin.uuid !== record.uuid ? (
                                <Popconfirm title='您确定删除当前用户吗？' onConfirm={() => this.singleDelete(record)}>
                                    <span className='red'><Divider type='vertical'/><Icon type='delete'/> 删除</span>
                                </Popconfirm>
                            ) : '' : ''
                        }
                    </div>
                )
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: this.props.adminInfo.roleInfo && this.props.adminInfo.roleInfo.power !== 0 || this.props.adminInfo.admin && record.uuid === this.props.adminInfo.admin.uuid
            }),
        };
        return (
            <div className="admin-manage-box">
                <nav>
                    <Button icon='plus' onClick={this.showAddAdminModel}>添加管理员</Button>
                </nav>
                <section className="admin-list">
                    <Table pagination={pagination}
                           rowKey='uuid'
                           loading={loading}
                           rowSelection={rowSelection}
                           columns={columns}
                           dataSource={adminList}
                           onChange={this.onTableChange}
                    />
                </section>
                {/*添加管理员窗口*/}
                <Modal
                    title={`添加管理员`}
                    visible={showAddAdminModel}
                    onOk={this.handleAddAdminOk}
                    okText={"添加"}
                    onCancel={e => this.handleCancel(e, 'showAddAdminModel')}
                >
                    <ul>
                        <li>
                            username
                            <Input placeholder="请输入管理员用户名" />
                        </li>
                        <li>
                            phone
                            <Input placeholder="请输入管理员手机号" />
                        </li>
                        <li>
                            password
                            <Input placeholder="请输入密码" />
                        </li>
                        <li>
                            roleId
                            <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.selectRole}>
                                <OptGroup label="Manager">
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                </OptGroup>
                                <OptGroup label="Engineer">
                                    <Option value="Yiminghe">yiminghe</Option>
                                </OptGroup>
                            </Select>
                        </li>
                    </ul>
                </Modal>
                {/*管理员详细信息窗口*/}
                <Modal
                    width={800}
                    title={`管理员：${showAdminInfo.username}`}
                    visible={showAdminModel}
                    onOk={this.handleInfoOk}
                    onCancel={e => this.handleCancel(e, 'showAdminModel')}
                >
                    <Descriptions
                        bordered
                        column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                    >
                        <Descriptions.Item label="管理员">{showAdminInfo.username}</Descriptions.Item>
                        <Descriptions.Item label="性别">{showAdminInfo.gender === 1 ? '男' : '女'}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{showAdminInfo.age}</Descriptions.Item>
                        <Descriptions.Item label="电话">{showAdminInfo.phone}</Descriptions.Item>
                        <Descriptions.Item label="角色">{showAdminInfo.roleName}</Descriptions.Item>
                        <Descriptions.Item
                            label="介绍">{showAdminInfo.signContent ? showAdminInfo.signContent : '暂无介绍'}</Descriptions.Item>
                        <Descriptions.Item label="账号状态">
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: 'center',
                                flexDirection: 'column'
                            }}>
                                {showAdminInfo.status === 1 ? '正常' : <span className="red">异常/冻结</span>}
                                <Switch onClick={this.freezeAdmin} style={{marginTop: '.2rem'}} checkedChildren="冻结"
                                        unCheckedChildren="正常" checked={showAdminInfo.status !== 1}/>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">{showAdminInfo.createdAt}</Descriptions.Item>
                        <Descriptions.Item label="最近登录时间">{showAdminInfo.loginTime ? showAdminInfo.loginTime :
                            <span style={{color: '#aeaeae'}}>尚未登录</span>}</Descriptions.Item>
                        <Descriptions.Item
                            label="最近登录地点">{showAdminInfo.loginIpAndAddress ? showAdminInfo.loginIpAndAddress :
                            <span style={{color: '#aeaeae'}}>尚未登录</span>}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        this.reqAdminList(1, this.state.pagination.pageSize);
    }
    selectRole = (v)=>{
        console.log(v);
    };
    /*添加管理员窗口*/
    showAddAdminModel = async () => {
        if (this.props.adminInfo.roleInfo.power !== 0) {
            return message.warning('你无权限操作！')
        }
        await this.setState({
            showAddAdminModel: true
        })
    };
    /* 冻结/解冻 管理员*/
    freezeAdmin = async () => {
        if (this.props.adminInfo.roleInfo.power !== 0) {
            return message.warning('你无权限操作！')
        }
        let {showAdminInfo} = this.state;
        if (this.props.adminInfo.admin.uuid === showAdminInfo.uuid) {
            return message.warning('不能操作自己哟！')
        }
        let status;
        if (showAdminInfo.status === 1) { // 去冻结
            showAdminInfo.status = 2;
            status = 2;
        } else { // 恢复账号正常
            showAdminInfo.status = 1;
            status = 1;
        }
        let data = await freezeAdmin({status});
        if (data.code === 200) {
            console.log(data);
            this.setState({
                showAdminInfo
            });
        }
    };
    /*点击模板ok*/
    handleInfoOk = e => {
        this.setState({
            showAdminModel: false,
        });
    };
    handleAddAdminOk = e => {
        this.setState({
            showAddAdminModel: false,
        });
    };
    /*点击模板取消*/
    handleCancel = (e, key) => {
        this.setState({
            [key]: false,
        });
    };

    async reqAdminList(page, limit) {
        let {dateFormat} = this.state;
        this.setState({
            loading: true
        });
        let data = await getAdminList({
            page,
            limit
        });

        this.setState({
            loading: false
        });
        if (data.code === 200) {
            let admins = data.result.adminList;
            let adminList = [];
            admins.forEach(value => {
                value.adminInfo.ipAddress = JSON.parse(value.adminInfo.ipAddress);
                value.adminInfo.createdAt = moment(value.adminInfo.createdAt).format(dateFormat);
                value.adminInfo.loginTime = value.adminInfo.loginTime ? moment(value.adminInfo.loginTime).format(dateFormat) : value.adminInfo.loginTime;
                value.adminInfo['power'] = value.roleInfo.power;
                value.adminInfo.roleName = value.roleInfo.roleName;
                value.adminInfo.loginIpAndAddress = value.adminInfo.ipAddress ? `${value.adminInfo.ipAddress.ip}（${value.adminInfo.ipAddress.ad_info.city ? value.adminInfo.ipAddress.ad_info.city : value.adminInfo.ipAddress.ad_info.province}）` : '尚未登录';
                adminList.push({...value.adminInfo});
            });
            this.setState({
                adminList,
                pagination: {
                    total: data.result.count,
                    current: page,
                    pageSize: limit,
                    showQuickJumper: true
                },
            });
        } else {
            message.warning(data.data)
        }
    }

    // 显示用户详细信息
    showInfoModal = async (record) => {
        await this.setState({
            showAdminModel: true,
            showAdminInfo: record
        });
    };
    // 删除管理员
    singleDelete = async (record) => {
        console.log(record);
        let data = await delAdmin();
        console.log(data);
    };
    onTableChange = async (pagination) => {
        console.log(pagination);
        this.reqAdminList(pagination.current, pagination.pageSize)
    }
}

export default AdminManage;
