Page({
  data:{
    currentMoney: 10,
    moneyArr:[
      {
        content:"10元",
        color: "#FFFFFF",
        background: "#34B5E3",
        id: 10,
        top: "150rpx",
        left: "40rpx",
      },
      {
        content:"20元",
        color: "#34B5E3",
        background: "#FFFFFF",
        id: 20,
        top: "150rpx",
        left: "395rpx",
      },
      {
        content:"50元",
        color: "#34B5E3",
        background: "#FFFFFF",
        id: 50,
        top: "270rpx",
        left: "40rpx",
      },
      {
        content:"100元",
        color: "#34B5E3",
        background: "#FFFFFF",
        id: 100,
        top: "270rpx",
        left: "395rpx",
      }
    ],
    //记录上一次点击的充值选项的id
    lastMoneyId: 0
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
  },
  //充值协议
  chargeAgree: function() {
    console.log("点击充值协议")
    wx.navigateTo({
      url: '../recharged/recharged',
    })
  },
  //点击充值选项
  chioceAct: function(res) {
    var that = this
    console.log("点击充值选项")
    console.log(res.currentTarget.dataset.currentid)
    var id = res.currentTarget.dataset.currentid
    if (id == 10) {
      //10元
      that.setData({
        "moneyArr[0].color":"#FFFFFF",
        "moneyArr[0].background":"#34B5E3",
        "moneyArr[1].color":"#34B5E3",
        "moneyArr[1].background":"#FFFFFF",
        "moneyArr[2].color":"#34B5E3",
        "moneyArr[2].background":"#FFFFFF",
        "moneyArr[3].color":"#34B5E3",
        "moneyArr[3].background":"#FFFFFF",
        "lastMoneyId": 0,
        "currentMoney": 10
      })
    }else if (id == 20){
      //20元
      that.setData({
        "moneyArr[1].color":"#FFFFFF",
        "moneyArr[1].background":"#34B5E3",
        "moneyArr[0].color":"#34B5E3",
        "moneyArr[0].background":"#FFFFFF",
        "moneyArr[2].color":"#34B5E3",
        "moneyArr[2].background":"#FFFFFF",
        "moneyArr[3].color":"#34B5E3",
        "moneyArr[3].background":"#FFFFFF",
        "lastMoneyId": 1,
        "currentMoney": 20
      })
    }else if (id == 50){
      //50元
      that.setData({
        "moneyArr[2].color":"#FFFFFF",
        "moneyArr[2].background":"#34B5E3",
        "moneyArr[1].color":"#34B5E3",
        "moneyArr[1].background":"#FFFFFF",
        "moneyArr[0].color":"#34B5E3",
        "moneyArr[0].background":"#FFFFFF",
        "moneyArr[3].color":"#34B5E3",
        "moneyArr[3].background":"#FFFFFF",
        "lastMoneyId": 2,
        "currentMoney": 50
      })
    }else if (id == 100){
      //100元
      that.setData({
        "moneyArr[3].color":"#FFFFFF",
        "moneyArr[3].background":"#34B5E3",
        "moneyArr[1].color":"#34B5E3",
        "moneyArr[1].background":"#FFFFFF",
        "moneyArr[2].color":"#34B5E3",
        "moneyArr[2].background":"#FFFFFF",
        "moneyArr[0].color":"#34B5E3",
        "moneyArr[0].background":"#FFFFFF",
        "lastMoneyId": 3,
        "currentMoney": 100
      })
    }
  },
  //点击去充值
  gotoRecharged: function() {
    console.log("去充值按钮")
    var nowTime = new Date()
    var timeStamp = Math.round((nowTime.getTime())/1000)
    var nonceStr = "4115211234567890123"
    var prepay_id = "wx201410272009395522657a690389285100"
    var sign = "C380BEC2BFD727A4B6845133519F3AD6"
    wx.requestPayment({
      //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
      timeStamp: timeStamp.toString(),
      //随机字符串，长度为32个字符以下。
      nonceStr: nonceStr,
      //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
      package: prepay_id,
      //签名算法，暂支持 MD5
      signType: 'MD5',
      //签名
      paySign: sign,
      success: function(res){
        // success
        console.log("success")
        console.log(res.data)
      },
      fail: function(res) {
        // fail
        //fail (detail message)	调用支付失败，其中 detail message 为后台返回的详细失败原因
        //fail cancel	用户取消支付
        console.log("fail")
        console.log(res)
      },
      complete: function(res) {
        // complete
        console.log("complete")
        console.log(res)
      }
    })
  }
})