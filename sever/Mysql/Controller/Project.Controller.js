import Model from './../main'
import {getAdminId} from "../../allRequest";
import {toNumber} from "../../Decorator";

class ProjectController {
    //删除作品【只能本人删除】
    @toNumber({
        type: 'post',
        dealValue: ['projectId']
    })
    async delProject(req, res, next){
        let {projectId} = req.body;
        let adminId = await getAdminId(req, res, next);
        let findProject = await Model.Project.findByPk(projectId);
        if(!findProject){
            return res.json({code: 500, data: '此作品已被删除'})
        }
        if(adminId !== findProject.adminId){
            return res.json({code: 500, data: '你无权删除他人作品'})
        }
        findProject = await findProject.destroy().catch(err => next({res: err, msg: '删除项目失败'}));
        res.json({
            code: 200,
            data: '作品删除成功'
        })
    }
    //获取作品列表
    async getProjectList(req, res, next){
        let projectList = [];
        let data = await Model.Project.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
        });
        for (let i = 0; i < data.rows.length; i++) {
            let adminInfo = await Model.Admin.findOne({
               where:{
                   id: data.rows[i].adminId
               },
                attributes: ['uuid', 'username', 'headImg']
            });
            projectList.push({
                projectInfo: data.rows[i],
                adminInfo
            })
        }
        res.json({
            code: 200,
            data: '获取作品列表成功',
            result: projectList
        })
    }
    //新增作品
    async addProject(req, res, next){
        let {url, title, description, backgroundColor} = req.body;
        let adminId = await getAdminId(req, res, next);
        let newProject = await Model.Project.create({
            adminId, url, title, description, backgroundColor
        }).catch(err => next({res: err, msg: '新增项目失败'}));
        res.json({
            code: 200,
            data: '项目新增成功',
            result: newProject
        })
    }
}

export default new ProjectController()
