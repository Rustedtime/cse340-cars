const errorCont = {}

errorCont.causeError = async function (req, res, next) {
    next({status: 500, message: 'Someone somewhere messed up. (It was probably me)'})
}

module.exports = errorCont