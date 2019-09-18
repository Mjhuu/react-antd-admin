import express from 'express'
import formidable from "formidable";
import config from "../config";
const router = express.Router();

/*上传文件*/
router.post('/uploadFile', async (req, res, next) =>{
    let form = new formidable.IncomingForm();
    form.uploadDir = config.uploadImgDir;
    form.keepExtensions = true;
    form.parse(req, async function(err, fields, files) {
        if(err) throw err;
        let path = files['file'].path;
        let url = `http://localhost:3000/uploadImg/${path.slice(path.lastIndexOf('\\')+1)}`;
        res.json({
            code: 200,
            data: '上传成功',
            result: {
                url
            }
        })
    });
});

export default router
