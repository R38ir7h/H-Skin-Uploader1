const { base } = require('@root/config');

const moment = require('moment');
const { random } = require('lodash');
const { Db, MongoClient } = require('mongodb');

const Validator = require('@backend/systems/Validator');
const { indexes } = require('@backend/main/data/mongodb');

/** Унифицированный идентификатор подключения. */
const uri = `mongodb://${base.login}:${base.pass}@${base.host}:${base.port}/${base.source}`;

/** Параметры подключения. */
const options = {
    minSize: 20,
    poolSize: 100,
    // reconnectTries: 10000,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    // reconnectInterval: 2000,
    connectTimeoutMS: 30000,
    useUnifiedTopology: true,
};

/**
 * Экземпляр соеденения с MongoDB.
 * @type {Db}
 */
let db;

/** Класс предназначен для управления MongoDB. */
class MongoDB {
    /**
     * Существует ли в данных индексы с таким ключем.
     * @param {string} value Ключ.
     */
    static issetIndex(value) {
        Validator.string(value);

        return indexes.hasOwnProperty(value);
    }

    /**
     * Получить настройки индексов.
     * @param {string} value ключ.
     */
    static getIndex(value) {
        Validator.string(value);

        // Должны существовать индексы с таким ключем.
        Validator.strictEqual(this.issetIndex(value), true);

        return indexes[value];
    }

    /** Выполнить подключение к базе данных. */
    static async connect() {
        const client = new MongoClient(uri, options);

        // Установленный клиент должен быть соответсвующим экземпляром класса.
        Validator.instanceEqual(client, MongoClient);

        // client.on('connectionPoolCreated', console.dir);
        // client.on('connectionPoolClosed', console.dir);
        // client.on('connectionCreated', console.dir);
        // client.on('connectionReady', console.dir);
        // client.on('connectionClosed', console.dir);
        // client.on('connectionCheckOutStarted', console.dir);
        // client.on('connectionCheckOutFailed', console.dir);
        // client.on('connectionCheckedOut', console.dir);
        // client.on('connectionCheckedIn', console.dir);
        // client.on('connectionPoolCleared', console.dir);

        // Выполняем подключение клиента.
        await client.connect();

        // Устанавливаем соеденение с базой данных.
        db = client.db(base.base);

        // Установленное соеденение должно быть соответсвующим экземпляром класса.
        Validator.instanceEqual(db, Db);

        // db.on('close', console.dir);
        // db.on('error', console.dir);
        // db.on('fullsetup', console.dir);
        // db.on('parseError', console.dir);
        // db.on('reconnect', console.dir);
        // db.on('timeout', console.dir);

        return db;
    }

    /**
     * @param {string} collection Название коллекции.
     */
    constructor(collection) {
        Validator.string(collection);

        // console.log(collection, reviser);

        /** Название коллекции. */
        this.collection = collection;

        Object.freeze(this);
    }

    /**
     * Выполнить агрегацию к коллекции.
     * @param {any[]} pipeline Данные запроса.
     * @param {*} options Параметры запроса.
     */
    async aggregate(pipeline, options = {}) {
        const { collection } = this;

        /** Ответ базы данных. */
        const response = await db
            .collection(collection)
            .aggregate(pipeline, options)
            .toArray();

        // Если пустой ответ прерываем выполнение.
        if(!response.length)
            return response;

        return response.some(value => !!value)
            ? db
                .collection(collection)
                .aggregate(pipeline, options)
                .toArray()
            : response;
    }

    /** Выполнить подсчет документов в коллекции. */
    countDocuments(value) {
        return db
            .collection(this.collection)
            .countDocuments(value, {});
    }

    /** Создать индексы по спецификациям. */
    createIndexes(value) {
        return db
            .collection(this.collection)
            .createIndexes(value);
    }

    /** 
     * Удалить один документ из коллекции.
     */
    deleteOne(value) {
        return db
            .collection(this.collection)
            .deleteOne(value);
    }

    /** Удалить из коллекции все документы, соответствующие фильтру. */
    deleteMany(value) {
        return db
            .collection(this.collection)
            .deleteMany(value);
    }

    /** Сбросить все индексы коллекции. */
    dropIndexes() {
        return db
            .collection(this.collection)
            .dropIndexes();
    }

    async findAll(filter) {
        const { collection } = this;

        const response = await db
            .collection(collection)
            .find(filter)
            .toArray();

        return response;
    }

    /** Найти один документ, удовлетворяющий заданным критериям запроса в коллекции или представлении. */
    async findOne(filter, options = {}) {
        const { collection } = this;

        /** Ответ базы данных. */
        const response = await db
            .collection(collection)
            .findOne(filter, options);

        return response;
    }

    /** Вставить документ в коллекцию. */
    insertOne(value) {
        const { collection } = this;

        /** Временная метка. */
        const timestamp = +moment();

        return db
            .collection(collection)
            .insertOne(
                {
                    _created: timestamp,
                    _updated: timestamp,
                    ...value,
                },
            );
    }

    /** Вставить документы в коллекцию. */
    insertMany(eValue) {
        Validator.Array(eValue);

        const { collection } = this;

        /** Итоговый результат. */
        const result = eValue.map(iValue => {
            /** Временная метка. */
            const timestamp = +moment().add(random(-10000, 10000), 'milliseconds');

            return {
                _created: timestamp,
                _updated: timestamp,
                ...iValue,
            };
        });

        return db
            .collection(collection)
            .insertMany(result);
    }

    /** Обновить один документ в коллекции на основе фильтра. */
    updateOne(filter, query) {
        /** Временная метка. */
        const timestamp = +moment();

        // Если данные запроса это массив из запроса агрегации.
        if(Array.isArray(query)) {
            // Добавляем к данным запроса обновление временной метки обновления документа.
            query.push({ $set: { _updated: timestamp } });
        } else if(query instanceof Object) {
            // Дополняем операцию установки данных временной меткой обновления документа.
            // Если нет операции установки данных она будет создана автоматически.
            query.$set = {
                ...query.$set,
                _updated: timestamp,
            };
        }

        return db
            .collection(this.collection)
            .updateOne(filter, query);
    }
}

Object.freeze(MongoDB);

module.exports = MongoDB;
