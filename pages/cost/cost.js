var md5 = require("../MD5.js")
Page({
  data:{
    pay: 1.0,
    time: 0,
    wallet:"",
    //查询余额接口
    queryWalletUrl:"https://airbike.wrteach.com/v1/users/getbalance",
    //校验码
    SALT:"AIRBIKESALT",
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that = this
    that.setData({
      "pay": options.cost,
      "time": options.time
    })
    //查询余额
    var token = wx.getStorageSync('token') || ''
    wx.request({
      url: that.data.queryWalletUrl,
      data: {
              token: token,
              checksum: md5.hexMD5(token + that.data.SALT)
            },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        // success
        var statu = res.data.status
        if (statu == 1) {
          //查询成功
          that.setData({
            "wallet": res.data.result.balance
          })
        }else {
          //查询失败
          wx.showToast({
              title: '获取余额失败,可前往个人钱包查询',
              icon: 'loading',
              duration: 3000,
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
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
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      desc: '我刚刚使用AriBike完成了一场愉快的骑行,朋友们一起来体验一下吧', // 分享描述
      path: '/cost/cost' // 分享路径
    }
  },
  //完成
  finishAct: function() {
    wx.navigateBack()
  }
})