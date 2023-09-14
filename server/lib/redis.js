const { createClient } = require("redis");
const client = createClient();

class Redis {
    constructor() {
        (async () => {
            await client.connect();
            await client.flushAll();
        })();
    }

    async getSocketId(UserPk) {
        const socketId = await client.get(UserPk);
        return socketId;
    };
    
    async setSocketId(UserPk, socketId) {
        await client.set(UserPk, socketId);
    }
  
    /*
        MySQL에서 동일 값의 경우엔 업데이트하지 않는다고 인식한다. 아래 링크 참고.
        https://stackoverflow.com/questions/35364214/does-mysql-overwrite-a-column-of-same-value-on-update
    */
}

module.exports = new Redis();