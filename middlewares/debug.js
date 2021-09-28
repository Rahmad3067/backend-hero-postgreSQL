function debug (_req, _res, next) {
    console.log('Request recieved' + new Date());
    next();
}

module.exports = debug;