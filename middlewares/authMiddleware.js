const jwt = require("jsonwebtoken");

module.exports = async(req,res,next) => {
    try {
        //get token:
        const token = req.headers["authorization"].split(" ")[1];
        
        jwt.verify(token, process.env.SECRET_KEY,(err,decode) => {
            if(err){
                return res.status(401).send({
                    success:false,
                    message:"Un-Authorised User",
                });
            }
            else {
                // If the token is successfully verified it extracts the id from the decoded payload and attaches it to the request body for further processing:
                req.body.id = decode.id;

                // passing control to the next middleware in the stack:
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"please Provide Auth Token",
            error,
        });
    }
}