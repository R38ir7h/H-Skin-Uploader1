const { ObjectId } = require('mongodb');
const { strictEqual, notStrictEqual } = require('assert');

/**
 * Выполнить проверку соответствия объекта шаблону.
 * @param {*} purpose Целевое значение.
 * @param {*} pattern Шаблон.
 * @param {number} depth Глубина проверки.
 * @param {boolean} seal Запечатан ли шаблон.
 */
function patternEqual(purpose, pattern, depth, seal) {
    strictEqual(typeof purpose, 'object');
    strictEqual(typeof pattern, 'object');
    strictEqual(Number.isSafeInteger(depth), true);
    strictEqual(typeof seal, 'boolean');

    // Если достигли макисмально допустимой глубины исключаем выполнение.
    if(depth <= 0)
        throw new Error('Достигнуто ограничение глубины проверки данных.');

    // Проверяем наличие инородных ключей у целевого значения.
    Object
        .keys(purpose)
        .forEach(value => strictEqual(!seal || Object.prototype.hasOwnProperty.call(pattern, value), true));

    // Проверяем целостность и подлиность данных по шаблону.
    Object
        .entries(pattern)
        .forEach(([key, value]) => {
            // Целевое значение должно иметь ключ шаблона.
            strictEqual(Object.prototype.hasOwnProperty.call(purpose, key), true);

            // Тип значения шаблона должен совпадать по ключу у целевого значения.
            strictEqual(typeof value, typeof purpose[key]);

            if(
                typeof value !== 'object' // Если тип значения не объект.
                || Array.isArray(value) // Это значение это массив.
                || !Object.keys(purpose[key]).length // Если у ожидаемого целевого значения нет ключей.
            ) {
                return;
            }

            // Выполняем проверку соответствия объекта шаблону.
            patternEqual(purpose[key], value, depth - 1, seal);
        });
}

