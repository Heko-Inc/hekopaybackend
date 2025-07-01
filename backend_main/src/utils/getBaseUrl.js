const getBaseURL = (req) =>{

    const protocol = req.protocol;

    const host = req.get("host");

    const pathname = req.baseUrl + req.path;

    return `${protocol}://${host}${pathname}`

}


module.exports = getBaseURL;