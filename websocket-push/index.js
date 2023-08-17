const http = require('node:http');
const WebSocketServer = require('websocket').server;

let connections = [];

// creating a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)

const httpServer = http.createServer();

// passing the http server object to the WebSocketServer library to do all the job, this class will override the req/res
const websocket = new WebSocketServer({httpServer});


// listening on the TCP socket
httpServer.listen(8080, ()=>console.log("Server is listening at ws://localhost:8080"));

// when a legit websocket request comes listen to it and get the connnection.. once we get the connection that is it.
websocket.on("request", request=>{
    const connection = request.accept(null, request.origin);
    connection.on('message', message=>{
        // someone just sent a message, telling everybody

        connections.forEach(c=> c.send(`User ${connection.socket.remotePort} says: ${message.utf8Data}`))
    });

    connections.push(connection);

    // someone just connected, tell everybody

    connections.forEach(c=>c.send(`User ${connection.socket.remotPort} just connected`));
    console.log(connections.length);
})

