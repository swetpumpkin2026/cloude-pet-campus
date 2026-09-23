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

   //初始坐标（改成你查到的图书馆坐标）
   let currentLat = 30.5814;
   let currentLng = 103.9892;

   //猫咪的初始状态与状态持续时间
   let catState ='walking';//可选：sleeping，walking,zooming
   let stateTimer = 0;

   //每1秒更新一次位置（之前是三秒，一秒更平滑）
   const interval = setInterval(()=>{
    stateTimer--;
    //如果当前状态结束，随机决定下一个状态
    if (stateTimer <= 0){
        const hour =  new Date().getHours();//获取dangqianshijan（0-23）
        let probSleep, probWalk ,probZoom;//分别代表睡觉，散步，狂奔的概率

        //设定猫咪的作息表
        if (hour >= 23|| hour <6){
            //深夜（23点-凌晨六点）：猫咪大多在睡觉
            probSleep = 0.9;probWalk=0.1;probZoom = 0;
        }else if (hour >= 6 && hour <9){
            //清晨（6点-9点）：猫咪最兴奋的时间
            probSleep = 0.1; probWalk=0.6;probZoom =0.1;
        }else if (hour >=9 && hour < 18){
            //白天（9点-18点）：大多时候是懒洋洋的
            probSleep = 0.5 ; probWalk=0.4;probZoom=0.1;
        }else{
            //傍晚（18点-23点）:又一个活跃期
            probSleep = 0.2;probWalk=0.5;probZoom=0.3;
        }

        //根据概率决定随机进入哪个状态
        const rand  =Math.random();
        if(rand < probSleep){
            catState = 'sleeping';//睡觉
            stateTimer =Math.floor(Math.random()*15 )+15;//睡15-30秒
        }else if (rand < probSleep + probWalk){
            carState = 'walking';//散步
            stateTimer = Math.floor(Math.random()*10)+5;//走5-15秒
}else{
catState = 'zooming';//狂奔
stateTimer = Math.floor(Math.random()*3)+2;//跑2-5秒
}
console.log(`[${hour}点]猫咪状态切换为：${catState},持续${stateTimer}秒`);
    }
        
    //=========================
    //2.状态执行：根据当前状态决定移动的步长
    //=========================
    let stepSize = 0; 
    if (catState ==='slepping'){
        stepSize = 0.000005//散步：每秒0.5米
    }else if (catState === 'zooming'){
        stepSize = 0.00003; //狂奔 ：每秒3米
    }

    //如果步长大于0，就加上一个随机方向的微小偏移
    //(Math.random() - 0.5 )会生成正负随机数，实现随机游走
    if (stepSize >0){
        currentLat = currentLat + (Math.random()- 0.5)*stepSize;
        currentLng = currentLng + (Math.random()- 0.5)*stepSize;
    }

    //=================
    //3.数据推送：把最新的坐标发送给前端
    //=================
        socket.broadcast.emit('catLocation',{lat:currentLat, lng:currentLng,name:'大橘'});
        
        socket.emit('catLocation',{lat:currentLat,lng:currentLng,name:'大橘'});
    },1000);//频率改为每秒1次

//当客户端断开连接时，清除定时器
socket.on('disconnet',()=>{
    clearInterval(interval);
    console.log('客户端已断开连接');
});
});

//===============
//启动服务器
//===============
const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`WebSocket 服务器运行在http://localhost:${PORT}`);
});