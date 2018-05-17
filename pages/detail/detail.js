// pages/detail/detail.js
Page({
  data: {
    newsDetail: {} //新闻详情
  },

  returnHome() {
  //返回新闻列表页面
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  onLoad(options) {
    //WxParse用于小程序内展示html内容
    this.WxParse = require('../../wxParse/wxParse.js');
    let newsid = options.id
    //根据新闻id调用新闻API获取详情
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
    //解析新闻API返回结果
    let source = result.source ? result.source : '未知'
    let postTime = new Date(result.date).toTimeString().substr(0, 5) //hh:mm
    let htmlContent = '' //基于新闻API返回结果构造html格式新闻内容
    result.content.forEach((block, i) => {
      if (block.type === 'image')
        //当type为image时，构造<img>内容
        htmlContent += ("<img src='" + block.src + "'></img>")
      else
        //当type为非image时，构造以type为标签的内容
        htmlContent += ("<" + block.type + ">" + block.text + "</" + block.type + ">") 
    })
    //构造新闻详情对象
    let newsDetail = {
      title: result.title,
      source: source,
      time: postTime,
      readCount: '阅读 ' + result.readCount
    }
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    * 详见https://github.com/udacity/wmpnd-news
    */
    this.WxParse.wxParse('article', 'html', htmlContent, this, 5);
    this.setData({
      newsDetail: newsDetail
    })
  }
})