const { createLogger, format, transports } = require('winston')
require('winston-mongodb');

function errorHandler(err,req,res,next){
    const logger = createLogger({
        transports:[
        
        // File transport
            new transports.File({
            filename: 'logs/server.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )}),
        
        // MongoDB transport
            new transports.MongoDB({
                level: 'error',
                //mongo database connection link
                db : 'mongodb://localhost/vidly',
                options: {
                    useUnifiedTopology: true
                },
                // A collection to save json formatted logs
                collection: 'server_logs',
                format: format.combine(
                format.timestamp(),
        
                // Convert logs to a json format
                format.json())
            })]
        });
    logger.error(err.message, err)
    res.status(500).send('something went wrong!')
}

module.exports = errorHandler