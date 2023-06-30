class LoaderCheck {
    static async checkLoader() {
        return new Promise((callback) => {
            setTimeout(() => {
                callback(false);
            }, 1500);

            var client = new (require('net')).Socket();
            
            client.connect(8005, '78.36.200.237', () => {
                client.setEncoding('utf8');    
                client.write('check');
            });
    
            client.on('data', async (data) => {
                if (data.toString() == 'ok') {
                    callback(true);
                } else {
                    callback(false);
                }
            });
    
            client.on('close', () => {
                callback(false);
            });

            client.on('error', () => {
                callback(false);
            });
        });
    }
}

module.exports = LoaderCheck;