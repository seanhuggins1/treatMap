
class WebSocket {
      constructor(app) {
            this.ws = require('ws');
            this.wss = new this.ws.Server({
                  server: app.listen(8080),
            });
            this.clients = new Set();

            console.log(`Web Socket listening on port: 8080`);
            //setup new connections
            this.wss.on('connection', (ws) => this.onSocketConnect(ws));
            
      }
      broadcast(message){
            for(let client of this.clients){
                  client.send(message);
            }
      }
      // broadcast(message){
      //       for (let client of this.clients) {
      //             console.log('broadcasting');
      //             client.send(message);
      //       }
      // }

      onSocketConnect(ws){
            this.clients.add(ws);
            console.log('new connection');
            console.log(this.clients.size);
            ws.on('message', function incoming(message) {
                  console.log('received: %s', message);
            });
            ws.on('close', () => {
                  console.log('closing connection');
                  this.clients.delete(ws);
            });
      }


}

module.exports = WebSocket;