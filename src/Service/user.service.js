const usersModel = require('../Models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRound = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'gmailSecret';

const { success, failure } = require('../Utils/helper');

const findUserByEmail = async (email) => {
    try {
        const user = await usersModel.findOne({
            email: email.toLowerCase()
        })
        return user;
    }
    catch (error) {
        console.log(error);
        return;
    }
}

const signUp = async (email, password, firstName, lastName) => {
    try {
        const userCheck = await findUserByEmail(email);
        if (userCheck) return failure({ error: 'user already exists' }, 'user exists, please sign in to continue..')
        const hashPassword = await bcrypt.hash(password, saltRound);
        const userCreate = new usersModel({
            email: email.toLowerCase(),
            password: hashPassword,
            firstName: firstName,
            lastName: lastName
        });
        const signInUser = await userCreate.save();
        delete signInUser._doc.password
        return success(signInUser._doc, 'user created successfully');
    }
    catch (error) {
        console.log(error);
        return failure({error: error}, 'Failed to create user');
    }
}

const signIn = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
    
        if (user) {
            const checkPassword = await bcrypt.compare(password, user.password);
            if (checkPassword) {
                const authToken = jwt.sign({
                    email: user.email,
                    id: user.id,
                    name: user.name
                }, JWT_SECRET, { expiresIn: '10hrs' });
                return success({ authToken: authToken, email: user.email, id: user.id, firstName: user.firstName, lastName: user.lastName }, 'user logged in successfully')
            }
            return failure({ error: 'wrong password' }, 'incorrect password')
        }
        return failure({ error: 'user not found' }, 'user not found');
    }
    catch (error) {
        console.log(error);
        return failure({error: error}, 'Failed to login user')
    }
}

const checkCookie = async (userId) => {
    try {
        const user = await usersModel.findById(userId);
    
        if (user) {
            const authToken = jwt.sign({
                email: user.email,
                id: user.id,
                name: user.name
            }, JWT_SECRET, { expiresIn: '10hrs' });
            return success({ authToken: authToken, email: user.email, id: user.id, name: user.name }, 'user logged in successfully')
            
        }
        return failure({ error: 'user not found' }, 'user not found');
    }
    catch (error) {
        console.log(error);
        return failure({error: error}, 'Failed to validate user')
    }
}

module.exports = {
    signUp,
    signIn,
    checkCookie
}