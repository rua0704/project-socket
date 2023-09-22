using SocketIOClient;
 
var options = new SocketIOOptions{};

var client = new SocketIOClient.SocketIO("http://127.0.0.1:3000/");
await client.ConnectAsync();