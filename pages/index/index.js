//index.js
var md5 = require("../MD5.js")
var checkNetWork = require("../CheckNetWork.js")
var disabledToken = require("../disabledToken.js")
//获取应用实例
Page({
  data: {
    //地图的宽高
    mapHeight: '100%',
    mapWidth: '100%',
    mapTop: '0',
    //正在骑行中的视图的属性
    bikeRiding: {
      show: false,
      ridingTime: 0,
      ridingDistance: 0,
      ridingSpeed: 0,
      height: '25%',
      width: '100%',
      topLineHeight: "0rpx",
      bottomLineHeight: "0rpx",
    },
    //计费异常的视图的属性
    bikeAbnormity: {
      show: false,
      height: '15%',
      width: '100%',
    },
    //接口
    AirBikeUrl: {
      getlist: "https://airbike.wrteach.com/v1/bikes/getlist", 
      unlock: "https://airbike.wrteach.com/v1/bikes/unlock",
      getcyclingstatusUrl:"https://airbike.wrteach.com/v1/bikes/getcyclingstatus",
      queryridingstatusUrl:"https://airbike.wrteach.com/v1/users/queryridingstatus"
    },
    //校验码
    SALT:"AIRBIKESALT",

    //是否能查询附近单车: 主要根据骑行中状态判断
    isCanGetBikeList: true,
    //查询附近单车请求参数
    getBikeListParams:{
        token: "airbike-token",
        longitude: "",
        latitude: "",
        checksum: ""
    },
    //请求单车开锁参数
    unlockBikeParams: {
      token: '',
      device_id: '',
      checksum: '',
    },
    //重启APP后查询接口完成的标识
    completeStatu: true,
    //骑行中接口参数
    ridingBikeParams: {
      token: '',
      device_id: '',
      serial_no: '',
      checksum: '',
    },
    //用户当前位置
    point: {
      latitude: 0,
      longitude: 0
    },
    //单车标注物
    markers: [],
    //当前地图的缩放级别
    mapScale: 16,
    //地图上不可移动的控件
    controls:[ ],
    //当前扫描的车辆ID
    currentBikeId: '',
    //已登录的地图组件
    hasLoginMapControls: [
            {// //扫描二维码控件按钮
            id: 12,
            position: {
              left:132.5*wx.getStorageSync("kScreenW"),
              top:523*wx.getStorageSync("kScreenH"),
              width:110*wx.getStorageSync("kScreenW"),
              height:40*wx.getStorageSync("kScreenW") 
            },
            iconPath: '../images/imgs_custom_scan@2x.png',
            clickable: true,
          },
          //隐藏说明按钮
           {
              position: {
                width:1,
                height:1 
              },
              iconPath: '../images/hidden_explain.png',
              clickable: false,
          },
          {
            id: 11,
            position: {
              left:10*wx.getStorageSync("kScreenW"),
              top:523*wx.getStorageSync("kScreenH"),
              width:40*wx.getStorageSync("kScreenW"),
              height:40*wx.getStorageSync("kScreenW")
            },
            iconPath: '../images/imgs_main_location@2x.png',
            clickable: true,
          },
      //钱包控件按钮
      {
        id: 13,
        position: {
          left:330*wx.getStorageSync("kScreenW"),
          top:523*wx.getStorageSync("kScreenH"),
          width:40*wx.getStorageSync("kScreenW"),
          height:40*wx.getStorageSync("kScreenW")
        },
        iconPath: '../images/imgs_menu_wallet@2x.png',
        clickable: true,
      },
      //地图中心位置按钮
      {
        id: 14,
        position: {
          left:177.5*wx.getStorageSync("kScreenW"),
          top:261.5*wx.getStorageSync("kScreenH"),
          width:20*wx.getStorageSync("kScreenW"),
          height:40*wx.getStorageSync("kScreenW")
        },
        iconPath: '../images/imgs_main_center@2x.png',
        clickable: false,
        }],
        //没有登录的地图组件
        notLoginMapControls:[
            {
              id: 16,
              position: {
                left:132.5*wx.getStorageSync("kScreenW"),
                top:523*wx.getStorageSync("kScreenH"),
                width:110*wx.getStorageSync("kScreenW"),
                height:40*wx.getStorageSync("kScreenW") 
              },
              iconPath: '../images/login_register.png',
              clickable: true,
          },
          //显示说明按钮
          {
              id: 15,
              position: {
                left:45*wx.getStorageSync("kScreenW"),
                top:20*wx.getStorageSync("kScreenH"),
                width:285*wx.getStorageSync("kScreenW"),
                height:40*wx.getStorageSync("kScreenW")
              },
              iconPath: '../images/explain.png',
              clickable: true,
            },
            {
            id: 11,
            position: {
              left:10*wx.getStorageSync("kScreenW"),
              top:523*wx.getStorageSync("kScreenH"),
              width:40*wx.getStorageSync("kScreenW"),
              height:40*wx.getStorageSync("kScreenW")
            },
            iconPath: '../images/imgs_main_location@2x.png',
            clickable: true,
         },
      //钱包控件按钮
       {
        id: 13,
        position: {
          left:330*wx.getStorageSync("kScreenW"),
          top:523*wx.getStorageSync("kScreenH"),
          width:40*wx.getStorageSync("kScreenW"),
          height:40*wx.getStorageSync("kScreenW")
        },
        iconPath: '../images/imgs_menu_wallet@2x.png',
        clickable: true,
      },
      //地图中心位置按钮
      {
        id: 14,
        position: {
          left:177.5*wx.getStorageSync("kScreenW"),
          top:261.5*wx.getStorageSync("kScreenH"),
          width:20*wx.getStorageSync("kScreenW"),
          height:40*wx.getStorageSync("kScreenW")
        },
        iconPath: '../images/imgs_main_center@2x.png',
        clickable: false,
      }],
      //检测骑行中的定时器是否已创建
      isCreateTimerStatu: false
  },

  //控件的点击事件
  controltap: function (e) {
    console.log(e)
    var that = this
    var id = e.controlId
    if (id == 11) {
      //定位当前位置
      that.getUserCurrentLocation()
    }else if (id == 12) {
      //扫描二维码 扫描二维码 扫描二维码 扫描二维码 扫描二维码 扫描二维码
        wx.scanCode({
          success: function(res){
            // success
            var checksum = that.data.unlockBikeParams.token + res.result + that.data.SALT
            var checksumMd5 = md5.hexMD5(checksum)
            that.setData({
              'unlockBikeParams.device_id': res.result,
              'unlockBikeParams.checksum': checksumMd5
            })
            //扫码之后请求接口
            that.scanBikeQr()
          },
          fail: function() {
            // fail
            wx.showToast({
              title: '扫码失败',
              icon: 'loading',
              duration: 2000,
            })
          },
          complete: function() {
            // complete
          }
        })
    }else if (id == 13) {
     var token = wx.getStorageSync('token') || ''
     if (token.length > 0) {
       //进入钱包
        wx.navigateTo({
          url: '../wallet/wallet'
        })
     }else {
       //注册登录 
       wx.navigateTo({
        url: '../Register/Register'
      })
     }
     
    }else if (id == 15) {
      //使用说明
      wx.navigateTo({
      url: '../explain/explain'
    })
    }else if (id == 16) {
      //注册登录 
      wx.navigateTo({
        url: '../Register/Register'
      })
    }
  },

  //扫描二维码返回的事件
  scanBikeQr: function () {
    //检查网络
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      var that = this
      wx.request({
        url: that.data.AirBikeUrl.unlock,
        data: that.data.unlockBikeParams,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          // success
          var message = res.data.message
          var statu = res.data.status
          if (statu == 1) {
            //服务器返回开锁成功
            var serial_no = res.data.result.serial_no
            var checksum = that.data.unlockBikeParams.token + that.data.unlockBikeParams.device_id + serial_no + that.data.SALT
            var checksumMd5 = md5.hexMD5(checksum)
            //将骑行中的接口参数赋值
            that.setData({
              "ridingBikeParams.token":that.data.unlockBikeParams.token,
              "ridingBikeParams.device_id":that.data.unlockBikeParams.device_id,
              "ridingBikeParams.serial_no":serial_no,
              "ridingBikeParams.checksum":checksumMd5
            })
          }
          //检查是否登录失效
          if (statu == -2) {
            disabledToken.reLogin(-2)
          }else{
            //一旦接口返回了正常信息,就跳到开锁界面,并传值过去
            getApp().globalData.unlockJson.res = res.data
            getApp().globalData.unlockJson.params = that.data.unlockBikeParams
            console.log('全局变量的值')
            console.log(getApp().globalData.unlockJson)
            //跳转到开锁界面
            wx.navigateTo({
              url: '../unlocking/unlocking'
            })
          }
          
        },
        fail: function() {
          // fail
          that.failMessage()
        },
        complete: function() {
          // complete
        }
      })
    }
  },

  //请求附近单车列表
  getBikeList: function () {
    //检查网络
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      var that = this
      wx.request({
        url:  that.data.AirBikeUrl.getlist,
        data: that.data.getBikeListParams,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          // success
          var message = res.data.message
          var statu = res.data.status
          //检查是否登录失效
          disabledToken.reLogin(statu)
          wx.showToast({
              title: '查询附近单车:\n' + message,
              icon: 'success',
              duration: 2000,
          })
          var bikeArr = res.data.result
          var markers = []
          for (var i=0;i<bikeArr.length;i++) {
            var bikeLat = Number(bikeArr[i].latitude)
            var bikeLong = Number(bikeArr[i].longitude)
            var id = Number(bikeArr[i].device_id)
            var marker={
                latitude: bikeLat,
                longitude: bikeLong,
                iconPath: "../images/imgs_main_bike@2x.png",
                id: id,
                width: 40*wx.getStorageSync("kScreenW"),
                height: 40*wx.getStorageSync("kScreenW")
            }
            markers.push(marker)
          }
          if (that.data.isCanGetBikeList) {
            that.setData({
            'markers': markers
            })
          }
          console.log(that.data.markers)
        },
        fail: function() {
          // fail
          that.failMessage()
        },
        complete: function() {
          // complete
          console.log("请求complete啊")
          setTimeout(function(){
              wx.hideToast()
          },1000)
        }
      })
    }
  },

  //位置变化的时候
  regionchange: function (e) {
    //得到地图中心点的位置
    var that = this
    that.mapCtx.getCenterLocation({
      success: function (res) {
        //调试发现地图在滑动屏幕开始和结束的时候都会走这个方法,需要判断位置是否真的变化来判断是否刷新单车列表
        //经纬度保留6位小数
        var longitudeFix = res.longitude.toFixed(6)
        var latitudeFix = res.latitude.toFixed(6)
        if (e.type == "begin") {
          console.log('位置相同,不执行刷新操作')
        }else {
          console.log("位置变化了")
          var checksum = that.data.getBikeListParams.token + longitudeFix + latitudeFix + that.data.SALT
          var checksumMd5 = md5.hexMD5(checksum)
          that.setData({
            'getBikeListParams.longitude': longitudeFix,
            'getBikeListParams.latitude': latitudeFix,
            'getBikeListParams.checksum': checksumMd5
          })
         //刷新单车列表
         if (that.data.isCanGetBikeList){
           that.getBikeList()
         }
        }
      }
    })
  },

  //点击标注点
  markertap: function (e) {
    console.log(e.markerId)
  },

  //定位到用户当前位置
  getUserCurrentLocation: function () {
    this.mapCtx.moveToLocation();
    this.setData({
      'mapScale': 16
    })
  },

  failMessage: function() {
    wx.showToast({
              title: '连接服务器失败',
              icon: 'loading',
              duration: 2000,
     })
  },

