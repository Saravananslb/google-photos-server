const { signUp, signIn, checkCookie } = require('../Service/user.service');

const signup = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const userCreation = await signUp(email, password, firstName, lastName);
    res.status(userCreation.status ? 201 : 400).json({
        ...userCreation
    })
    return;
}

const signin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const getUser = await signIn(email, password);
    if (getUser.status) {
        res.cookie('authToken', getUser.authToken, { maxAge: 3600000 });
        res.status(200).json({
            ...getUser
        });
        return;
    }
    res.status(401).json({
        ...getUser
    });
    return;
    
}

const validateUser = async (req, res) => {
    const userId = res.locals.userId;

    const getUser = await checkCookie(userId);
    if (getUser.status) {
        res.cookie('authToken', getUser.authToken, { maxAge: 3600000 });
        res.status(200).json({
            ...getUser
        });
        return;
    }
    res.status(401).json({
        ...getUser
    });
    return;
    
}

module.exports = {
    signin,
    signup,
    validateUser
}