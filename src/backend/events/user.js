const User = require('../main/classes/User');

module.exports = async () => {
  if (!app.socketServer){ 
    logger.error('Не подключен сокет сервер!');
    return;
  }

  app.socketServer.on('user get', async (/** @type {SocketIO.Socket} */ socket,  /** @type {any} */ data, /** @type {Express.Session} */  session) => {
    if (!session || !session.user) {
      return false;
    }

    const { user: origUser } = session;

    const user = await User.find(origUser);
    if (!user) {
      return null;
    }
    
    const result = await user.getInfo();
    return result;
  });
};