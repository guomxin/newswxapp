//index.js
//获取应用实例
const app = getApp()

//新闻API中的type
const newsTypes = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other']

Page({
  data: {
    curNewsType: 0, //当前选择的新闻类型
    newsTypesText: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    hotNewsList: [], //列表显示的新闻
    headlineNews: {} //头条新闻
  },

  onLoad() {
    //页面加载时基于新闻类型获取新闻列表
    this.getHotNews()
  },

  onPullDownRefresh() {
    //响应下拉事件
    this.getHotNews(() => {
      wx.stopPullDownRefresh()
    })
  },

  selectNewsType(event) {
    //响应点击顶部导航事件，点击的新闻类型由参数event传入
    let curNewsType = event.currentTarget.dataset.newstype
    //重设当前选择的新闻类型
    this.setData({
      curNewsType: curNewsType
    })
    this.getHotNews()
  },

  getHotNews(callback) {
    //根据新闻类型获取当前热点新闻列表
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsTypes[this.data.curNewsType]
      },
      success: res => {
        let result = res.data.result
        this.setHotNews(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setHotNews(result) {
    //解析新闻API的返回结果，并设置相应的页面数据
    let hotNewsList = []
    //循环返回结果构造新闻列表
    result.forEach((hotNewsInfo, i) => {
      let postDate = new Date(hotNewsInfo.date)
      hotNewsList.push({
        id: hotNewsInfo.id,
        title: hotNewsInfo.title,
        source: hotNewsInfo.source ? hotNewsInfo.source : '未知',
        time: postDate.toTimeString().substr(0, 5), //获取hh:mm
        imagePath: hotNewsInfo.firstImage ? hotNewsInfo.firstImage : '/images/timg.jpg'
      })
    })
    let headlineNews = hotNewsList.shift() //第一条设置为头条新闻
    //设置页面数据
    this.setData({
      hotNewsList: hotNewsList,
      headlineNews: headlineNews
    })
  },

  showNewsDetail(event) {
    let newsid = event.currentTarget.dataset.id
    //传入新闻id，重定向到新闻详情显示页面
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + newsid
    })
  }
})
