exports.loggingMiddleware = (req, res, next) => {
    console.log("requested for " + req.url + " at " +new Date());
    next();
}