//1.初始化地图，设置中心点为你学校的大致位置和缩放级别




//成都信息工程大学的经纬度大约是（30.58,103.99）
const map =L.map('map',{maxZoom:22}).setView([30.58142,103,9893],16);

//2.加载 OpenStreetMap 的地图瓦片
L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',{
    maxZoom:22,//允许前端继续放大（虽然会变得有点模糊，但不会白屏）
    subdomains:'1234',
    maxNativeZoom:18,//实际真实最大瓦片级别（超过18服务器就不给了）
    attribution:'© 高德地图'
}).addTo(map);

//3.创建一只"猫"的标记
//这里先用简单的🟠橙色圆形代替，后面会换成真正的猫咪图标


//4.在地图上添加这只猫，并设置其初始位置
const catIcon = L.divIcon({
    className:'custom-cat-icon',
    html:'<div style="background-color: orange; width:20px;height:20px;border-radius:50%;border:2px solid white;"></div>',
iconSize:[20,20]
});
const catMarker = L.marker([30.58142,103.9893],{icon:catIcon}).addTo(map);

//5让这只猫每隔3秒移动到一个新的随机位置(feiqi)
//6. 绑定随机事件，点击猫咪标记时弹出提示
catMarker.bindPopup("<b>大橘</b><br>正在实时更新位置……").openPopup();

//*1.连接到我们启动的 WebSocket 服务器
const socket = io('http://localhost:3000');

//*2.创建猫咪标记





//3*监听服务器发来的'catLocation'事件
socket.on('catLocation',(data) =>{
    console.log('收到新位置:',data);
    //平滑地更新标记位置
    catMarker.setLatLng([data.lat,data.lng]);

//可选：顺便更新一下弹出框里的内容
catMarker.getPopup().setContent(`<b>${data.name}</b><br>实时位置已更新`);
});



//白/黑夜
function updateMapLighting(){
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6){
        //夜间：给地图加一层半透明的黑膜
        document.getElementById('map').style.filter ='brightness(0.6)';
    }else{
        //白天：恢复正常亮度
        document.getElementById('map').style.filter = 'brightness(1)';

    }
}
updateMapLighting();//页面加载时先执行一次
setInterval(updateMapLighting,60000);//每分钟检查一次
