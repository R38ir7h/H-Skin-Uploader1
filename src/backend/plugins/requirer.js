const { strictEqual } = require('assert');
const { parse, resolve } = require('path');
const { statSync, readdirSync } = require('fs');

/**
 * Вывести пути от дирректории к файлам.
 * @param {string} directory Начальная дирректория.
 * @param {boolean} recursively Проводить ли пути рекурсивно.
 * @param {number} depth Максимальная глубина анализа.
 * @returns {string[]} Массив полный путей к файлам начиная от анализируемой дирректории.
 */
function pave(directory, recursively, depth) {
    strictEqual(typeof directory, 'string');
    strictEqual(typeof recursively, 'boolean');
    strictEqual(Number.isSafeInteger(depth), true);

    if(depth <= 0)
        return [];

    /** Итоговый результат . */
    let result = [];

    /** Массив названий файлов в текущей дирректории. */
    const files = readdirSync(directory);

    // Проходимся по всем файлам.
    // Наша задача собрать рекурсивно или нет полные пути.
    for(const value of files) {
        /** Целевой путь к файлу. */
        const purpose = resolve(directory, value);

        /** Статистика файла. */
        const stat = statSync(purpose);

        // Если не смогли получить статистику пропускаем иттерацию.
        if(!stat)
            continue;

        if(
            recursively // Если разрешен рекурсивный парсинг.
            && stat.isDirectory() // Если цель это дирректория.
        ) {
            // Переназначаем итоговый результат.
            result = result.concat(pave(purpose, recursively, depth - 1));

            continue;
        } else if(!stat.isDirectory()) {
            result.push(purpose);
        }
    }

    return result;
}

/**
 * Выполнить парсинг и запрос всех JS,JSON файлов в директории.
 * @param {string} directory Путь директории.
 * @param {object} params
 * @param {string[]} [params.excepted] Список исключенных паттернов названий для подключения (например index будет релевантен index.js).
 * @param {boolean} [params.recursively] Проводить ли рекурсивный анализ.
 * @param {number} [params.depth] Глубина рекурсивного аналза.
 * @returns Совмещенный результат возвращаемых значения подключенных файлов.
 */
module.exports = (directory, params = {}) => {
    strictEqual(typeof directory, 'string');
    strictEqual(typeof params, 'object');

    let excepted = ['index.js'];
    let recursively = false;
    let depth = 2;

    // Если были получены параметры.
    // Нужно учитывать что может быть передана пустота.
    if(params) {
        // Проходимся по полученным параметрам.
        // Наша задача их проверить и заменить ими значения по умолчанию.
        for(const [eKey, eValue] of Object.entries(params)) {
            if(
                eKey === 'excepted'
                && typeof eValue === 'object'
            ) {
                strictEqual(Array.isArray(eValue), true);

                for(const iValue of eValue)
                    strictEqual(typeof iValue, 'string');

                excepted = eValue;
            } else if(
                eKey === 'recursively'
                && typeof eValue === 'boolean'
            ) {
                recursively = eValue;
            } else if(
                eKey === 'depth'
                && typeof eValue === 'number'
            ) {
                strictEqual(Number.isSafeInteger(eValue), true);

                depth = eValue;
            }
        }
    }

    /** Полные пути файлов для подключения. */
    const paths = pave(directory, recursively, depth);

    /** Отфильтрованный результат. */
    const filtered = paths
        .filter(external => excepted.findIndex(internal => external.includes(internal)) === -1);

    /** Итоговый результат. */
    const result = {};

    // Проходимся по отфильтрованным данным.
    // Наша задача получить данные и дополнить подготавливаемое значение.
    for(const value of filtered) {
        const { name, ext } = parse(value);

        // Если файл не проходит фильтрацию по расширению.
        if(!['.js', '.json'].includes(ext))
            continue;

        // eslint-disable-next-line import/no-dynamic-require
        result[name] = require(resolve(directory, value));
    }

    return result;
};
