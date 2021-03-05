const { check, validationResult } = require('express-validator')
module.exports = function(req, res, next){
    //// value validation
    req.validate = function(){
        const errors = validationResult(req).array()
        if(errors.length == 0) return
        throw new Error(`${errors[0].param} : ${errors[0].msg}`)
    }
    //// display error message
    res.error = function(ex, status = 400){
        res.status(status).json({
            message: ex.message
        })
    }
    next()
}