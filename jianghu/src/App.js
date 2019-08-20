import React,{Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import {connect} from "react-redux";

import 'antd/dist/antd.min.css'

import config from './Config'

import LayOut from './Components/LayOut/LayOut'

import Login from './Pages/Login/Login'
import System from './Pages/System/System'
import DataAnalyse from './Pages/DataAnalyse/DataAnalyse'
import UserManage from './Pages/UserManage/UserManage'
import Project from './Pages/Project/Project'
import Message from './Pages/Message/Message'
import Chat from './Pages/Chat/Chat'
import About from './Pages/About/About'

import PowerRouter from './Pages/PowerManage/router'

import Mine from './Pages/Mine/Mine'
import Error from './Pages/Error/Error'

class App extends Component{
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
        return(
            <Router>
                <Switch>
                    <Route path="/layout" render={
                        userToken || this.props.adminInfo.token ? () =>LayOutRouter : () =><Redirect to="/login" push/>
                    } />
                    <Route path="/login" component={Login} />
                    <Redirect exact form="/" to="/layout" />
                </Switch>
            </Router>
        )
    }

    componentDidMount() {
        console.log('请求个人数据');
    }
}

const mapStateToProps = (state)=>{
    return {
        adminInfo: state.adminInfo
    }
};

export default connect(mapStateToProps, null)(App);
