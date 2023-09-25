using SocketIOClient;
 
var options = new SocketIOOptions{};

var client = new SocketIOClient.SocketIO("http://127.0.0.1:3000/");
await client.ConnectAsync();
Console.Write("내 UserPk 입력: ");
var UserPK =  Console.ReadLine();
string mySocketId = string.Empty;
await client.EmitAsync("login", UserPK);

var cmd = string.Empty;
string roomID = string.Empty;

client.On("invite", socketID => {
    Console.WriteLine(socketID + "에게 초대가 왔습니다.");
    roomID = socketID.GetValue<String>();
    //수락 거절이 필요하지만 생략
});
client.On("yahoo", message => {
    Console.WriteLine(message);
});
client.On("connected", socketID => {
    Console.WriteLine("내 소켓 아이디: " + socketID);
    mySocketId = socketID.GetValue<String>();
    roomID = socketID.GetValue<String>();
});

while ((cmd = Console.ReadLine()) != "Q") {
    if(cmd == "invite") {
        Console.Write("초대할 UserPk 입력: ");
        roomID = mySocketId;
        var inviteUserPk = Console.ReadLine();
        await client.EmitAsync("inviteUser", inviteUserPk);
    }
    else if(cmd == "end") {
        await client.EmitAsync("endPlay", roomID);
    }
    else if(cmd == "accept") {
        await client.EmitAsync("startPlay",roomID);
    }
    else if(cmd == "rooms") {
        await client.EmitAsync("rooms");
    }
    else if(cmd == "message") {
        await client.EmitAsync("message", roomID, "야호");
    }
}

    
