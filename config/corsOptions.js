const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin : (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
<<<<<<< HEAD
    credentials: true,
    optionsSuccessStatus: 200
=======
    Credentials : true,
    optionSuccessStatus : 200
>>>>>>> a7981bcd4b37a595c25833b578c4f905587c0176
}

module.exports = corsOptions
