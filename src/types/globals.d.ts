// -------------------------------------------------------------------------
// Расширение существующих пространств имен и интерфейсов.
// -------------------------------------------------------------------------

declare namespace NodeJS {
    interface Global {
        app: App,
        logger: import('winston').Logger,
    }
}

// -------------------------------------------------------------------------
// Новые основоположные типы
// -------------------------------------------------------------------------

interface App {
    webServer?: import('http').Server;
    express?: import('express').Express;
    socketServer?: import('socket.io').Server;
}

interface Window {
    router: any,
    webApi: any,
}

// -------------------------------------------------------------------------
// Объявление констант
// -------------------------------------------------------------------------
declare const app: App;
declare const logger: import('winston').Logger;

(<any>window).router = import('vue-router');