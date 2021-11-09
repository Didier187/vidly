const config = require('config')

module.exports= function(){
    if(!config.get('jwtPrivateKey')){
        //log this message with winston and remove process.exit(1)
        console.error('FATAL ERROR missing jwt key')
        //0 =success , >= 1 = failure in the process global object
        process.exit(1)
    }
}