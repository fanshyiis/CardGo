// pages/step/step.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepInfoList: [],
    userInfo: null,
    dataString: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.session_key)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        console.log(encryptedData)
        wx.request({
          url: 'https://zhide.leanapp.cn/index/weRun',
          method: 'GET',
          data:{
            'sessionKey': app.globalData.session_key,
            'iv': res.iv,
            'encryptedData': encryptedData
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            var today = new Date(res.data.stepInfoList[res.data.stepInfoList.length - 1].timestamp * 1000)
            var dataString = today.getFullYear() + ' / ' + today.getMonth() + ' / ' + today.getDay()
            console.log(dataString)
            _this.setData({
              stepInfoList: res.data.stepInfoList,
              dataString: dataString
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})