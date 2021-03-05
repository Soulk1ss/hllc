const crypto = require('crypto')
const security = {
    password_hash(password) {
        return crypto.createHash('sha1').update(password).digest('hex');
    },
    password_verify(password, password_hash) {
        return security.password_hash(password) === password_hash
    },
    authenticatedAdmin(req, res, next) {
        /*
        req.session.userAdmin = {
            'u_username': 'admin'
        }
        */
        try {
            if (req.session.userAdmin) {
                return next()
            }
            throw new Error('Unautherize.')

        } catch (ex) {
            res.error(ex, 401)
        }
    },
    authenticated(req, res, next) {
        /*
        req.session.userLogin = {
            'u_id': '123456789',
            'u_username': 'tester',
            'u_faculty': 'science'
        }*/
        try {
            if (req.session.userLogin) {
                return next()
            }
            throw new Error('Unautherize.')

        } catch (ex) {
            res.error(ex, 401)
        }
    },
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}
module.exports = security