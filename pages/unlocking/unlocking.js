var checkNetWork = require("../CheckNetWork.js")
var disabledToken = require("../disabledToken.js")
Page({
  data:{
    progress: 1,
    //接口
    checkUnlockUrl: "https://airbike.wrteach.com/v1/bikes/checkunlockresult",
    //校验码
    SALT:"AIRBIKESALT",
  },
  onLoad:function(){
    // 生命周期函数--监听页面加载
    var that = this
    var res = getApp().globalData.unlockJson.res
    var params = getApp().globalData.unlockJson.params
    console.log(res)
    var message = res.message
    var statu = res.status
    if (statu == 1) {
      if (checkNetWork.checkNetWorkStatu() == false) {
         console.log('网络错误')
      }else{
        //开锁成功,锁平台状态正常,需要再请求服务器查看锁的状态
        var second = 0
        var timer = setInterval(function(){
          second++;
        //查询服务器开锁状态的接口
        if (second == 10) {
          //10s后关闭定时器,提示开锁失败
          clearInterval(timer)
          that.showUnlockStatuMessage("开锁失败请重试")
        }else {
          //请求接口
          wx.request({
          url: that.data.checkUnlockUrl,
          data: params,
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // 设置请求的 header
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          }, 
          success: function(res){
            // success
            var statu = res.data.status
            if (statu == 1){
              //已开锁
              //停止定时器
              clearInterval(timer)
              //修改全局骑行状态为1
              getApp().globalData.isRidingBike = 1
                that.setData({
                'progress': 100
              })
              //提示成功信息,并返回主页面
              setTimeout(function(){
                wx.showToast({
                title: '扫码开锁:\n' + "开锁成功",
                icon: 'success',
                duration: 2000,
                })
              },3000)
              setTimeout(function(){
                //返回主页面
                wx.navigateBack()
              },5000)
            }else{
              //未开锁
              // //继续查询,改变progress进度
              // if (that.data.progress == 0) {
              //   that.setData({
              //   "progress": 96
              //   })
              // }
            }
          }
        })
      }},1000)}
    }else{
      //开锁失败,不做任何改动
      getApp().globalData.isRidingBike = 0
      that.showUnlockStatuMessage(message)
    }
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  //提示信息
  showUnlockStatuMessage: function(message) {
    wx.showModal({
            title: '扫码开锁提示',
            content: message,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //返回res.confirm为true时，表示用户点击确定按钮
                //返回主页面
            wx.navigateBack()
              }
       }
    })
  }
})