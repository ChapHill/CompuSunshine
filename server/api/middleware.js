const {
    models: {User},
} = require("../db");


const requireToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = await User.findByToken(token);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

const isAdmin = (req, res, next) => {
    if(!req.user.isAdmin) {
        return res.status(403).send("Unauthorized access");
    } else {
        next();
    }
}

module.exports = {
    isAdmin,
    requireToken
}