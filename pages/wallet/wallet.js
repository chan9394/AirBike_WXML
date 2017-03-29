var md5 = require("../MD5.js")
Page({
  data:{
    wallet: "",
    deposit: "押金   元",
    depositTitle: "     充押金",
    disabled: true,
    //0表示充,1表示退
    id: 0,
    //查询余额接口
    queryWalletUrl:"https://airbike.wrteach.com/v1/users/getbalance",
    //校验码
    SALT:"AIRBIKESALT",
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    //查询余额
    var that = this
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
        var message = res.data.message
        var statu = res.data.status
        //查询失败
        wx.showToast({
              title: message,
              icon: 'success',
              duration: 2000,
          })
        if (statu == 1) {
          that.setData({
            "wallet": res.data.result.balance,
            "deposit": "押金"+ res.data.result.deposit + "元"
          })
          //查询成功
          var deposit = res.data.result.deposit
          if (deposit > 0) {
            that.setData({
            "id": 1,
            "depositTitle": "   如何退押金",
            "disabled": false
            })
          }
        }
        //检查是否登录失效
        else if (statu == -2) {
          disabledToken.reLogin(-2)
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
  //如何退押金
  returnDeposit: function() {
    var that = this
    if (that.data.id == 0) {
      //充押金
      //调取充值接口
    }else if (that.data.id == 1){
      //退押金
      wx.showModal({
            title: '如何退押金',
            content: 'AirBike小程序暂未支持押金退回,您可以使用 AirBike app进行操作',
            showCancel: false,
            confirmText: "我知道了",
            confirmColor: "#34B5E3"
          })
    }
  },
  //充值
  recharge: function() {
    wx.navigateTo({
      url: '../deposit/deposit'
    })
  }

})