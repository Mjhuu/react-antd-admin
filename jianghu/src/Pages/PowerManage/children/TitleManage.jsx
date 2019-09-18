import React, {Component} from 'react';
import {Icon, message, Skeleton, Tree} from 'antd'
import {getAllRoleList} from "../../../Api";
import {inject_unount} from "../../../Utils/decorator";

const { TreeNode } = Tree;

@inject_unount
class TitleManage extends Component {
    state = {
        titleList: [],
        titleLoading: false
    };
    render() {
        let {titleList, titleLoading} = this.state;
        return (
            <div className='title-box'>
                {
                    titleLoading ? <Skeleton active /> : Object.keys(titleList).map(key =>(
                        <div key={key} className="power">
                            <Tree
                                showIcon
                                onSelect={this.onSelect}
                                switcherIcon={<Icon type="down" />}
                            >
                                <TreeNode icon={<Icon type="crown" />} title={`power-${key}`} key={`power-${key}`}>
                                    {
                                        titleList[key].map(role =>(
                                            <TreeNode icon={<Icon type="gold" />} title={`${role.roleName}-${role.rolePower}`} key={`roleId-${role.id}`} />
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
        //获取级别列表
        this.getAllRoleList();
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

    async getAllRoleList(){
        await this.setState({
            titleLoading: true,
        });
        let data = await getAllRoleList();
        if(data.code === 200){
            let titleList = data.result;
            let obj = {};
            titleList.forEach(title =>{
                if(!obj.hasOwnProperty(title.power)){
                    obj[title.power] = []
                }
                obj[title.power].push({
                    id: title.id,
                    roleName: title.roleName,
                    rolePower: title.rolePower
                })
            });
            this.setState({
                titleList: obj,
                titleLoading: false
            })
        }else {
            message.warning(data.data)
        }
    }
}

export default TitleManage;
