import Model from './../main'
import {getAdminId} from "../../allRequest";
import {toNumber} from "../../Decorator";
import formidable from "formidable";
import config from "../../config";

class ArticleController {
    // 删除评论
    @toNumber({
        type: 'post',
        dealValue: ['type', 'articleId']
    })
    async delComment(req, res, next){
        let {type, articleId} = req.body;
        let comment = await Model.Comment.findOne({
           where: {id: articleId}
        });
        if(!comment){
            return res.json({
                code: 500,
                data: '此评论已被删除或不存在'
            })
        }
        await comment.destroy().catch(err => next({res: err, msg: '删除失败'}));
        res.json({
            code: 200,
            data: '评论删除成功',
            result: {
                type,articleId
            }
        })
    }
    //收藏文章
    @toNumber({
        type: 'post',
        dealValue: ['articleId', 'type']
    })
    async collectArticle(req, res, next){
        let adminId = await getAdminId(req, res, next);
        let {articleId, type} = req.body;
        let collectInfo = await Model.Collect.findOne({
           where: {
               adminId, articleId
           }
        });
        // type = 1 收藏
        if(type === 1){
            //先看一下有没有收藏记录 有的话提示已收藏 没有的话可以去收藏
            if(!!collectInfo){
                return res.json({
                    code: 500,
                    data: '已收藏'
                })
            }
            let newCollect = await Model.Collect.create({
                adminId, articleId
            }).catch(err => next({res: err, msg: '收藏失败'}));
            res.json({
                code: 200,
                data: '收藏成功',
                result: newCollect
            })
        }else if(type === 0){
            // 先看一下有没有收藏记录 有的话 删除 没有的话 提示已取消
            if(!collectInfo){
                return res.json({
                    code: 500,
                    data: '已取消收藏'
                })
            }
            await collectInfo.destroy().catch(err => next({res: err, msg: '取消收藏失败'}));
            res.json({
                code: 200,
                data: '取消收藏成功'
            })
        }else {
            res.json({
                code: 500,
                data: 'type值传递错误'
            })
        }
        // type = 0 取消收藏
    }
    //评分文章
    async gradeArticle(req, res, next){
        let adminId = await getAdminId(req, res, next);
        let {score, articleId} = req.body;
        let gradeInfo = await Model.Grade.findOne({
           where: {
               articleId, adminId
           }
        });
        if(!!gradeInfo){
            return res.json({
                code: 500,
                data: '已评分'
            })
        }
        let newGrade = await Model.Grade.create({
            adminId, score, articleId
        }).catch(err => next({res: err, msg: '评分失败'}));
        res.json({
            code: 200,
            data: '评分成功',
            result: newGrade
        })
    }
    //评论文章【一级评论 二级评论】
    @toNumber({
        type: 'post',
        dealValue: ['articleId', 'type', 'pId']
    })
    async commentArticle(req, res, next){
        let adminId = await getAdminId(req, res, next);
        let adminInfo = await Model.Admin.findOne({
            where: {id: adminId}
        });
        let {articleId, type, content, pId} = req.body;
        let obj = {};
        if(type === 1){
            obj = {articleId, type, content, pId, adminId}
        }else {
            obj = {articleId, type, content, adminId}
        }
        let newComment = await Model.Comment.create(obj).catch(err => next({res: err, msg: '评论失败'}));
        res.json({
            code: 200,
            data: '评论成功',
            result: {
                adminInfo,
                commentInfo: newComment
            }
        })
    }
    //根据文章id获取文章评论、文章评分、文章是否被收藏、并增加阅读量
    @toNumber({
        type: 'get',
        dealValue: ['id']
    })
    async getArticleInfo(req, res, next){
        let adminId = await getAdminId(req, res, next);
        let {id} = req.query;
        // 获取评论列表
        let commentList = [];
        let comments = await Model.Comment.findAndCountAll({
            where: {articleId: id}
        });
        let cList = comments.rows;
        for(let i=0; i<cList.length; i++){
            let adminInfo = await Model.Admin.findOne({
                where: {id: cList[i].adminId}
            });
            commentList.push({
                adminInfo,
                commentInfo: cList[i]
            })
        }
        // 获取平均评分
        let allGrade = await Model.Grade.sum('score', {
            where: {articleId: id}
        });
        let allGradeCount = await Model.Grade.count({
            where: {articleId: id}
        });
        let averageGrade = allGradeCount !== 0 ? allGrade / allGradeCount : 0;
        // 获取自己的打分
        let myGrade = await Model.Grade.findOne({
            where: {
                adminId, articleId: id
            }
        });
        // 获取自己是否收藏
        let myCollect = await Model.Collect.findOne({
            where: {
                adminId, articleId: id
            }
        });
        // 增加阅读量
        let article = await Model.Article.findOne({
           where: {id}
        });
        article.readCount += 1;
        article.save();
        res.json({
            code: 200,
            data: '获取信息成功',
            result: {
                commentList,
                averageGrade,
                myGrade,
                myCollect,
                allGradeCount,
                allGrade
            }
        })
    }
    //获取文章列表
    @toNumber({
        type: 'get',
        dealValue: ['page', 'limit', 'type']
    })
    async getArticle(req, res, next) {
        let {page, limit, type} = req.query;
        page = page > 0 ? parseInt(page) : 1;
        let offset = page * limit - limit;
        let articleList = [];
        let articles = await Model.Article.findAndCountAll({
            where: {
                type,
                isOpen: 1
            },
            offset, limit,  order: [
                ['id', 'DESC']
            ],
        });
        for(let i = 0; i< articles.rows.length; i++){
            let adminInfo = await Model.Admin.findOne({
                where: {
                    id: articles.rows[i].adminId
                },
                attributes: ['uuid', 'username', 'roleId', 'headImg']
            });
            articleList.push({
                adminInfo,
                articleInfo: articles.rows[i]
            })
        }

        res.json({
            code: 200,
            data: '获取成功',
            result: {
                count: articles.count,
                articleList
            }
        })
    }

    //发布技术文
    @toNumber({
        type: 'post',
        dealValue: ['type', 'isOpen']
    })
    async publishArticle(req, res, next) {
        let adminId = await getAdminId(req, res, next);
        let {title, content, type, isOpen} = req.body;
        let newArticle = await Model.Article.create({
            adminId, title, content, type, isOpen
        });
        res.json({
            code: 200,
            data: '发布成功',
            result: newArticle
        })
    }

    // 发布分享软件
    async publishApp(req, res, next) {
        let adminId = await getAdminId(req, res, next);
        let form = new formidable.IncomingForm();
        form.uploadDir = config.uploadImgDir;
        form.keepExtensions = true;
        form.parse(req, async function (err, fields, files) {
            if (err) throw err;
            let path = files['icon'].path;
            let icon = `http://localhost:3000/uploadImg/${path.slice(path.lastIndexOf('\\') + 1)}`;
            let {title, content, type, isOpen, platform} = fields;
            let newArticle = await Model.Article.create({
                adminId, title, content, type, isOpen, icon, platform
            });
            res.json({
                code: 200,
                data: '发布成功',
                result: newArticle
            })
        });
    }
}

export default new ArticleController()
