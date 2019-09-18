import Model from "./../main";

class RoleController {
    /*获取所有角色列表*/
    async getAllRoleList(req, res, next){
        let data = await Model.Role.findAll({
            attributes: ['id', 'power', 'roleName', 'rolePower']
        });
        res.json({
            code: 200,
            data: '获取角色列表成功',
            result: data
        })
    }
}

export default new RoleController()
