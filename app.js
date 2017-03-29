//app.js
App({
  globalData:{  
    //骑行状态0表示正常,1表示骑行中,2表示结束了骑行
    isRidingBike: 0,
    //请求开锁后返回的json数据
    unlockJson: {
      res:{},
      params: {}
    }  
},  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function(res) {
        var kScreenW = res.windowWidth/375
        var kScreenH = res.windowHeight/603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
  }
})