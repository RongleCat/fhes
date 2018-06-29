$(function (){
    layer.photos({
        photos: '.power-left',
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });
    window.onload = e => {
        var map = new BMap.Map("map");
        var point = new BMap.Point(121.660293, 29.889404);
        map.centerAndZoom(point, 17);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }
})