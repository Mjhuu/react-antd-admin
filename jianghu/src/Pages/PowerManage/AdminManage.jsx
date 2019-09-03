import React, {Component} from 'react';
import './css/adminManage.styl'
import {Button, message, Table, Icon, Popconfirm, Divider} from "antd";
import {connect} from "react-redux";
import {getAdminList, freezeAdmin, delAdmin} from "../../Api";
import moment from "moment";

const store = connect(
    state => ({ adminInfo: state.adminInfo }),
    null
);

@store
class AdminManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            dateFormat: 'YYYY/MM/DD HH:mm:ss',
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
        let {pagination, adminList, loading} = this.state;
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
                render: (text, record)=> record.power === 0 ? <span style={{color: '#ffaa06'}}>{record.roleName}</span> : record.roleName
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <span className='see' onClick={() => this.showInfoModal(record)}><Icon type="eye" /> 查看</span>
                        {
                            this.props.adminInfo.roleInfo ? this.props.adminInfo.roleInfo.power === 0 && this.props.adminInfo.admin.uuid !== record.uuid ? (
                                <Popconfirm title='您确定删除当前用户吗？' onConfirm={() => this.singleDelete(record)}>
                                    <span className='red'><Divider type='vertical' /><Icon type='delete' /> 删除</span>
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
                    <Button icon='plus'>添加管理员</Button>
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
            </div>
        );
    }
    componentDidMount() {
        this.reqAdminList(1, this.state.pagination.pageSize);
    }
    async reqAdminList(page, limit){
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
        if(data.code === 200){
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
            console.log(adminList);
            this.setState({
                adminList,
                pagination: {
                    total: data.result.count,
                    current: page,
                    pageSize: limit,
                    showQuickJumper: true
                },
            });
        }else {
            message.warning(data.data)
        }
    }
    showInfoModal = async (record)=>{
        console.log(record);

        let data = await freezeAdmin();
        console.log(data);
    };
    singleDelete = async (record)=>{
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
