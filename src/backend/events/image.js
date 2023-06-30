const ImageLoader = require('../main/classes/ImageLoader');
const LoaderCheck = require('../main/classes/LoaderCheck');
const User = require('../main/classes/User');

module.exports = async () => {
  if (!app.socketServer){ 
    logger.error('Не подключен сокет сервер!');
    return;
  }

  app.socketServer.on('server check', async (/** @type {SocketIO.Socket} */ socket,  /** @type {any} */ data, /** @type {Express.Session} */  session) => {
    return await LoaderCheck.checkLoader();
  });

  app.socketServer.on('image load', async (/** @type {SocketIO.Socket} */ socket,  /** @type {any} */ data, /** @type {Express.Session} */  session) => {
    if (!session || !session.user) {
      return false;
    }

    const { user: origUser } = session;

    const user = await User.find(origUser);
    if (!user) {
      return null;
    }
    
    const imageLoader = await ImageLoader.create(user, data.image);  
    if (!imageLoader) {
      return {
        status: 0,
        response: 'Неправильный размер изображения'
      }
    }
    await imageLoader.load();

    return {
      status: imageLoader.status,
      response: imageLoader.response
    };
  });
};