const serverLine = require('serverline');

module.exports = (async () => {
    process.stdout.write("\x1Bc")
    console.log(Array(process.stdout.rows + 1).join('\n'));

    serverLine.init();
    serverLine.setCompletion(['status']);

    serverLine.setPrompt('> ');

    serverLine.on('line', (line) => {
        switch (line) {
          case "clear": {
            process.stdout.write("\x1Bc")
            console.log(Array(process.stdout.rows + 1).join('\n'));
            break;
          }
          default: {
            logger.error('Unknown command!');
          }
        }
      })
})();
