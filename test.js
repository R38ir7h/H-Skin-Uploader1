(async () => {
    var net = require('net');

    var client = new net.Socket();
    
    var fs = require('fs');
    var file = fs.readFileSync('./PRM - PULT.png');
    var file2 = fs.readFileSync('./CARD BLUE.png');
    console.log(file);
    
    client.connect(8005, '127.0.0.1', () => {
        console.log('connected');
        client.setEncoding('utf8');
        client.write(file.toString('base64'));
    })
    
    
    client.on('data', (data) => {
        console.log('< ' + data);
    });
    
    client.on('close', () => {
        console.log('Connection closed');
    })
})();