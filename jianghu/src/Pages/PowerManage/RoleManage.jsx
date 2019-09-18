import React, {Component} from 'react';
import {Menu, Icon, Result} from 'antd'
import {Route,Switch,Redirect, withRouter} from 'react-router-dom'
import DepartmentManage from './children/DepartmentManage'
import TitleManage from './children/TitleManage'
import './css/roleManage.styl'
import {connect} from "react-redux";

const store = connect(
    state => ({
        adminInfo: state.adminInfo,
    }),
    null
);

@store @withRouter
class RoleManage extends Component {
    state = {
      navList: [
          {
              icon: 'deployment-unit',
              navName: '部门管理',
              key: '/layout/power/role_manage/departmentManage'
          },
          {
              icon: 'gold',
              navName: '职称管理',
              key: '/layout/power/role_manage/titleManage'
          }
      ],
        isAdmin: false
    };
    render() {
        let {navList, isAdmin} = this.state;
        let selectKey = this.props.history.location.pathname;
        return (
            <div>
                {
                    isAdmin ? <div className='role-manage-box'>
                        <div className="left">
                            <Menu
                                style={{ width: '100%' }}
                                selectedKeys={[selectKey]}
                                mode={'inline'}
                                theme={'light'}
                                onClick={e => this.changeNav(e)}
                            >
                                {
                                    navList.map(nav =>(
                                        <Menu.Item key={nav.key}>
                                            <Icon type={nav.icon} />
                                            {nav.navName}
                                        </Menu.Item>
                                    ))
                                }
                            </Menu>
                        </div>
                        <div className="right">
                            <Switch>
                                <Route path="/layout/power/role_manage/departmentManage" component={DepartmentManage} />
                                <Route path="/layout/power/role_manage/titleManage" component={TitleManage} />
                                <Redirect exact form="/layout/power/role_manage" to="/layout/power/role_manage/departmentManage" />
                            </Switch>
                        </div>
                    </div> :  <Result
                        status="403"
                        title="403"
                        subTitle="对不起，你无权限查看此板块！"
                    />
                }
            </div>
        );
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(JSON.stringify(prevProps.adminInfo) !== JSON.stringify(this.props.adminInfo)){
            this.isAdmin();
        }
    }
    componentDidMount() {
        this.isAdmin();
    }

    isAdmin(){
        let adminInfo = this.props.adminInfo;
        if(adminInfo.roleInfo){
            if(adminInfo.roleInfo.power === 0){
                this.setState({
                    isAdmin: true
                })
            }
        }
    }

    // nav变化
    changeNav(e){
        this.props.history.push(e.key);
    }

}

export default RoleManage;
