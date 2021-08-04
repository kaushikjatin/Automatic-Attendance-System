const fs=require('fs')
// import fs from 'fs'
const deleteImages=(dir)=>{
    return new Promise(async(resolve,reject)=>{
        if(!fs.existsSync(dir))
            reject('Images does not exists')
        fs.rmdirSync(dir,{recursive:true,force:true},(err)=>{
            if(err)
                reject(err.message)
            else
                resolve()
        })
    })
}
// deleteImages('asdf').then(_=>console.log('Folder deleted'))
// .catch(err=>console.error(err))