//关锁后未计费
unEndCharge: function (){
  console.log('关锁后未计费')
  var that = this
  wx.showModal({
    title: '提交关锁后未结费用问题',
    content: '如确定锁环已扣紧,请点击提交。您的账号会暂时无法用车,我们会尽快完成处理并解冻您的账号',
    confirmText:"提交",
    confirmColor: "#34B5E3",
    success: function(res) {
      if (res.confirm) {
        //出现计费异常视图
        that.setData({
          "bikeAbnormity.show": true,
          "mapHeight": "85%",
          "bikeRiding.show": false
        })
      }
    }
  })
},

//页面加载的函数
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //获取用户的当前位置位置
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
      success: function(res){
        // success
        var latitude = res.latitude
        var longitude = res.longitude
        var point= {
          latitude: latitude,
          longitude: longitude
        };
        that.setData({
          'point': point
         })
      }
    })
    //计算屏幕的高度
    var h = wx.getStorageSync("kScreenH")
    var top = h*0.25*0.7
    var bottom = h*0.25*0.3
    that.setData({
          'bikeRiding.topLineHeight': top,
          'bikeRiding.bottomLineHeight': bottom
    })
    //如果APP被微信强制关闭或异常杀死,重启的情况下,检查用户的用车状态
    //如果未登录,则不做处理,否则请求查询接口
    var token = wx.getStorageSync('token') || ''
    if (checkNetWork.checkNetWorkStatu() == false) {
        console.log('网络错误')
    }else {
      if (token.length > 0) {
        //这一步是为了让onShow函数必须启动定时器到当前网络请求结束
        that.setData({
                "completeStatu": false
        })
          wx.request({
            url: that.data.AirBikeUrl.queryridingstatusUrl,
            data: {
              token: token,
              checksum: md5.hexMD5(token + that.data.SALT)
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              // success
              console.log(res.data)
              var query_statu = res.data.status
              if (query_statu == 1) {
                //查询成功
                var result = res.data.result
                if (result.riding_status == 0){
                  //未骑行,未预约状态,什么也不做
                }else if (result.riding_status == 1){
                  //修改全局骑行状态为1
                  getApp().globalData.isRidingBike = 1
                  console.info("onload函数下的骑行状态参数")
                  console.info(getApp().globalData.isRidingBike)
                  //骑行状态,显示骑行视图
                  var serial_no = result.riding_info.serial_no
                  var lock_id = result.riding_info.lock_id
                  //服务器返回开锁成功
                  var checksum = token + lock_id + serial_no + that.data.SALT
                  var checksumMd5 = md5.hexMD5(checksum)
                  //将骑行中的接口参数赋值
                  that.setData({
                    "ridingBikeParams.token":token,
                    "ridingBikeParams.device_id":lock_id,
                    "ridingBikeParams.serial_no":serial_no,
                    "ridingBikeParams.checksum":checksumMd5
                  })
                }else if (result.riding_status == 2){
                  //预约状态,提示用户再APP上预约过单车
                  wx.showModal({
                    title: '提示',
                    content: '系统检测到您已在APP端预约过单车,如果继续使用小程序扫码开锁,将会自动帮您取消掉预约状态',
                    showCancel: false,
                  })
                }
              }else {
                //非法操作
                wx.showToast({
                    title: '更新用户状态失败',
                    icon: 'loading',
                    duration: 2000,
                })
              }
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
              console.log("complete")
              that.setData({
                "completeStatu": true
              })
            }
        })
      }
   }
  },

    onReady: function (e) {
      //通过id获取map,然后创建上下文
      this.mapCtx = wx.createMapContext("myMap");
    },

    onShow:function(){
      // 生命周期函数--监听页面显示
      var networkStatu = checkNetWork.checkNetWorkStatu()
      //最长的延时时间
      wx.showToast({
        title: '正在获取用户最新状态',
        icon: 'loading',
        duration: 10000,
        mask: true
      })
      console.log('onShow')
      var that = this
      var checkTimer = setInterval(function(){
        console.log("定时器在执行")
        var completeStatu = that.data.completeStatu
        if (completeStatu){
          console.log("定时器停止")
          clearInterval(checkTimer)
          //完成界面的加载
          //获取tokn
          var token = wx.getStorageSync('token') || ''
          console.log(token)
          //获取骑行状态
          var isRidingBike = getApp().globalData.isRidingBike
          console.log(isRidingBike)
          //已登录的map组件
          var hasLoginMapControls = that.data.hasLoginMapControls
          //未登录的map组件
          var notLoginMapControls = that.data.notLoginMapControls
          if (token.length > 0) {
            //表示已登录
            //1.给扫码接口的token赋值
            that.setData({
              'unlockBikeParams.token': token
            })
            if (isRidingBike == 0) {
              //正常状态
              //2.显示骑行中的视图,隐藏map控件
              that.setData({
                'controls': hasLoginMapControls,
              })
              //隐藏加载图
              wx.hideToast()
            }else if (isRidingBike == 1) {
              //正在骑行中
              //3.显示骑行中的视图,隐藏map控件,改变地图高度,不能查询附近的单车了
              that.setData({
                "isCanGetBikeList": false,
                "bikeRiding.show": true,
                "markers":[{
                    latitude: that.data.point.latitude,
                    longitude: that.data.point.longitude,
                    iconPath: "../images/hidden_explain.png",
                    width: 1,
                    height: 1
                }],
                'controls': [
                  {
                  position: {
                    width:1,
                    height:1 
                  },
                  iconPath: '../images/hidden_explain.png',
                  clickable: false,
                  }],
                "mapHeight": "75%"
              })
              //计费异常视图还存在时,继续显示异常视图
              if (that.data.bikeAbnormity.show) {
                that.setData({
                  "mapHeight": "85%",
                  "bikeRiding.show": false
                })
              }
              //隐藏加载图
              wx.hideToast()
              //创建定时器,检查骑行是否结束
              var networkStatu = checkNetWork.checkNetWorkStatu()
              if (that.data.isCreateTimerStatu == false){
                that.setData({
                  "isCreateTimerStatu": true
                })
                var ridingTimer = setInterval(function(){
                //查询骑行的接口,接受返回的数据展示在骑行视图中
                    wx.getNetworkType({
                    success: function(res) {
                      var networkType = res.networkType
                      if (networkType == "none" || networkType == "unknown") {
                        //没有网络
                      }else {
                        //有网络
                    wx.request({
                      url: that.data.AirBikeUrl.getcyclingstatusUrl,
                      data: that.data.ridingBikeParams,
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // 设置请求的 header
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      }, 
                  success: function(res){
                    // success
                    console.log(res.data)
                    var statu = res.data.status
                    //检查是否登录失效
                    if (statu == -2) {
                      disabledToken.reLogin(-2)
                    }else {
                      var message = res.data.message
                      var time = Math.round(res.data.result.riding_minute)
                      var distance = parseFloat(res.data.result.mileage).toFixed(2)
                      var cost = res.data.result.cost
                      var speed = 0
                      if (time > 0){
                        speed = (distance/(time/60)).toFixed(2)
                      }
                      console.log("骑行速度speed")
                      console.log(speed)
                      if (statu == 1) {
                        //骑行中
                        that.setData({
                          "bikeRiding.ridingTime": time,
                          "bikeRiding.ridingDistance": distance,
                          "bikeRiding.ridingSpeed": speed,
                        })
                      }else if (statu == 2) {
                        //骑行结束
                        that.setData({
                          "bikeRiding.ridingTime": 0,
                          "bikeRiding.ridingDistance": 0,
                          "bikeRiding.ridingSpeed": 0,
                        })
                        //停止定时器
                        clearInterval(ridingTimer)
                        that.setData({
                          "isCreateTimerStatu": false
                        })
                        console.log("ridingTimer定时器停止")
                        //修改全局骑行状态为1
                        getApp().globalData.isRidingBike = 2
                        //骑行结束,跳到骑行结算界面
                        wx.navigateTo({
                          url: '../cost/cost?time='+time+"&cost="+cost,
                        })
                      }else {
                        //错误的请求
                        //停止定时器
                        clearInterval(ridingTimer)
                        that.setData({
                          "isCreateTimerStatu": false
                        })
                      }
                    }
                  },
                  fail: function() {
                    // fail
                    that.failMessage()
                  },
                  complete: function() {
                    // complete
                  }
                  })
                }
              }  
            })
          },500)
        }
              
        }else if (isRidingBike == 2) {
              //结束骑行
              //修改全局骑行状态为1即正常状态
              getApp().globalData.isRidingBike = 0
              that.setData({
                "bikeRiding.show": false,
                'controls': hasLoginMapControls,
                "mapHeight": "100%",
                "bikeAbnormity.show": false,
                "isCanGetBikeList": true,
              })
              //隐藏加载图
              wx.hideToast()
            }
        }else {
            //没有登录
            //所有数据恢复到初始值
            that.setData({
              'controls': notLoginMapControls,
              //地图的宽高
              "mapHeight": '100%',
              "mapWidth": '100%',
              "mapTop": '0',
              //正在骑行中的视图的属性
              "bikeRiding": {
                show: false,
                ridingTime: 0,
                ridingDistance: 1.2,
                ridingSpeed: 5.0,
                height: '25%',
                width: '100%',
                topLineHeight: "0rpx",
                bottomLineHeight: "0rpx",
              },
              //计费异常的视图的属性
              "bikeAbnormity": {
                show: false,
              },
          })
          //隐藏加载图
          wx.hideToast()
        }
      }else {
        console.log("定时器没有停止执行")
      }},1000)
    },
    onHide:function(){
      // 生命周期函数--监听页面隐藏
      console.log('onHide')
    },
    onUnload:function(){
      // 生命周期函数--监听页面卸载
      console.log('onUnload')
    },
    onPullDownRefresh: function() {
      // 页面相关事件处理函数--监听用户下拉动作
      console.log('onPullDownRefresh')
    },
    onReachBottom: function() {
      // 页面上拉触底事件的处理函数
      console.log('onReachBottom')
    },
    onShareAppMessage: function() {
      // 用户点击右上角分享
      console.log('onShareAppMessage')
      return {
        desc: '我刚刚发现了一款便宜又好用的共享单车,分享给大家看看吧', // 分享描述
        path: '/index/index' // 分享路径
      }
    }
})