import React, {Component} from 'react';
import {getAllDepartmentAndJob} from "../../../Api";
import {Tree, message, Icon, Skeleton} from 'antd';
import {inject_unount} from "../../../Utils/decorator";

const { TreeNode } = Tree;

@inject_unount
class DepartmentManage extends Component {
    state = {
        departmentAndJobList : [],
        departmentAndJobLoading: false,
    };
    render() {
        let {departmentAndJobList, departmentAndJobLoading} = this.state;
        console.log(departmentAndJobList);
        return (
            <div className="department-manage-box">
                {
                    departmentAndJobLoading ? <Skeleton active /> : departmentAndJobList.length !== 0 && departmentAndJobList.map(v=>(
                        <div key={v.id} className="depart-job">
                            <Tree showIcon onSelect={this.onSelect}>
                                <TreeNode icon={<Icon type="deployment-unit" />} title={v.departmentName} key={`departmentId-${v.id}`}>
                                    {
                                        v.jobs.map(job =>(
                                            <TreeNode icon={<Icon type="block" />} title={job.jobName} key={`departmentId-${v.id}&jobId-${job.id}`} />
                                        ))
                                    }
                                </TreeNode>
                            </Tree>
                        </div>
                    ))
                }
            </div>
        );
    }
    componentDidMount() {
        //获取部门-职位列表
        this.getAllDepartmentAndJob();
    }

    onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
        if(selectedKeys.length > 0){
            let selected = selectedKeys[0];
            selected = selected.split('&');
            let obj = {};
            selected.forEach(v =>{
                v = v.split('-');
                obj[v[0]] = v[1]
            });
            console.log(obj);
        }
    };
    async getAllDepartmentAndJob (){
        await this.setState({
            departmentAndJobLoading: true,
        });
        let data = await getAllDepartmentAndJob();
        if(data.code === 200){
            this.setState({
                departmentAndJobList: data.departmentAndJob,
                departmentAndJobLoading: false
            })
        }else {
            message.warning(data.data)
        }
    }
}

export default DepartmentManage;
