const User = require('./User');
const Passport = require('passport');
const VKAuth = require('passport-vkontakte').Strategy;

class Auth {
    /**
     * Инициализация паспорта для авторизации
     */
    static initialize() {
        Passport.use(
            new VKAuth({
                clientID: '',
                clientSecret: '',
                callbackURL:  'http://78.36.200.237:2020/auth/vkontakte/callback',
                lang: 'ru'
            },
            Auth.auth)
        )
 
        Passport.serializeUser(function(user, done) {
            done(null, user.vkId);
        });
        
        Passport.deserializeUser(function(id, done) {
            User.find(id)
                .then(function (user) { done(null, user.data); })
                .catch(done);
        });
    }

    /**
     * Метод срабатываемый при успешной авторизации
     * @param {string} accessToken 
     * @param {string} refreshToken 
     * @param {any} params 
     * @param {any} profile 
     * @param {any} done 
     */
    static async auth(accessToken, refreshToken, params, profile, done) {
        if (accessToken && accessToken.length > 0) {
            const result = await User.createOrFind(profile);
            if (!result) {
                done();
                return;
            }
            
            logger.info(`Была произведена авторизация '${result.displayName}'`);
            done(null, result.data); 
        }
    }

    /**
     * Инстанс инициализированного паспорта
     */
    static Passport() {
        return Passport;
    }
}

module.exports = Auth;