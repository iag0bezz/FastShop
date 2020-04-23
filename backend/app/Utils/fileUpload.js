'use strict'

const Utils = use('App/Utils')
const Helpers = use('Helpers')

const single_upload = async (file, path = null) => {
    path = path ? path : Helpers.publicPath('uploads')
    
    const randomName = await Utils.string_random(30)
    let filename = `${new Date().getTime()}-${randomName}.${file.subtype}`

    await file.move(path, {
        name: filename
    })

    return file
}

const multiple_uploads = async (fileJar, path = null) => {
    let successes = [], errors = []

    await Promise.all(
        fileJar.files.map(async file => {
            const uploaded_file = await single_upload(file, path)

            if(uploaded_file.moved()){
                successes.push(uploaded_file)
            } else {
                errors.push(uploaded_file.error())
            }
        })
    )
    return {
        successes,
        errors
    }
}

module.exports = {
    single_upload,
    multiple_uploads
}