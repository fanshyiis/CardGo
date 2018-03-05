//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    zhideList: [],
    IndexZhide: 0,
    colorChoose: 'background-color:#F97083',
    colorChoose2: 'background-color:#89EC6A',
    animateM: '',
    animateC: '',
    startY: null,
    endY: null,
    cardTop: '0px',
    pressStartTime: null,
    btnText: '按住评分',
    pressTime: 0,
    onStatus: false
  },
  pressStart: function (e) {
    this.setData({
      btnText: this.data.pressTime + '分',
      onStatus: true
    })
    console.log(e)
    this.setData({
      pressStartTime: e.timeStamp
    })
    this.timeGo()
  },
  timeGo () {
    this.setData({
      pressTime: this.data.pressTime + 1
    })
    this.setData({
      btnText: (this.data.pressTime / 10) + '分'
    })
    console.log(this.data.onStatus)
    if (this.data.onStatus) {
      setTimeout(() => {
        this.timeGo()
      }, 80)
    }
  },
  pressEnd: function (e) {
    this.setData({
      onStatus: false,
      pressTime: 0
    })
    console.log(e.timeStamp - this.data.pressStartTime)
  },
  moveCard: function (e) {
    // console.log(e)
    // this.endY = e.changedTouches[0].pageY
    // let long = this.endY - this.startY
    // console.log(90 + long)
    // this.setData({
    //   cardTop: long + 'px'
    // })
  },
  moveEndCard: function (e) {
    // console.log('over')
    this.endY = e.changedTouches[0].pageY
    let long = this.endY - this.startY
    console.log(long)
    if (long < -100) {
      this.SwiperContent()
    }
  },
  moveStartCard: function (e) {
    // console.log(e)
    this.startY = e.changedTouches[0].pageY
    // console.log(e.touches[0].clientY)
  },
  changeZhide: function (e) {
    console.log(e.detail.current)
    this.setData({
      IndexZhide: e.detail.current
    })
  },
  headerTip: function () {
    this.setData({
      animateM: 'rubberBand'
    })
    setTimeout(() => {
      this.setData({
        animateM: ''
      })
    }, 1000)
  },
  SwiperContent: function () {
    var z = this.data.zhideList
    console.log(this.data.zhideList)
    z[this.data.IndexZhide].moreContent = !z[this.data.IndexZhide].moreContent
    this.setData({
      animateC: 'flipInY',
      zhideList: z
    })
    setTimeout(() => {
      this.setData({
        animateC: ''
      })
    }, 1000)
  },
  loadMore: function () {
    console.log('bottom')
  },
  colorChoose: function (index) {
    let i = index % 3
    console.log(i)
    if(i === 0) {
      return '#000'
    }
  },
  onLoad: function () {
    wx.request({
      url: 'https://zhide.leanapp.cn/index/getZhide',
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        res.data.zhide.map(r => {
          r.moreContent = false
          let allRate = 0
          r.Rate.map(val => {
            allRate += Number(val)
          })
          r.Rate = (allRate / r.Rate.length).toFixed(1)
        })
        this.setData({
          zhideList: res.data.zhide
        })
        console.log(res.data)
      }
    })
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
