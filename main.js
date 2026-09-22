//1.初始化地图，设置中心点为你学校的大致位置和缩放级别
//成都信息工程大学的经纬度大约是（30.58,103.98）
const map =L.map('map').setView([30.58,103.98], 16);

//2.加载 OpenStreetMap 的地图瓦片
L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',{
    subdomains:'1234',
    maxZoom:19,
    attribution:'© 高德地图'
}).addTo(map);

//3.创建一只"猫"的标记
//这里先用简单的🟠橙色圆形代替，后面会换成真正的猫咪图标
const catIcon = L.divIcon({
    className: 'custom-cat-icon',
    html:'<div style="background-color:orange;width:20px; height:20px; border-radius: 50%; border: 2px solid white;"></div>',
iconSize: [20,20]
});

//4.在地图上添加这只猫，并设置其初始位置
const catMarker = L.marker([30.58142,103.9893],{icon:catIcon}).addTo(map);

//5让这只猫每隔3秒移动到一个新的随机位置
function moveCat(){
    //在当前经度和维度上加上一个很小的随机偏移量
    const lat = catMarker.getLatLng().lat + (Math.random()-0.5)*0.0001;
const lng = catMarker.getLatLng().lng + (Math.random()-0.5)*0.0001;
//更新标记位置
catMarker.setLatLng([lat,lng]);
}
//每3秒（3000毫秒）执行一次moveCat 函数
setInterval(moveCat, 3000);
//6. 绑定随机事件，点击猫咪标记时弹出提示
catMarker.bindPopup("<b>大橘</b><br>今天在图书馆门口晒太阳。").openPopup();