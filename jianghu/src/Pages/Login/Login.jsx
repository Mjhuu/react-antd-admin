import React, {Component} from 'react';
import {connect} from "react-redux";

import {setAdminInfo, initSocket} from "./../../Store/actionCreators";

import {Input, Icon, Button, message} from 'antd';
import {loginAdmin} from './../../Api/index'

import {check_name, check_pass} from './../../Common/js/FabLabFun'

import './css/index.styl'
import config from "../../Config";
import {bindActionCreators} from "redux";

const store = connect(
    state => ({ adminInfo: state.adminInfo }),
    dispatch => bindActionCreators({ setAdminInfo, initSocket}, dispatch)
);

@store
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false
        }
    }
    get loginComputed(){
        let {username, password} = this.state;
        return check_name(username) && check_pass(password)
    }
    render() {
        let {username, password, loading} = this.state;
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
                        <Button loading={loading} disabled={!this.loginComputed} onClick={()=> this.loginAdmin()} style={{marginTop: '1rem'}} block type="primary">登录</Button>
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
        await this.setState({
            loading: true
        });
        let data = await loginAdmin({
            username,
            password
        });
        await this.setState({
            loading: false
        });
        if(data.code === 200){
            config.setCache('token', data.token);
            await this.props.setAdminInfo(data.result);
            /*初始化socket*/
            this.props.initSocket({
                uuid: this.props.adminInfo.admin.uuid,
                username: this.props.adminInfo.admin.username,
                headImg: this.props.adminInfo.admin.headImg
            });
            /*切换到主界面*/
            this.props.history.push('/');
        }else {
            message.warning(data.data)
        }
    }
}

export default Login;
