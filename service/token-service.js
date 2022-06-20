const jwt = require('jsonwebtoken');

const tokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
         const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRIT,
            {expiresIn: '30d'}
         );
         const refreshToken = jwt.sign(
            payload,
            process.env.JWT_FRESH_SECRIT,
            { expiresIn: '30d' }
         )
        return { accessToken, refreshToken }
    }

    validateAccessToken(token){
        try{
            const userDate = jwt.verify(token, process.env.JWT_ACCESS_SECRIT);
            return userDate;
        }catch(e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userDate = jwt.verify(token, process.env.JWT_FRESH_SECRIT);
            return userDate;
        }catch(e){
            return null;
        }
    }

    async saveToken(userID, refreshToken){
        const tokenData = await tokenModel.findOne({ where: { user: userID } });
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({
            user: userID,
            refreshToken
        })
        return token;
    }
    async removeToken(refreshToken){
        const tokenData = await tokenModel.findOne({ where: { refreshToken } });
        await tokenData.destroy();
        return tokenData;
    }
    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

module.exports = new TokenService();