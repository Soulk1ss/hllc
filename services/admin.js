const connection = require('../configs/database')
const { password_hash, password_verify, isEmpty } = require('../configs/security')
const modelAdmin = connection.model('admin', {
    u_username: String,
    u_password: String
})
module.exports = {
    onRegister(value) {
        return new Promise((resolve, reject) => {
            value.u_password = password_hash(value.u_password)
            // create instance from user
            const newAdmin = new modelAdmin({
                u_username: value.u_username,
                u_password: value.u_password,
            })
            // save to database (return as Promise)
            newAdmin.save().then(res => resolve(res)).catch(err => reject({ status: 'cannot registered' }))
        })
    },
    onLogin(req) {
        const value = req.body
        /*
        return new Promise((resolve, reject) => {
            modelAdmin.find({ u_username: value.u_username, u_password: password_hash(value.u_password) }).select('u_username').then(res => {
                if(isEmpty(res)){
                    resolve({ message: 'Authen fail' })
                }else{
                    resolve(res)
                }
            }).catch(err => reject(err))
        })
        */
        return new Promise((resolve, reject) => {
            modelAdmin.find({ u_username: value.u_username, u_password: password_hash(value.u_password) }).select('u_username').exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    if(isEmpty(res)){
                        resolve({ message: 'Authen fail' })
                    }else{
                        resolve(res)
                    }
                }
            })
        })

    }
}