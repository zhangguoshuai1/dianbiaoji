$(function () {
    var map = new AMap.Map('container',{resizeEnable: true,zoom:10});
    var icon2 = new AMap.Icon({
        image: 'img/current_location.png',
        size: new AMap.Size(23, 37),
        imageSize: new AMap.Size(23, 37)
    });
    var icon1 = new AMap.Icon({
        image: 'img/bike.png',
        size: new AMap.Size(34, 38),
        imageSize: new AMap.Size(34, 38)
    });
    /*
    *
    * 定位
    * */
    var geolocation
        map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
       alert("定位成功")
    }
    //解析定位错误信息
    function onError(data) {
        alert("定位失败")
    }

    var markers=[]
    var shuzu=[
        {
            "biao_id":"001",
            "name":"三季度会撒娇苏",
            "site":"的撒旦是",
            "position":[109.52182,36.620514]
        },
        {
            "biao_id":"002",
            "name":"三季度会撒娇苏",
            "site":"的撒旦是",
            "position":[109.12182,36.620514]
        },
        {
            "biao_id":"003",
            "name":"三季度会撒娇苏",
            "site":"的撒旦是",
            "position":[109.92182,36.620514]
        }
    ]
    function ding_dian(position, biao_id,name,site) {
        var marker = new AMap.Marker({
            icon: icon1,
            position: position,//[109.52182,36.620514],
            offset: new AMap.Pixel(-12,-12),
            zIndex: 101,
            // title: number,
            map: map,
            animation:"AMAP_ANIMATION_DROP"
        });
        marker.biao_id=biao_id;
        marker.name=name;
        marker.site=site;
        marker.on('click', markerClick);
        markers.push(marker)
    }
    function ajax() {
        // $.ajax({
        //     url:"ajax.php",
        //     success:function(data)
        //     {
        //        if(data==1){
        //            alert("暂时还没有网点，赶快添加网点吧")
        //        }else if(data==0){
        //            $.each(shuzu,function (i, v) {
        //                ding_dian(v.position, v.biao_id,v.name,v.site)
        //            })
        //        }
        //     }
        // })
        $.each(shuzu,function (i, v) {
            ding_dian(v.position, v.biao_id,v.name,v.site)
        })
    }
    ajax()

    /*
    *
    * 点击marker发生的事件（删除/修改网点）
    * */
    function markerClick(e) {
        $(".remove-dian").addClass("add-chuxian")
        $("input[name='remove-name']").val(e.target.name)
        $("input[name='remove-number']").val(e.target.biao_id)
        $("input[name='remove-lat']").val(e.lnglat.lat)
        $("input[name='remove-lng']").val(e.lnglat.lng)
        $("input[name='remove-site']").val(e.target.site)
    }
    $(".revise").on("click",function () {
        var name=$("input[name='remove-name']").val()
        var biao_id=$("input[name='remove-number']").val()
        $.each(markers,function (i,v) {
            if(biao_id==v.biao_id){
                v.name=name;
                console.log(v)
            }
        })
        $(".remove-dian").removeClass("add-chuxian")
    })
    $(".remove").on("click",function () {
        var num
        var biao_id=$("input[name='remove-number']").val()
        $.each(markers,function (i,v) {
            if(biao_id==v.biao_id){
                num=i
            }
        })
        markers[num].setMap(null);
        $(".remove-dian").removeClass("add-chuxian")
    })
    /*
     *
     * 点击map发生的事件（添加网点）
     * */
    map.on( 'click',  function (e) {
        var lng= e.lnglat.getLng();
        var lat = e.lnglat.getLat();
        AMap.plugin('AMap.Geocoder',function(){
            var geocoder = new AMap.Geocoder();
            geocoder.getAddress([lng,lat],function(status,result){
                if(status=='complete'){
                    $("input[name='add-site']").val(result.regeocode.formattedAddress)
                }
            })
        });
        $("input[name='add-lng']").val(lng)
        $("input[name='add-lat']").val(lat)
        $(".add-dian").addClass("add-chuxian")
    });
    map.setFitView();

    $(".add").on("click",function () {
        var name=$("input[name='add-name']").val()
        var biao_id=$("input[name='add-number']").val()
        var site=$("input[name='add-site']").val()
        var lat=$("input[name='add-lat']").val()
        var lng=$("input[name='add-lng']").val()
        var position=new Array()
        position.lat=lat;
        position.lng=lng
        function createObj(){
            var obj = new Object(); //创建对象
            obj.name = name;
            obj.biao_id = biao_id;
            obj.site=site;
            obj.position=position;
            return obj
        }
        var obj=createObj()

        if(biao_id!=""&&name!=""){
            /*
             * ajax成功以后发生的事件
             *
             * */
            ding_dian([obj.position.lng,obj.position.lat], obj.biao_id,obj.name,obj.site)
            $(".add-dian").removeClass("add-chuxian")
            $(".add-dian input").val("")
        }else {
            if(name==""){
                alert("请输入网点名称")
                return false
            }
            if(biao_id==""){
                alert("请输入机柜的")
                return false
            }
        }

    })
    $(".guanbi").on("click",function () {
        $(".add-dian").removeClass("add-chuxian")
        $(".remove-dian").removeClass("add-chuxian")
    })
    $(".quxiao").on("click",function () {
        $(".add-dian").removeClass("add-chuxian")
        $(".remove-dian").removeClass("add-chuxian")
    })
})