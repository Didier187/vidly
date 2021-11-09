

function admin(req,res, next){
    //401 unathorised
    //403 forbidden
    if(!req.user.isAdmin) return res.status(403).send('can not operate that operation')
    next()
}

module.exports = admin