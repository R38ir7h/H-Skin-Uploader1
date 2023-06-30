module.exports = async () => {
  if (!app.socketServer) return;

  app.socketServer.registerMiddlewareInc((packet, socket, before) => {
    if (!before) return packet;

    const originalArgs = packet.args;
    packet.args = [socket];

    if (originalArgs.length > 1) {
      // If default args.length > 1, i will pack them into the object
      logger.error('Wrong packet args, trying solve trouble...');
      packet.args.push({ ...originalArgs });
    } else {
      packet.args.push(originalArgs[0]);
    }

    packet.args.push(socket.handshake.session.passport ? socket.handshake.session.passport : null); 
    return packet;
  });
};
