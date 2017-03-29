//检查网络状态
function checkNetWorkStatu()  {
  var statu = true
  wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi, none, unknown
        if (networkType == "none") {
          //没有网络连接
          wx.showModal({
            title: '提示',
            content: '没有网络连接,请检查您的网络设置',
            showCancel: false,
            // success: function(res) {
            //   if (res.confirm) {
            //     //返回res.confirm为true时，表示用户点击确定按钮
                
            //   }
            // }
          })
          statu = false
        }else if (networkType == "unknown") {
          //未知的网络类型
          wx.showModal({
            title: '提示',
            content: '未知的网络类型,请检查您的网络设置',
            showCancel: false,
            // success: function(res) {
            //   if (res.confirm) {
            //     //返回res.confirm为true时，表示用户点击确定按钮
                
            //   }
            // }
          })
          statu = false
        }
      }
  })
  return statu
}
module.exports = {    
  checkNetWorkStatu: checkNetWorkStatu    
} 