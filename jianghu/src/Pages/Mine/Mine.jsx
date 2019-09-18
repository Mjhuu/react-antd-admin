import React, {Component} from 'react';
import headImg from './../../Common/images/headImg.png'
import {Button, Icon, Tabs, Badge, Drawer, Input, Radio, message, Modal} from "antd";
import {connect} from "react-redux";
import large from './images/large.jpg'
import './css/index.styl'
import {reviseImg, reviseInfo} from "../../Api";

import {reviseUserInfo} from "../../Store/actionCreators";
import {check_name, check_pass, check_phone} from "../../Common/js/FabLabFun";

import man from './../../Common/images/man.png'
import women from './../../Common/images/women.png'
import zuji from './images/zuji.png'

import LoadAbleComponent from './../../Utils/LoadAbleComponent'
import {bindActionCreators} from "redux";
import config from "../../Config";

const Msg = LoadAbleComponent(import('./components/Msg'), true);

const { TabPane } = Tabs;
const { TextArea } = Input;

const store = connect(
    state => ({
        adminInfo: state.adminInfo
    }),
    dispatch => bindActionCreators({reviseUserInfo}, dispatch)
);

@store
class Mine extends Component {
    state = {
        navList: [
            {title: '消息/公告', key: 5, badge: true, count: 2, component: <Msg />}
        ],
        showEditModel: false,
        baseInfo: {//基本信息
            username: '',
            gender: 1,
            age: 0,
            phone: '',
            signContent: ''
        },
        pwdInfo: {//密码信息
            oldPassword: '',
            password: '',
            againPassword: ''
        }
    };
    render() {
        let {adminInfo} = this.props;
        let {navList, showEditModel, baseInfo, pwdInfo} = this.state;
        return (
            <div className="mine-box">
                {/*编辑资料*/}
                <Drawer
                    title="编辑个人资料"
                    placement="top"
                    closable={false}
                    onClose={this.onCloseEdit}
                    visible={showEditModel}
                    height={450}
                >
                    {
                        adminInfo.admin && <Tabs>
                            <TabPane tab='个人资料' key={1}
                            >
                                <ul className='edit-userInfo-box'>
                                    <li>
                                        <div className="left">
                                            用户名：
                                        </div>
                                        <div className="right">
                                            <Input onChange={e => this.inputChange(e, 'username')} value={baseInfo.username} type='text' placeholder="请输入用户名" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="left">
                                            性别：
                                        </div>
                                        <div className="right">
                                            <Radio.Group  value={baseInfo.gender} onChange={e => this.inputChange(e, 'gender')} buttonStyle="solid">
                                                <Radio.Button value={1}>男</Radio.Button>
                                                <Radio.Button value={0}>女</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="left">
                                            年龄：
                                        </div>
                                        <div className="right">
                                            <Input onChange={e => this.inputChange(e, 'age')} value={baseInfo.age} type='text' placeholder="请输入年龄"/>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="left">
                                            手机：
                                        </div>
                                        <div className="right">
                                            <Input onChange={e => this.inputChange(e, 'phone')} value={baseInfo.phone} type='text' placeholder="请输入手机号" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="left">
                                            简介：
                                        </div>
                                        <div className="right">
                                            <TextArea onChange={e => this.inputChange(e, 'signContent')} autosize={{ minRows: 3, maxRows: 4 }} rows={4} value={baseInfo.signContent} placeholder="何必这么懒呢？介绍自己吧" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="left" />
                                        <div className="right">
                                            <Button type="primary" style={{marginTop: '1rem'}} onClick={e => this.reviseInfo(e, 1)}>保存修改</Button>
                                        </div>
                                    </li>
                                </ul>
                            </TabPane>
                            <TabPane tab='修改密码' key={2}
                            >
                                <ul className="revise-pwd">
                                    <li>
                                        <div className="top">
                                            原密码：
                                        </div>
                                        <div className="bottom">
                                            <Input onChange={e => this.inputChange(e, 'oldPassword', 2)} value={pwdInfo.oldPassword} type="password" placeholder="请输入原密码" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="top">
                                            新密码：
                                        </div>
                                        <div className="bottom">
                                            <Input onChange={e => this.inputChange(e, 'password', 2)} value={pwdInfo.password} type="password" placeholder="请输入新密码" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="top">
                                            新密码二次确认：
                                        </div>
                                        <div className="bottom">
                                            <Input onChange={e => this.inputChange(e, 'againPassword', 2)} value={pwdInfo.againPassword} type="password" placeholder="请再次输入新密码" />
                                        </div>
                                    </li>
                                    <li style={{marginTop: '2rem'}}>
                                        <Button onClick={e => this.reviseInfo(e, 2)} type="primary" >修改密码</Button>
                                    </li>
                                </ul>
                            </TabPane>
                        </Tabs>
                    }
                </Drawer>
                <div className="top">
                    {/*封面背景*/}
                    <div className="cover" style={{
                        background: `url(${adminInfo.admin && adminInfo.admin.backgroundImg ? adminInfo.admin.backgroundImg : large}) center 0px / cover no-repeat fixed`
                    }}>
                        <Button type="primary" icon="camera">
                            更换封面
                            <input onChange={e =>this.selectImg(e, 'backgroundImg')} title="请选择封面图片" type="file"/>
                        </Button>
                    </div>
                    <div className="bottom">
                        <div className="headImg">
                            <div className="update-headImg">
                                <Icon type="camera" style={{fontSize: '2.3rem'}} />
                                <span style={{marginTop: '.3rem'}}>修改我的头像</span>
                                <input onChange={e =>this.selectImg(e, 'headImg')} type="file" title="请选择头像"/>
                            </div>
                            <img src={adminInfo.admin && adminInfo.admin.headImg ? adminInfo.admin.headImg : headImg} alt="头像"/>
                        </div>
                        <div className="userInfo">
                            <div className="username"><img src={adminInfo.admin && adminInfo.admin.gender === 1 ? man : women} alt={adminInfo.admin && adminInfo.admin.gender === 1 ? '男' : '女'}/>{adminInfo.admin && adminInfo.admin.username}</div>
                            <div className="username">
                                {adminInfo.departmentInfo && adminInfo.departmentInfo.departmentName}-
                                {adminInfo.jobInfo && adminInfo.jobInfo.jobName}-
                                {adminInfo.roleInfo && adminInfo.roleInfo.roleName}
                            </div>
                            <div className="signContent">
                                简介：{adminInfo.admin && adminInfo.admin.signContent ? adminInfo.admin.signContent : '这个人很懒，什么也没有留下……'}
                            </div>
                        </div>
                        <Button onClick={this.showEditModel}>编辑资料</Button>
                    </div>
                </div>
                {/*我的中心详细分类*/}
                <div className="bottom">
                    <div className="left">
                        <Tabs>
                            {
                                navList.map(nav =>
                                    <TabPane tab={
                                        nav.badge ?  <Badge count={nav.count}>
                                            {nav.title}
                                        </Badge> : `${nav.title}（${nav.count}）`
                                    } key={nav.key}
                                    >
                                        {nav.component}
                                    </TabPane>
                                )
                            }
                        </Tabs>
                    </div>
                    <div className="right">
                        <div className="history">
                            <img src={zuji} alt="足迹"/>
                            <p style={{marginTop: '1rem'}}>2019-09-12 加入 部门-职位</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.initBaseInfo();
    }

    initBaseInfo(){
        let {adminInfo} = this.props;
        adminInfo.admin &&
        this.setState({
            baseInfo: {
                username: adminInfo.admin.username,
                gender: adminInfo.admin.gender,
                age: adminInfo.admin.age,
                phone: adminInfo.admin.phone,
                signContent: adminInfo.admin.signContent
            },
        })
    }
    inputChange = (e, key, type = 1)=>{
        const { value } = e.target;
        if(type === 1){//基本资料
            let {baseInfo} = this.state;
            if(key === 'age'){
                const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
                if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                    baseInfo[key] = value;
                }
            }else {
                baseInfo[key] = value;
            }
            this.setState({
                baseInfo
            })
        }else {//密码
            let {pwdInfo} = this.state;
            pwdInfo[key] = value;
            this.setState({
                pwdInfo
            })
        }
    };
    reviseInfo = async (e, type) =>{
        let adminInfo = {};
        if(type === 1){//基本信息
            let {baseInfo} = this.state;
            if(!check_name(baseInfo.username)){
                return message.warning('用户名格式错误')
            }
            if(!check_phone(baseInfo.phone)){
                return message.warning('手机号格式错误')
            }
            baseInfo.age = parseInt(baseInfo.age);
            if(baseInfo.age <= 0 || baseInfo.age > 99){
                return message.warning('年龄超标')
            }
            adminInfo = baseInfo;
        }else {//密码修改
            let {pwdInfo} = this.state;
            pwdInfo = {...pwdInfo};
            if(!check_pass(pwdInfo.oldPassword) || !check_pass(pwdInfo.password) || !check_pass(pwdInfo.againPassword)){
                return message.warning('密码必须6-16位由数字字母符号至少两种组成')
            }
            if(pwdInfo.password !== pwdInfo.againPassword){
                return message.warning('两次密码不一致')
            }
            delete pwdInfo.againPassword;
            adminInfo = pwdInfo;
        }
        let data = await reviseInfo({adminInfo});
        if(data.code === 200){
            message.success(data.data);
            if(type === 2){
                Modal.warning({
                    title: '会话过期',
                    content: `你已修改密码，请重新登录。`,
                    okText: '重新登录',
                    onOk(){
                        config.delCache('token');
                        window.location.href = '/login'
                    }
                });
            }
            this.props.reviseUserInfo({
                ...adminInfo
            });
            this.setState({
                showEditModel: false,
                pwdInfo: {
                    oldPassword: '',
                    password: '',
                    againPassword: ''
                },
            });
        }else {
            message.warning(data.data)
        }
    };
    selectImg = async (e, type) => {
        let file = e.target.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
            return message.warning('您上传的文件：' + file.name + '格式不是png/jpg/jpeg格式！请重新选择！');
        }
        if (file.size > 2097152) {
            return message.warning('您上传的文件：' + file.name + '大小超过2M！请重新选择！');
        }
        let formData = new FormData();
        formData.append('img', file);
        formData.append('type', type);
        let data = await reviseImg(formData);
        if(data.code === 200){
            message.success(data.data);
            let imgSrc = data.result;
            this.props.reviseUserInfo({
                [type]: imgSrc
            })
        }else {
            message.warning(data.data)
        }
    };

    onCloseEdit = () => {
        this.setState({
            showEditModel: false,
        });
    };

    showEditModel = ()=>{
        this.setState({
            showEditModel: true,
        });
    }
}

export default Mine;
