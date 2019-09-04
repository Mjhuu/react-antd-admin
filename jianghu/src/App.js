import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {getAdminInfo, updateToken} from "./Api";
import {setAdminInfo, initSocket} from "./Store/actionCreators";

import LoadAbleComponent from './Utils/LoadAbleComponent'

import 'antd/dist/antd.min.css'

import config from './Config'

import LayOut from './Components/LayOut/LayOut'

import About from './Pages/About/About'

import PowerRouter from './Pages/PowerManage/router'

import Error from './Pages/Error/Error'
import {message, notification} from "antd";
import moment from "moment";

const Login = LoadAbleComponent(import('./Pages/Login/Login'), true);
const System = LoadAbleComponent(import('./Pages/System/System'), true);
const Mine = LoadAbleComponent(import('./Pages/Mine/Mine'), true);
const DataAnalyse = LoadAbleComponent(import('./Pages/DataAnalyse/DataAnalyse'), true);
const UserManage = LoadAbleComponent(import('./Pages/UserManage/UserManage'), true);
const Project = LoadAbleComponent(import('./Pages/Project/Project'), true);
const Message = LoadAbleComponent(import('./Pages/Message/Message'), true);
const Chat = LoadAbleComponent(import('./Pages/Chat/Chat'), true);

const store = connect(
    state => ({adminInfo: state.adminInfo}),
    dispatch => bindActionCreators({setAdminInfo, initSocket}, dispatch)
);

@store
class App extends Component {
    render() {
        /*获取本地存储数据*/
        let userToken = config.getCache('token');
        /*主面板*/
        let LayOutRouter = (
            <LayOut>
                <Switch>
                    <Route exact path="/layout" component={System}/>
                    <Route path="/layout/data_analyse" component={DataAnalyse}/>
                    <Route path="/layout/user_manage" component={UserManage}/>
                    <Route path="/layout/project" component={Project}/>
                    <Route path="/layout/message" component={Message}/>
                    <Route path="/layout/chat" component={Chat}/>
                    <Route path="/layout/about" component={About}/>
                    <Route path="/layout/power" component={PowerRouter}/>
                    <Route path="/layout/mine" component={Mine}/>
                    <Route component={Error}/>
                </Switch>
            </LayOut>
        );
        return (
            <Router>
                <Switch>
                    <Route path="/layout" render={
                        userToken || this.props.adminInfo.token ? () => LayOutRouter : () => <Redirect to="/login"
                                                                                                       push/>
                    }/>
                    <Route path="/login" component={Login}/>
                    <Redirect exact form="/" to="/layout"/>
                </Switch>
            </Router>
        )
    }

    componentDidMount() {
        if (config.getCache('token')) {
            // 获取管理员信息
            this.getAdminInfo();
            // 每隔15分钟重新更新token
            setInterval(() => {
                this.updateToken();
            },  60 * 1000 * 15)
        }
    }

    async updateToken() {
        let data = await updateToken();
        if(data.code === 200){
            config.setCache('token', data.token);
        }
    }

    async getAdminInfo() {
        let data = await getAdminInfo();
        if (data.code === 200) {
            await this.props.setAdminInfo(data.result);
            notification.info({
                message: '欢迎您',
                description: `亲爱的 ${this.props.adminInfo.admin.username} (${this.props.adminInfo.roleInfo.roleName}) 您好，当前时间为：${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}`,
                duration: 3,
                top: 60
            });
            /*初始化socket*/
            this.props.initSocket({
                uuid: this.props.adminInfo.admin.uuid,
                username: this.props.adminInfo.admin.username,
                headImg: this.props.adminInfo.admin.headImg,
                power: this.props.adminInfo.roleInfo.power,
            });
        } else {
            message.warning(data.data)
        }
    }
}

export default App;
