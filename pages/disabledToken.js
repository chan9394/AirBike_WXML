function reLogin(statu) {
    if (statu == -2) {
        //token失效,请重新登录
        wx.showModal({
            title: '提示',
            content: '登录已失效,请重新登录',
            confirmText: "重新登录",
            success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                //跳到登录界面
                wx.navigateTo({
                  url: '../Register/Register'
                })
                //清空token
                wx.setStorageSync('token', '')
             }
            }
        })
    }
}
module.exports = {    
  reLogin: reLogin    
} 