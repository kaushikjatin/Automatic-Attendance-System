const createError=require('http-errors')
var fs = require('fs');
const path=require('path')

exports.saveImage=(images,dir)=>{
    // console.log(__dirname)
    return new Promise(async(resolve,reject)=>{
        try {
            // if (fs.existsSync(dir)){
            //     fs.rmdirSync(dir,{recursive:true,force:true})
            //     // console.log('Roll no folder already exist for image saving')
            //     // reject(('images already exists'))
            // }
            // fs.mkdirSync(dir)
            // console.log(__dirname)
            var imNames=images.map(image=>{
                if(image.fieldname.startsWith('image')){
                    // console.log(image)
                    // console.log('hlo')
                    // console.log(dir)
                    // console.log('hlo')
                    fs.writeFileSync((dir+'_'+image.fieldname+'.'+image.mimetype.split('/')[1]),image.buffer)
                    // console.log(path.join(dir+'_'+image.fieldname+'.'+image.mimetype.split('/')[1]))
                    // console.log(dir.split('public')[1]+'_'+image.fieldname+'.'+image.mimetype.split('/')[1])
                    return dir.split('public')[1]+'_'+image.fieldname+'.'+image.mimetype.split('/')[1]
                }
            })
            imNames=imNames.filter(im=>im!==undefined)
            // console.log(imNames)
            resolve(imNames)
        } catch (error) {
            console.log(error)
            reject(('some error occored while storing images.Please try again'))
        }
    })
}
exports.deleteImages=(filePaths)=>{
    // console.log(filePaths)
    return new Promise(async(resolve,reject)=>{
        filePaths.forEach(filePath => {
            fs.unlinkSync('public'+filePath)
        });
        resolve();
    })
}