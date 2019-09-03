/**
 * 图片资源加载完毕执行函数
 * @param imageArr {Array}
 * @param callback {Function}
 */
export const loadImages = (imageArr, callback) =>{
    if(Array.isArray(imageArr)){
        let successCount = 0;
        imageArr.forEach(img =>{
            let image = new Image();
            image.src = img;
            image.addEventListener('load', ()=>{
                successCount += 1;
                if(successCount === imageArr.length){
                    callback && callback();
                }
            })
        })
    }else {
        throw new Error('请传递图片数组')
    }
};