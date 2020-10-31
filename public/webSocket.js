//setup a websocket

let url = new URL('wss://localhost:8888')

let socket = new WebSocket(url);

//handle web socket events
export function send(text){
      socket.send(text);
}


//connection is established
socket.onopen = function (e) {
      console.log("[open] Connection established");
      console.log("Sending to server");
      socket.send("My name is John");
}

//data is recieved from the server
socket.onmessage = function (event) {
      console.log(`[message] Data received from server: ${event.data}`);
}

//conection is closed
socket.onclose = function (event) {
      if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died');
      }
};

//websocket error
socket.onerror = function (error) {
      alert(`[error] ${error.message}`);
};