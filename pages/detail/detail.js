// pages/detail/detail.js
Page({
  data: {
    newsDetail: {}
  },

  returnHome() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  onLoad(options) {
    this.WxParse = require('../../wxParse/wxParse.js');
    let newsid = options.id
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsid
      },
      success: res => {
        let result = res.data.result
        this.setNews(result)
      }
    })
  },

  setNews(result) {
    let source = result.source ? result.source : '未知'
    let postTime = new Date(result.date).toTimeString().substr(0, 5)
    let htmlContent = ''
    result.content.forEach((block, i) => {
      if (block.type === 'image')
        htmlContent += ("<img src='" + block.src + "'></img>")
      else
        htmlContent += ("<" + block.type + ">" + block.text + "</" + block.type + ">") 
    })
    let newsDetail = {
      title: result.title,
      source: source,
      time: postTime,
      readCount: '阅读 ' + result.readCount
    }
    this.WxParse.wxParse('article', 'html', htmlContent, this, 5);
    this.setData({
      newsDetail: newsDetail
    })
  }
})