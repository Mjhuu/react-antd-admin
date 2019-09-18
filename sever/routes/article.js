import express from 'express'
import ArticleController from './../Mysql/Controller/Article.Controller'

const router = express.Router();

router.post('/delComment', ArticleController.delComment);
router.post('/collectArticle', ArticleController.collectArticle);
router.post('/commentArticle', ArticleController.commentArticle);
router.post('/gradeArticle', ArticleController.gradeArticle);
router.get('/getArticle', ArticleController.getArticle);
router.get('/getArticleInfo', ArticleController.getArticleInfo);
router.post('/publishArticle', ArticleController.publishArticle);
router.post('/publishApp', ArticleController.publishApp);

export default router
