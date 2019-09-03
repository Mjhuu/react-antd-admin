import React, {Component} from 'react';

import {Button} from "antd";
import AnimatedBook from './../../Components/AnimatedBook/AnimatedBooks'
import './css/index.styl'

class Project extends Component {
    constructor(props){
        super(props);
        this.presetColors = ['#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14', '#A0D911', '#52C41A', '#13C2C2', '#1890FF', '#2F54EB', '#722ED1', '#EB2F96']
    }
    render() {
        return (
            <div className="project-box">
                <div className="project-nav">
                    <ul>
                        <li>
                            <Button icon='plus'>创建</Button>
                        </li>
                        <li>
                            <Button icon='delete' type='danger'>删除</Button>
                        </li>
                    </ul>
                </div>
                <div className="ani-box">
                    <AnimatedBook
                        title={"FabLab 工作台"}
                        description={"FabLab 工作台 介绍--基于vue"}
                        background={this.presetColors[2]}
                        url={"http://desk.hotsalevideo.com"}
                        style={{ marginBottom: 100 }} />
                    <AnimatedBook
                        title={"易课"}
                        description={"学生课堂管理"}
                        background={this.presetColors[5]}
                        url={"http://goutclass.top"}
                        style={{ marginBottom: 100 }} />
                </div>
            </div>
        );
    }
}

export default Project;
