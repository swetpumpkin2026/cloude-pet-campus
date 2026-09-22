const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{
    origin:"*",//开发阶段允许所有来源，生产环境请务必修改为你的前端域名
    methods:["GET","POST"]
}
})

//当前所有客户端连接时
io.on('connection',(socket) =>{
    console.log('一个客户端已连接:',socket.id);

    //模拟后端每隔3秒推送一次新的位置数据
    const interval = setInterval(()=>{
        //在校园范围附近随机生成坐标
        const lat 30.58 + (Math.random() - 0.5)*0.005;
        const lng 103.98 + (Math.random() - 0.5)*0.005;
        //向所有连接的客户端广播'catLocation'事件
        socket.broadcast.emit('catLocation'{lat, lng,name:'大橘'});
        //也发给自己，方便测试
        socket.emit('catLocation',{lat,lng,name:'大橘'});
    },3000);

//当客户端断开连接时，清除定时器
socket.on('disconnet',()=>{
    clearInterval(interval);
    console.log('客户端已断开连接');
});
});

const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`WebSocket 服务器运行在http://localhost:${PORT}`);
});