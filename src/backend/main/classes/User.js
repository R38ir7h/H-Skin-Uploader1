
const MongoDB = require('@backend/main/classes/MongoDB');
const { ObjectId } = require('mongodb');
const base = new MongoDB('users');

class User {
    /**
     * Создать пользователя исходя из запроса
     * @param {any} response 
     */
    static async createOrFind(response) {
        const { id, displayName, profileUrl, photos } = response;

        // Находим такого пользователя
        const result = await User.find(id);

        // Если его не существует создаём
        if (!result) {
            await base.insertOne({
                vkId: id,
                displayName: displayName,
                profileUrl: profileUrl,
                avatar: photos[0].value,

                balance: 0,
                images: []
            });

            return await User.find(id);
        } else {
            result.displayName = displayName;
            result.avatar = photos[0].value;
            result.save();
        }

        return result;
    }

    /**
     * Найти пользователя по ObjectID
     * @param {ObjectId} id 
     * @returns {Promise<User|null>}
     */
    static async findByObjectId(id) {
        const result = await base.findOne({ _id: id });

        return result ? new User(result) : null;
    }

    /**
     * Найти пользователя по ID
     * @param {string} id 
     * @returns {Promise<User|null>}
     */
    static async find(id) {
        const result = await base.findOne({ vkId: id });

        return result ? new User(result) : null;
    }

    /**
     * Конструктор класса пользователя
     * @param {any} value 
     */
    constructor(value) {
        this.data = value;
    }

    /**
     * ID пользователя в БД
     * @type {ObjectId}
     */
    get id() { return new ObjectId(this.data._id); }
    
    /**
     * ID пользователя в ВК
     * @type {number}
     */
    get vkId() { return this.data.vkId; }

    /**
     * Отображаемое имя ВК
     * @type {string}
     */
    get displayName() { return this.data.displayName; }

    set displayName(v) { this.data.displayName = v; }

    get images() { 
        if (!this.data.images) {
            this.data.images = [];
        }

        return this.data.images;
     };
    set images(v) { this.data.images = v; }

    /**
     * Отображаемое имя ВК
     * @type {string[]}
     */
    get servers() { 
        this.data.servers = this.data.servers || [];
        return this.data.servers;
     }

    set servers(v) { this.data.servers = v; }

    /**
     * Ссылка на изображение профиля VK
     * @type {string} 
     */
    get avatar() { return this.data.avatar; }

    set avatar(v) { this.data.avatar = v; }
    
 
    /** 
     * Баланс пользователя
     * @type {number}
     */
    get balance() { return this.data.balance; }

    set balance(v) { this.data.balance = v; }

    /**
     * Возвращает информацию на фронт в нужной структуре
     * @returns {Promise<UserInfo>}
     */
    async getInfo() {
        /** @type {any} */
        const base = JSON.parse(JSON.stringify(this.data));
        
        while (base.avatar.includes('&amp;')) {
            base.avatar = base.avatar.replace('&amp;', '&')
        }

        return base;
    }

    /**
     * Сохранить информацию о пользователе в БД
     */
    async save() {
        base.updateOne({ _id: this.id }, { $set: { ...this.data }});
    }
}

module.exports = User;