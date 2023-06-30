const { ObjectId } = require("mongodb");
const User = require("./User");

class ImageLoader {
    /** @type {ImageLoader[]} */
    static poll = [];

    /**
     * Создать запрос на загрузку
     * @param {User} user 
     * @param {string} base64 
     */
    static async create(user, base64) {
        const imageLoader = new ImageLoader({
            userId: user.data._id,
            base64: base64,
            status: -1
        });
        

        if (!imageLoader.validateImage()) {
            return null;
        }

        return imageLoader;
    }

    /**
     * Конструктор класса
     * @param {any} value 
     */
    constructor(value) {
        this.data = value;
    }

    /**
     * Изображение, которое необходимо загрузить
     */
    get image() { return this.data.base64; }

    /**
     * ID человека загружающего иконку
     */
    get userId() { return this.data.userId; }
    set userId(v) { this.data.userId = v; } 

    /**
     * Статус загрузки
     * @type {number}
     */
    get status() { return this.data.status; }
    set status(v) { this.data.status = v; }

    /**
     * Результат загрузки
     */
    get response() { return this.data.response; }
    set response(v) { this.data.response = v; }

    validateImage() {
        const sizeOf = require('image-size');

        var img = Buffer.from(this.image.split(';base64,').pop(), 'base64');
        var dimensions = sizeOf.imageSize(img);

        if (dimensions.height != 512 || dimensions.width != 512) {
            return false;
        }

        return true;
    }

    /**
     * Загрузить изображение
     */
    async load() {
        return new Promise((callback) => {
            setTimeout(() => {
                this.status = 0;
                this.response = "Превышено ожидание ответа от сервера";

                if (!!client) {
                    client.destroy();
                }

                callback();
            }, 30000);

            var client = new (require('net')).Socket();
            
            client.connect(8005, '78.36.200.237', () => {
                client.setEncoding('utf8');    
                client.write(this.image.toString('base64'));
            });
    
            client.on('data', async (data) => {
                const split = data.toString().split('~');

                this.status = parseInt(split[0]);
                this.response = split[1];

                const saveObj = JSON.parse(JSON.stringify(this)).data;
                delete(saveObj.userId);

                const user = await this.getUser();
                if (user) {
                    console.log('push to user')
                    user.images.unshift(saveObj);
                    user.save();
                }

                callback();
            });
    
            client.on('close', () => {
                callback();
            });

            client.on('error', () => {
                callback();
                this.status = 0;
                this.response = 'Ошибка сервера';
            });
        });
    }

    /**
     * Получить привязанного пользователя
     * @returns {Promise<User|null>}
     */
    async getUser() {
        const result = await User.findByObjectId(new ObjectId(this.userId));
        return result;
    }
}

module.exports = ImageLoader;