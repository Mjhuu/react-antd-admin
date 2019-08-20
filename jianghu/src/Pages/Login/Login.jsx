import React, {Component} from 'react';
import {connect} from "react-redux";

import {getAdminInfo} from "./../../Store/actionCreators";

import config from './../../Config'

import {Input, Icon, Button, message} from 'antd';

import {check_name, check_pass} from './../../Common/js/FabLabFun'

import './css/index.styl'

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    get loginComputed(){
        let {username, password} = this.state;
        return check_name(username) && check_pass(password)
    }
    render() {
        let {username, password} = this.state;
        return (
            <div className="login-box">
                <div className="login">
                    <div className="login-bg"/>
                    <div className="login-content">
                        <h2>登录管理平台</h2>
                        <Input
                            className="input"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="管理员账号"
                            value={username}
                            onChange={(e)=> this.inputChange(e, 'username')}
                            onKeyUp={e => this.enterLogin(e)}
                        />
                        <Input
                            className="input"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="管理员账号密码"
                            value={password}
                            onChange={(e)=> this.inputChange(e, 'password')}
                            onKeyUp={e => this.enterLogin(e)}
                        />
                        {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                        <a href="#">忘记密码？联系超级管理员。</a>
                        <Button disabled={!this.loginComputed} onClick={()=> this.loginAdmin()} style={{marginTop: '1rem'}} block type="primary">登录</Button>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {

    }
    inputChange(e, type){
        let {username, password} = this.state;
        let value = e.target.value;
        switch (type) {
            case 'username':
                username = value;
                break;
            case 'password':
                password = value;
                break;
            default:
                break
        }
        this.setState({
            username, password
        })
    }
    enterLogin(e){
        e.keyCode === 13 && this.loginComputed && this.loginAdmin();
    }
    async loginAdmin(){
        let {username, password} = this.state;
        console.log(username, password);
        message.warning('用户名或密码错误');
        await this.props.getAdminInfo();
        config.setCache('token', 'aasd342rg2342edv');
        /*切换到主界面*/
        this.props.history.push('/');
        console.log(this.props.adminInfo);
    }
}
const mapStateToProps = (state)=>{
    return {
        adminInfo: state.adminInfo
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        getAdminInfo() {
            const action = getAdminInfo({age: 21, gender: 1});
            dispatch(action);
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
