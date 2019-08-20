import React, {Component} from 'react';
import {Route,Switch,Redirect} from 'react-router-dom'
import AdminManage from './AdminManage'
import RoleManage from './RoleManage'

class PowerRouter extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/layout/power/role_manage" component={RoleManage} />
                    <Route path="/layout/power/admin_manage" component={AdminManage} />
                    <Redirect exact form="/layout/power" to="/layout/power/role_manage" />
                </Switch>
            </div>
        );
    }
}

export default PowerRouter;
