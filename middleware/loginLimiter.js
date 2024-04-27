const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per minute
    message: 'Too many login attempts from this IP, please try again after a 60 second pause',
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        res.status(options.statusCode).send({ message: options.message });
    },
    headers: true, // Include rate limit info in the response headers
});

module.exports = loginLimiter;
