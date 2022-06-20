const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');

const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(login, password){
        const candidate = await UserModel.findOne( { where: { login } } );
        if(candidate){
            throw ApiError.BadRequest(`Користувач із таким логіном ${login} вже існує.`)
        }
        
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({
            login,
            password: hashPassword
        })

        const userDto = new UserDto(user); // id, login
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: UserDto }

    }

    async login(login, password) {
        const user = await UserModel.findOne( { where: { login } } );
        if(!user) {
            throw ApiError.BadRequest(`Користувач із логіном ${login} не був знайденний`);
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest('Не коректний пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: UserDto }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findByPk(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: UserDto }
    }

    async getAllUsers(){
        const users = await UserModel.findAll();
        return users;
    }
}

module.exports = new UserService();