import React, {Component} from 'react';
import './css/adminManage.styl'
import {Button, message, Table, Icon, Popconfirm, Divider, Modal, Descriptions, Switch, Input, Select, Cascader } from "antd";
import {connect} from "react-redux";
import {getAdminList, freezeAdmin, updateJob, getAllRoleList, addAdmin, getAllDepartmentAndJob} from "../../Api";
import {check_name, check_pass, check_phone} from "../../Common/js/FabLabFun";
import moment from "moment";

const { Option, OptGroup } = Select;
const { confirm } = Modal;
const store = connect(
    state => ({adminInfo: state.adminInfo, color: state.color}),
    null
);

@store
class AdminManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dateFormat: 'YYYY/MM/DD HH:mm:ss',
            showAdminModel: false, // 技术人员详细信息窗口
            showAddAdminModel: false,// 添加技术人员窗口
            showAdminInfo: {},// 查看技术人员的基本信息
            adminList: [], // 技术人员列表
            roleList: [], // 职称列表
            departmentAndJobList: [], //部门职位列表
            selectJobList: [], //职位列表
            addAdminLoading: false,
            addAdminInfo: {
                username: '',
                phone: '',
                password: 'admin666',
                roleId: 1,
                jobId: ''
            }, // 新增技术人员基本信息
            pagination: {
                total: 0,
                current: 1, //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
                pageSize: 10,
                showQuickJumper: true
            },
            searchInfo: {// 搜索信息
                departmentId: undefined, //部门id
                jobId: undefined, //职位id
                roleId: undefined, //职称id
                gender: undefined, //性别
                status: undefined, //账号状态 1-正常 2-冻结或违规 3-删除
            }
        }
    }

    render() {
        let {pagination, adminList, loading, showAdminModel, showAdminInfo, showAddAdminModel, roleList, addAdminInfo, addAdminLoading, departmentAndJobList, searchInfo, selectJobList} = this.state;
        let {color} = this.props;
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
                title: '部门',
                dataIndex: 'departmentName',
                align: 'center',
                render: (text, record) => <span className={'department'} style={{background: color[`id${record.departmentId}`]}}>{text}</span>
            },
            {
                title: '职位',
                dataIndex: 'jobName',
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
                title: '职称',
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
                            this.props.adminInfo.roleInfo ? this.props.adminInfo.roleInfo.power === 0 && this.props.adminInfo.admin.uuid !== record.uuid && record.power !== 0 ? (
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
                // eslint-disable-next-line no-mixed-operators
                disabled: this.props.adminInfo.roleInfo && this.props.adminInfo.roleInfo.power !== 0 || this.props.adminInfo.admin && record.uuid === this.props.adminInfo.admin.uuid
            }),
        };
        return (
            <div className="admin-manage-box">
                {/*筛选条件*/}
                <div className="top">
                    <ul>
                        <li>
                            <p>部门</p>
                            <Select
                                placeholder="请选择"
                                value={searchInfo.departmentId} style={{ width: 150 }} onChange={(v, o) =>this.changeJobList(v, o, 'departmentId')}>
                                {/*职称*/}
                                <OptGroup label="部门">
                                    {
                                        departmentAndJobList.map(v =>(
                                            <Option key={v.value} value={v.value}>{v.label}</Option>

                                        ))
                                    }
                                </OptGroup>
                            </Select>
                        </li>
                        <li>
                            <p>职位</p>
                            <Select
                                placeholder="请选择"
                                value={searchInfo.jobId} style={{ width: 150 }}
                                onChange={(v, o) =>this.changeJobList(v, o, 'jobId')}>
                                {/*职称*/}
                                <OptGroup label="职位">
                                    {
                                        selectJobList.map(v =>(
                                            <Option key={v.value} value={v.value}>{v.label}</Option>

                                        ))
                                    }
                                </OptGroup>
                            </Select>
                        </li>
                        <li>
                            <p>职称</p>
                            <Select
                                placeholder="请选择"
                                value={searchInfo.roleId} style={{ width: 130 }} onChange={(v, o) =>this.changeJobList(v, o, 'roleId')}>
                                {/*职称*/}
                                <OptGroup label="职称">
                                    {
                                        roleList.map(v =>(
                                            <Option key={v.id} value={v.id}>{v.roleName}</Option>

                                        ))
                                    }
                                </OptGroup>
                            </Select>
                        </li>
                        <li>
                            <p>性别</p>
                            <Select
                                placeholder="请选择"
                                value={searchInfo.gender} style={{ width: 100 }} onChange={(v, o) =>this.changeJobList(v, o, 'gender')}>
                                {/*职称*/}
                                <Option value={1}>男</Option>
                                <Option value={0}>女</Option>
                            </Select>
                        </li>
                        <li>
                            <p>账号状态</p>
                            <Select
                                placeholder="请选择"
                                value={searchInfo.status} style={{ width: 100 }} onChange={(v, o) =>this.changeJobList(v, o, 'status')}>
                                {/*职称*/}
                                <Option value={1}>正常</Option>
                                <Option value={2}>异常</Option>
                            </Select>
                        </li>
                        <li>
                            <Button onClick={e => this.reqAdminList(1)} type="primary">
                                筛选
                            </Button>
                        </li>
                        <li>
                            <Button onClick={e => this.resetSelectInfo()}>
                                重置
                            </Button>
                        </li>
                    </ul>
                </div>
                <nav>
                    <Button icon='plus' onClick={this.showAddAdminModel}>添加技术人员</Button>
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
                {/*添加技术人员窗口*/}
                <Modal
                    title={`添加技术人员`}
                    visible={showAddAdminModel}
                    onCancel={e => this.handleCancel(e, 'showAddAdminModel')}
                    footer={[
                        <Button key="back" onClick={e => this.handleCancel(e, 'showAddAdminModel')}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={addAdminLoading} onClick={this.handleAddAdminOk}>
                            添加
                        </Button>,
                    ]}
                >
                    <ul className="add-admin-box">
                        <li>
                            <div className="left">
                                技术人员名称：
                            </div>
                            <div className="right">
                                <Input onChange={(e)=> this.inputChange(e, 'username')} value={addAdminInfo.username} placeholder="请输入技术人员用户名" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                手机号：
                            </div>
                            <div className="right">
                                <Input onChange={(e)=> this.inputChange(e, 'phone')} value={addAdminInfo.phone} placeholder="请输入技术人员手机号" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                密码：
                            </div>
                            <div className="right">
                                <Input.Password onChange={(e)=> this.inputChange(e, 'password')} value={addAdminInfo.password} placeholder="请输入密码" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                部门/职位：
                            </div>
                            <div className="right">
                                <Cascader
                                    options={departmentAndJobList}
                                    onChange={(v, o) =>this.jobChange(v, o, 'insert')}
                                    expandTrigger="hover"
                                    placeholder={"选择部门/职位"}
                                />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                职称：
                            </div>
                            <div className="right">
                                <Select value={addAdminInfo.roleId} style={{ width: 200 }} onChange={v =>this.selectRole(v, 'insert')}>
                                    {/*职称*/}
                                    <OptGroup label="职称">
                                        {
                                            roleList.map(v =>(
                                                <Option key={v.id} value={v.id} disabled={v.power === 0}>{v.roleName}</Option>

                                            ))
                                        }
                                    </OptGroup>
                                </Select>
                            </div>
                        </li>
                    </ul>
                </Modal>
                {/*技术人员详细信息窗口*/}
                <Modal
                    width={830}
                    title={`技术人员：${showAdminInfo.username}`}
                    visible={showAdminModel}
                    onOk={this.handleInfoOk}
                    onCancel={e => this.handleCancel(e, 'showAdminModel')}
                >
                    <div style={{lineHeight: '6rem'}}>
                        <span style={{fontWeight: '600'}}>部门-职位：</span>
                        <Cascader
                            value={[showAdminInfo.departmentId, showAdminInfo.jobId]}
                            options={departmentAndJobList}
                            onChange={this.jobChange}
                            placeholder={"选择部门/职位"}
                        />
                        <span style={{fontWeight: '600', marginLeft: '2rem'}}>职称：</span>
                        <Select value={showAdminInfo.roleId} style={{ width: 200 }} onChange={v =>this.selectRole(v, 'update')}>
                            {/*职称*/}
                            <OptGroup label="职称">
                                {
                                    roleList.map(v =>(
                                        <Option key={v.id} value={v.id} disabled={v.power === 0}>{v.roleName}</Option>

                                    ))
                                }
                            </OptGroup>
                        </Select>
                    </div>
                    <Descriptions
                        bordered
                        column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                    >
                        <Descriptions.Item label="技术人员">{showAdminInfo.username}</Descriptions.Item>
                        <Descriptions.Item label="部门">{showAdminInfo.departmentName}</Descriptions.Item>
                        <Descriptions.Item label="职位">{showAdminInfo.jobName}</Descriptions.Item>
                        <Descriptions.Item label="性别">{showAdminInfo.gender === 1 ? '男' : '女'}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{showAdminInfo.age}</Descriptions.Item>
                        <Descriptions.Item label="电话">{showAdminInfo.phone}</Descriptions.Item>
                        <Descriptions.Item label="职称">{showAdminInfo.roleName}</Descriptions.Item>
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
        this.getAllDepartmentAndJob();
        this.getAllRoleList();
        this.reqAdminList(1);
    }

    resetSelectInfo = e =>{
        this.setState({
            searchInfo: {// 搜索信息
                departmentId: undefined, //部门id
                jobId: undefined, //职位id
                roleId: undefined, //职称id
                gender: undefined, //性别
                status: undefined, //账号状态 1-正常 2-冻结或违规 3-删除
            }
        })
    };
    // 筛选条件改变
    changeJobList = (v, o, key) =>{
        let {departmentAndJobList, searchInfo} = this.state;
        switch (key) {
            case 'departmentId':
                let selectJobList = departmentAndJobList.find(d => d.value === v).children;
                searchInfo['jobId'] = undefined;
                this.setState({
                    selectJobList,
                    searchInfo
                });
                break;
            default:
                break
        }
        searchInfo[key] = v;
        this.setState({
            searchInfo
        });
    };

    jobChange = (v, o, type = 'update') =>{
        switch (type) {
            case "update":
                if (this.props.adminInfo.roleInfo.power !== 0) {
                    return message.warning('你无权限操作！')
                }
                let {showAdminInfo} = this.state;
                confirm({
                    title: '更换岗位?',
                    content: `你确定将 ${showAdminInfo.username} 的岗位调到 "${o[0].label}-${o[1].label}" 吗？`,
                    style: {
                      top: '200px'
                    },
                    onOk: () =>{
                        return new Promise(async (resolve, reject) => {
                            showAdminInfo.departmentId = v[0];
                            showAdminInfo.departmentName = o[0].label;
                            showAdminInfo.jobId = v[1];
                            showAdminInfo.jobName = o[1].label;
                            let data = await updateJob({
                                uuid: showAdminInfo.uuid,
                                jobId: v[1]
                            });
                            if(data.code === 200){
                                message.success(data.data);
                                await this.setState({
                                    showAdminInfo
                                });
                                resolve()
                            }else {
                                reject(data.data)
                            }
                        }).catch(err => message.warning(err));
                    }
                });
                break;
            case "insert":
                let {username, password, phone, roleId} = this.state.addAdminInfo;
                this.setState({
                    addAdminInfo: {username, password, phone, roleId, jobId: v[1]}
                });
                break;
            default:
                break
        }
    };
    inputChange = (e, type)=>{
        let {username, password, phone, roleId, jobId} = this.state.addAdminInfo;
        let value = e.target.value;
        switch (type) {
            case 'username':
                username = value;
                break;
            case 'phone':
                phone = value;
                break;
            case 'password':
                password = value;
                break;
            default:
                break
        }
        this.setState({
            addAdminInfo: {
                username, password, phone, roleId, jobId
            }
        })
    };
    // 选择职称
    selectRole = (v, type = 'update')=>{
        switch (type) {
            case "update":
                if (this.props.adminInfo.roleInfo.power !== 0) {
                    return message.warning('你无权限操作！')
                }
                let {showAdminInfo, roleList} = this.state;
                let role = roleList.find(i => i.id === v);
                confirm({
                    title: '更换职称?',
                    content: `你确定将 ${showAdminInfo.username} 的职称调整为 "${role.roleName}" 吗？`,
                    style: {
                        top: '200px'
                    },
                    onOk: () =>{
                        return new Promise(async (resolve, reject) => {
                            showAdminInfo.roleId = v;
                            showAdminInfo.roleName = role.roleName;
                            let data = await updateJob({
                                uuid: showAdminInfo.uuid,
                                roleId: v,
                                type: 2
                            });
                            if(data.code === 200){
                                message.success(data.data);
                                await this.setState({
                                    showAdminInfo
                                });
                                resolve()
                            }else {
                                reject(data.data)
                            }
                        }).catch(err => message.warning(err));
                    }
                });
                break;
            case "insert":
                let {username, password, phone, jobId} = this.state.addAdminInfo;
                this.setState({
                    addAdminInfo: {
                        username, password, phone, roleId: v, jobId
                    }
                });
                break;
            default:
                break
        }
    };
    /*获取部门职位*/
    getAllDepartmentAndJob = async ()=>{
        let data = await getAllDepartmentAndJob();
        if(data.code === 200){
            let departmentAndJobList = data.departmentAndJob || [];
            departmentAndJobList.forEach(v =>{
                v.value = v.id;
                delete v.id;
                v.label = v.departmentName;
                delete v.departmentName;
                v.children = v.jobs || [];
                delete v.jobs;
                v.children.forEach(job =>{
                    job.value = job.id;
                    delete job.id;
                    job.label = job.jobName;
                    delete job.jobName;
                })
            });
            this.setState({
                departmentAndJobList
            });
        }
    };
    /*获取职称列表*/
    getAllRoleList = async ()=>{
        let data = await getAllRoleList();
        if(data.code === 200){
            this.setState({
                roleList: data.result
            });
        }
    };
    /*添加技术人员窗口*/
    showAddAdminModel = async () => {
        if (this.props.adminInfo.roleInfo.power !== 0) {
            return message.warning('你无权限操作！')
        }
        await this.setState({
            showAddAdminModel: true
        })
    };
    /* 冻结/解冻 技术人员*/
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
        let data = await freezeAdmin({status, uuid: showAdminInfo.uuid});
        if (data.code === 200) {
            message.success(data.data);
            this.setState({
                showAdminInfo
            });
        }else {
            message.warning(data.data)
        }
    };
    /*点击模板ok*/
    handleInfoOk = e => {
        this.setState({
            showAdminModel: false,
        });
    };
    handleAddAdminOk = async e => {
        let {addAdminInfo} = this.state;
        // 判断字段是否填写正确
        if(!check_name(addAdminInfo.username)){
            return message.warning('用户名格式错误')
        }
        if(!check_phone(addAdminInfo.phone)){
            return message.warning('手机号格式错误')
        }
        if(!check_pass(addAdminInfo.password)){
            return message.warning('密码必须6-16位由数字字母符号至少两种组成')
        }
        if(addAdminInfo.jobId === ''){
            return message.warning('请选择部门职位')
        }
        // 显示加载中
        await this.setState({
            addAdminLoading: true
        });
        // 发起请求api
        let data = await addAdmin(addAdminInfo);
        await this.setState({
            addAdminLoading: false
        });
        if(data.code === 200){
            message.success('新增技术人员成功');
            this.reqAdminList(1);
            // 清空字段并关闭窗口
            await this.setState({
                showAddAdminModel: false,
                addAdminInfo: {
                    username: '',
                    phone: '',
                    password: 'admin666',
                    roleId: 1,
                    jobId: ''
                }
            });
        }else {
            message.warning(data.data);
        }

    };
    /*点击模板取消*/
    handleCancel = (e, key) => {
        this.setState({
            [key]: false,
        });
    };

    async reqAdminList(page) {
        let {searchInfo} = this.state;
        let limit = this.state.pagination.pageSize;
        let {dateFormat} = this.state;
        this.setState({
            loading: true
        });
        let data = await getAdminList({
            page,
            limit,
            ...searchInfo
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
                value.adminInfo.jobName = value.jobInfo.jobName;
                value.adminInfo.jobId = value.jobInfo.id;
                value.adminInfo.departmentName = value.departmentInfo.departmentName;
                value.adminInfo.departmentId = value.departmentInfo.id;
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
        console.log(record);

        await this.setState({
            showAdminModel: true,
            showAdminInfo: record
        });
    };
    // 删除技术人员
    singleDelete = async (record) => {
        let data = await freezeAdmin({
            uuid: record.uuid,
            status: 3
        });
        if (data.code === 200) {
            let {adminList} = this.state;
            const index = adminList.findIndex(i => i.uuid === record.uuid);
            adminList.splice(index, 1);
            await this.setState({
                adminList
            });
            message.success(data.data);
        }else {
            message.warning(data.data)
        }
    };
    onTableChange = async (pagination) => {
        console.log(pagination);
        this.reqAdminList(pagination.current)
    }
}

export default AdminManage;
