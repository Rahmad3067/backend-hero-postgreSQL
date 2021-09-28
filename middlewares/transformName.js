function transformName (req, _res, next) {
    req.body.name = req.body.name.toLowercase()
}