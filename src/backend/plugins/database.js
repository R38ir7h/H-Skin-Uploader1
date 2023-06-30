const MongoDB = require('@root/src/backend/main/classes/MongoDB');
const { indexes } = require('@backend/main/data/mongodb');

const { base } = require('@root/config'); 

module.exports = (/** @type {VoidFunction} */ callback) => {
    if (!base.enable) {
        logger.error('Подключение к базе данных не требуется!');
        callback();
        return;
    }

    logger.debug('Ожидается подключение к базе данных...');
    if(process.env.NODE_ENV === 'production') {
        MongoDB
            .connect()
            .then(() => { 
                logger.info('Подключение к базе данных успешно!');
                callback();
            }) 
            .catch(error => logger.error(error));
    } else {
        MongoDB
            .connect()
            .then(() => {
                logger.info('Подключение к базе данных успешно!');
                callback();
            })
            .catch(error => logger.error(error));
    }
};
