// Глобально регистрируем алиасы.
require('module-alias/register');

(async () => {
    // Создаём подключение к базе данных
    await require('@backend/plugins/input');

    global.app = {};
    global.logger = require('@backend/plugins/logger');

    /**
     * Заставляем подключиться к базе данных, и только затем - подключаем оставшиеся скрипты
     */
    await require('@backend/plugins/database')(() => {
        // Подключаем все скрипты
        require('@backend/index')();
    });
})();