module.exports = {
    /**
     * Проверить чтобы значение было строкой.
     * @param {string[]} args
     */
    string(...args) {
        args.forEach(value => strictEqual(typeof value, 'string'));
    },

    /**
     * Проверить чтобы значение было числом.
     * @param {number[]} args
     */
    number(...args) {
        args.forEach(value => strictEqual(typeof value, 'number'));
    },

    /**
     * Проверить чтобы значение было булевым.
     * @param {boolean[]} args
     */
    boolean(...args) {
        args.forEach(value => strictEqual(typeof value, 'boolean'));
    },

    /**
     * Проверить чтобы значение было функцией.
     * @param {function[]} args
     */
    function(...args) {
        args.forEach(value => strictEqual(typeof value, 'function'));
    },

    /** Проверить чтобы значение было потомком класса объекта. */
    Object(...args) {
        args.forEach(value => strictEqual(value instanceof Object, true));
    },

    /**
     * Проверить чтобы значение было потомком класса массива.
     * @param {any[][]} args
     */
    Array(...args) {
        args.forEach(value => strictEqual(value instanceof Array, true));
    },

    /**
     * Проверить чтобы значение было безопасным целочисленным числом.
     * @param {number[]} args
     */
    Integer(...args) {
        args.forEach(value => strictEqual(Number.isSafeInteger(value), true));
    },

    /**
     * Проверить чтобы значение соответствовало шаблону вектора.
     * @param {any[]} args
     */
    Vector3(...args) {
        /** Шаблон. */
        const pattern = new mp.Vector3(0, 0, 0);

        args.forEach(value => patternEqual(value, pattern, 1, true));
    },

    /**
     * Проверить чтобы значение было ObjectId.
     * @param {ObjectId[]} args
     */
    ObjectId(...args) {
        args.forEach(value => strictEqual(ObjectId.isValid(value), true));
    },

    // ============================

    /**
     * Проверить чтобы значение было строкой или булевым.
     * @param {(string|boolean)[]} args
     */
    stringOrBoolean(...args) {
        args.forEach(value => strictEqual(['string', 'boolean'].includes(typeof value), true));
    },

    // ============================

    /**
     * Проверить чтобы значение было строкой или числом.
     * @param {(string|number)[]} args
     */
    stringOrNumber(...args) {
        args.forEach(value => strictEqual(['string', 'number'].includes(typeof value), true));
    },

    // ============================

    /**
     * Проверить чтобы значение было строкой или неопределенным.
     * @param {string[]} args
     */
    stringOrUndefined(...args) {
        args.forEach(value => strictEqual(['string', 'undefined'].includes(typeof value), true));
    },

    /**
     * Проверить чтобы значение было числом или неопределенным.
     * @param {number[]} args
     */
    numberOrUndefined(...args) {
        args.forEach(value => strictEqual(['number', 'undefined'].includes(typeof value), true));
    },

    /**
     * Проверить чтобы значение было булевым или неопределенным.
     * @param {boolean[]} args
     */
    booleanOrUndefined(...args) {
        args.forEach(value => strictEqual(['boolean', 'undefined'].includes(typeof value), true));
    },

    /** Проверить чтобы значение было объектом или неопределенным. */
    objectOrUndefined(...args) {
        args.forEach(value => strictEqual(['object', 'undefined'].includes(typeof value), true));
    },

    /**
     * Проверить чтобы значение было функцией или неопределенным.
     * @param {function[]} args
     */
    functionOrUndefined(...args) {
        args.forEach(value => strictEqual(['function', 'undefined'].includes(typeof value), true));
    },

    /**
     * Проверить чтобы значение было массивом или неопределенным.
     * @param {any[][]} args
     */
    ArrayOrUndefined(...args) {
        args.forEach(value => strictEqual(Array.isArray(value) || value === undefined, true));
    },

    // ============================

    /**
     * Проверить чтобы значение было строкой или пустотой.
     * @param {string[]} args
     */
    stringOrNull(...args) {
        args.forEach(value => strictEqual(typeof value === 'string' || value === null, true));
    },

    /**
     * Проверить чтобы значение было числом или пустотой.
     * @param {number[]} args
     */
    numberOrNull(...args) {
        args.forEach(value => strictEqual(typeof value === 'number' || value === null, true));
    },

    /** Проверить чтобы значение было потомком класса объекта или пустотой. */
    ObjectOrNull(...args) {
        args.forEach(value => strictEqual(value instanceof Object || value === null, true));
    },

    /**
     * Проверить чтобы значение было ObjectId или пустотой.
     * @param {ObjectId[]} args
     */
    ObjectIdOrNull(...args) {
        args.forEach(value => strictEqual(value === null || ObjectId.isValid(value.toString()), true));
    },

    // ============================

    /**
     * Проверить чтобы в объекте был ключ.
     * @param {*} value Значение.
     * @param {string} key Ключ.
     */
    hasOwnProperty(value, key) {
        strictEqual(Object.prototype.hasOwnProperty.call(value, key), true);
    },

    /**
     * Проверить чтобы значение было экземпляром класса.
     * @param {*} value Значение.
     * @param {*} instance Экземпляр класса.
     */
    instanceEqual(value, instance, nullable = false) {
        /** Является ли значение экземляром класса. */
        const equaled = value instanceof instance;

        strictEqual(nullable ? (equaled || value === null) : equaled, true);
    },

    /**
     * Проверить чтобы объект соответствовал шаблону.
     * @param {*} purpose Целевое значение.
     * @param {*} pattern Шаблон.
     * @param {number} depth Глубина проверки.
     * @param {boolean} seal Запечатан ли шаблон.
     */
    patternEqual(purpose, pattern, depth = 1, seal = true) {
        patternEqual(purpose, pattern, depth, seal);
    },

    // =================================================

    /**
     * Проверить строгое равенство между фактическими и ожидаемыми параметрами, определяемыми с помощью сравнения.
     *
     * https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message
     * @param {*} actual Текущее значение.
     * @param {*} expected Ожидаемое значение.
     */
    strictEqual(actual, expected) {
        strictEqual(actual, expected);
    },

    /**
     * Проверить строгое неравенство между фактическими и ожидаемыми параметрами, определяемыми сравнением.
     *
     * https://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message
     * @param {*} actual Текущее значение.
     * @param {*} expected Ожидаемое значение.
     */
    notStrictEqual(actual, expected) {
        notStrictEqual(actual, expected);
    },
};
