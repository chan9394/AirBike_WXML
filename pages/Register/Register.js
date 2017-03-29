var md5 = require("../MD5.js")
var checkNetWork = require("../CheckNetWork.js")
Page({
  data:{
    getCodeBtnProperty: {
      titileColor: '#B4B4B4',
      disabled: true,
      loading: false,
      title: '获取验证码'
    },
    loginBtnProperty: {
      disabled: true,
      loading: false,
    },
    getCodeParams: {
      token: 'airbike-token',
      mobile: '',
      checksum: '',
    },
    registerParams: {
      mobile: '',
      code: '', 
      checksum: ''
    },
    codeTfFocus: false,
    AirBikeUrl: {
      getcode: "https://airbike.wrteach.com/v1/users/getcheckcode", 
      register: "https://airbike.wrteach.com/v1/users/register"
    },
    //校验码
    SALT:"AIRBIKESALT",
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
  },

  //输入手机号
  phoneTfInput: function(e) {
    var that = this
    var inputValue = e.detail.value
    var length = e.detail.value.length
    if (length == 11) {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'getCodeParams.mobile': inputValue,
        'registerParams.mobile': inputValue,
        'getCodeBtnProperty.titileColor':'#34B5E3',
        'getCodeBtnProperty.disabled': false
      })
    }else {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'getCodeParams.mobile': '',
        'registerParams.mobile': '',
        'getCodeBtnProperty.titileColor':'#B4B4B4',
        'getCodeBtnProperty.disabled': true
      })
    }
  },

  //获取验证码
  getCodeAct: function() {
    //请求接口
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      var that = this
      var checksum = that.data.getCodeParams.token + that.data.getCodeParams.mobile + that.data.SALT
      var checksumMd5 = md5.hexMD5(checksum)
      that.setData({
        'getCodeParams.checksum': checksumMd5,
        //显示loading
        'getCodeBtnProperty.loading': true
      })
      wx.request({
        url: that.data.AirBikeUrl.getcode,
        data: that.data.getCodeParams,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          // success
          console.log(that.data.getCodeParams),
          console.log(res.data)
          var message = res.data.message
          var statu = res.data.status
          if (statu == '0') {
            wx.showToast({
              title: '获取验证码:\n' + message,
              icon: 'success',
              duration: 2000,
            })
            //启动定时器
            var number=60;
            var time = setInterval(function(){
              number--;
             that.setData({
                'getCodeBtnProperty.title':number + '秒',
                'getCodeBtnProperty.disabled': true
              })
             if(number==0){
                that.setData({
                  'getCodeBtnProperty.title':'重新获取',
                  'getCodeBtnProperty.disabled': false
                })
                clearInterval(time);
              }
            },1000);
          }else {
            wx.showToast({
              title: '注册登录:\n' + message,
              icon: 'loading',
              duration: 2000,
            })
          }
          //光标下移
          that.setData({
            'codeTfFocus': true
          })
        },
        fail: function(res) {
          // fail
          console.log(res)
          that.failMessage()
        },
        complete: function() {
          // complete
          //隐藏loading
          that.setData({
            'getCodeBtnProperty.loading': false
          })
        }
      })
    }
  },

  //输入验证码
  codeTfInput: function(e) {
    var that = this
    var inputValue = e.detail.value
    var length = e.detail.value.length
    if (length == 4) {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'loginBtnProperty.disabled': false,
        'registerParams.code': inputValue
      })
    }else {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'loginBtnProperty.disabled': true,
        'registerParams.code': ''
      })
    }
  },

  //注册登录
  loginAct: function() {
    //光标取消
    var that = this
    that.setData({
      'codeTfFocus': true
    })
    //请求接口
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      var checksum = that.data.registerParams.mobile + that.data.registerParams.code + that.data.SALT
      var checksumMd5 = md5.hexMD5(checksum)
      that.setData({
        'registerParams.checksum': checksumMd5,
        //显示loading
        'loginBtnProperty.loading': true
      })
      wx.request({
        url: that.data.AirBikeUrl.register,
        data: that.data.registerParams,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          // success
          console.log(that.data.registerParams),
          console.log(res.data)
          var message = res.data.message
          var statu = res.data.status
          var result = res.data.result
          if (statu == 1) {
            //1表示注册
            wx.showToast({
              title: '注册登录:\n' + 'OK',
              icon: 'success',
              duration: 2000,
            })
            //将token保存到程序内
            var token = result.access_token
            wx.setStorageSync('token', token)
            //转回主界面
            setTimeout(function(){
              wx.navigateBack()
            },1500)
          }else if (statu == -5) {
             // -5表示登录
            wx.showToast({
              title: '注册登录:\n' + 'OK',
              icon: 'success',
              duration: 2000,
            })
            //将token保存到程序内
            var token = result.user.access_token
            wx.setStorageSync('token', token)
            //转回主界面
            setTimeout(function(){
              wx.navigateBack()
            },1500)
            
          }else {
            wx.showToast({
              title: '注册登录:\n' + message,
              icon: 'loading',
              duration: 2000,
            })
          }
          
        },
        fail: function() {
          // fail
          that.failMessage()
        },
        complete: function() {
          // complete
          //隐藏loading
          that.setData({
            'loginBtnProperty.loading': false
          })
        }
      })
    }
  },

  //用车服务条款
  explainAct: function() {
    wx.navigateTo({
        url: '../service/service'
      })
  },

  failMessage: function() {
    wx.showToast({
        title: '连接服务器失败',
        icon: 'loading',
        duration: 2000,
     })
  }
})