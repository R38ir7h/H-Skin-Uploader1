module.exports = {
  webServer: {
    port: 2020,
  },
  base: {
    /** Теперь используется БД - MongoDB */ 
    enable: true,

    host: 'localhost',
    port: '27017',

    source: 'BotStore',
    base: 'BotStore',

    login: 'Hougan', 
    pass: '',
  },
}