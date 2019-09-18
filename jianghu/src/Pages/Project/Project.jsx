import React, {Component} from 'react';
import {addProject, getProjectList, delProject} from "../../Api";
import {Button, message, Modal, Input, Skeleton} from "antd";
import AnimatedBook from './../../Components/AnimatedBook/AnimatedBooks'
import ColorPicker from "../../Components/ColorPicker";
import FabLabTool from './../../Common/js/FabLabTool'
import './css/index.styl'
import {check_url} from "../../Common/js/FabLabFun";
import {connect} from "react-redux";
import {inject_unount} from "../../Utils/decorator";
import Typing from './../../Components/Typing/Typing'

const { confirm } = Modal;
const myTool = new FabLabTool();
const store = connect(
    state => ({
        adminInfo: state.adminInfo,
    }),
    null
);

@store @inject_unount
class Project extends Component {
    state = {
        showAddProjectModel: false,
        addProjectLoading: false,
        addProjectInfo: { // 添加
            url: '',
            title: '',
            description: '',
            backgroundColor: '#13C2C2'
        },
        projectList: [],
        projectLoading: false
    };

    render() {
        let { showAddProjectModel, addProjectInfo, addProjectLoading, projectList, projectLoading} = this.state;
        return (
            <div className="project-box">
                {/*添加作品窗口*/}
                <Modal
                    title={`添加作品`}
                    visible={showAddProjectModel}
                    onCancel={e => this.handleCancel(e, 'showAddProjectModel')}
                    footer={[
                        <Button key="back" onClick={e => this.handleCancel(e, 'showAddProjectModel')}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={addProjectLoading} onClick={this.addProject}>
                            添加
                        </Button>,
                    ]}
                >
                    <ul className="add-project-box">
                        <li>
                            <div className="left">
                                项目标题：
                            </div>
                            <div className="right">
                                <Input onChange={(e)=> this.inputChange(e, 'title')} value={addProjectInfo.title} placeholder="请输入项目标题" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                项目简介：
                            </div>
                            <div className="right">
                                <Input onChange={(e)=> this.inputChange(e, 'description')} value={addProjectInfo.description} placeholder="请输入项目简介" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                预览地址：
                            </div>
                            <div className="right">
                                <Input onChange={(e)=> this.inputChange(e, 'url')} value={addProjectInfo.url} placeholder="请输入预览地址" />
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                封面颜色：
                            </div>
                            <div className="right">
                                <ColorPicker
                                    color={addProjectInfo.backgroundColor}
                                    onChange={this.changeColor}
                                />
                            </div>
                        </li>
                    </ul>
                </Modal>
                {/*版本介绍*/}
                <Typing>
                    <p className="ant-alert ant-alert-info ant-alert-no-icon">各位技术大牛，如果你有优秀的作品，不要吝啬，尽情的分享出来，向更多的人展示吧。</p>
                    <p className="ant-alert ant-alert-warning ant-alert-no-icon m-t-1">你可以自由的创建和删除自己的项目。</p>
                </Typing>
                <div className="project-nav">
                    <ul>
                        <li>
                            <Button icon='plus' onClick={this.showAddProjectModel}>创建</Button>
                        </li>
                    </ul>
                </div>
                <div className="ani-box">
                    {
                        projectLoading ? <Skeleton active /> : projectList.map((p, index) =>(
                            <AnimatedBook
                                key={p.projectInfo.id}
                                headImg={p.adminInfo.headImg ? p.adminInfo.headImg : ''}
                                username={p.adminInfo.username}
                                title={p.projectInfo.title}
                                description={p.projectInfo.description}
                                background={p.projectInfo.backgroundColor}
                                delState={this.props.adminInfo.admin.uuid === p.adminInfo.uuid}
                                url={p.projectInfo.url}
                                onDel={() =>this.delProject(p, index)}
                                style={{marginBottom: 100}}/>
                        ))
                    }
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getProjectList();
    }
    delProject = (project, index)=>{
        confirm({
            title: '删除项目?',
            content: `你确定删除 《${project.projectInfo.title}》 项目吗？`,
            onOk: () =>{
                return new Promise(async (resolve, reject) => {
                    let data = await delProject({
                       projectId: project.projectInfo.id
                    });
                    if(data.code === 200){
                        console.log(data);
                        message.success(data.data);
                        let {projectList} = this.state;
                        projectList.splice(index, 1);
                        await this.setState({
                            projectList
                        });
                        resolve();
                    }else {
                        reject(data.data)
                    }
                }).catch(err => message.warning(err));
            }
        });
    };
    inputChange = (e, type)=>{
        let {addProjectInfo} = this.state;
        let value = e.target.value;
        addProjectInfo[type] = value;
        this.setState({
           addProjectInfo
        });
    };
    //切换封面颜色
    changeColor = color => {
        console.log(color);
        let {addProjectInfo} = this.state;
        addProjectInfo.backgroundColor = color;
        this.setState({
            addProjectInfo
        })
    };
    /*点击模板取消*/
    handleCancel = (e, key) => {
        this.setState({
            [key]: false,
        });
    };
    showAddProjectModel = ()=>{
      this.setState({
          showAddProjectModel: true
      })
    };
    addProject = async ()=>{
        let {addProjectInfo} = this.state;
        let titleRes = myTool.filterWords(addProjectInfo.title);
        let desRes = myTool.filterWords(addProjectInfo.description);
        if(titleRes.offWords.length > 0){
            return message.warning('标题包含敏感词汇')
        }
        if(desRes.offWords.length > 0){
            return message.warning('简介包含敏感词汇')
        }
        if(addProjectInfo.title.length === 0 || addProjectInfo.title.length > 20){
            return message.warning('请输入字数20以内的标题')
        }
        if(addProjectInfo.description.length === 0 || addProjectInfo.description.length > 40){
            return message.warning('请输入字数40以内的简介')
        }
        if(!check_url(addProjectInfo.url)){
            return message.warning('预览网址格式错误')
        }
        await this.setState({
            addProjectLoading: true
        });
        let data = await addProject({
            ...addProjectInfo
        });
        if (data.code === 200) {
            let {projectList} = this.state;
            projectList.unshift({
                projectInfo: data.result,
                adminInfo: {
                    uuid: this.props.adminInfo.admin.uuid,
                    username: this.props.adminInfo.admin.username,
                    headImg: this.props.adminInfo.admin.headImg,
                }
            });
            message.success(data.data);
            this.setState({
                projectList,
                addProjectInfo: {
                    url: '',
                    title: '',
                    description: '',
                    backgroundColor: '#13C2C2'
                },
                addProjectLoading: false,
                showAddProjectModel: false
            });
        } else {
            message.warning(data.data)
        }
    };
    // 获取项目列表
    getProjectList = async ()=>{
        await this.setState({
            projectLoading: true
        });
        let data = await getProjectList();
        if(data.code === 200){
            this.setState({
                projectLoading: false,
                projectList: data.result
            })
        }else {
            message.warning(data.data)
        }
    };
}

export default Project;
