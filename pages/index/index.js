//index.js
//获取应用实例
const app = getApp()

const newsTypes = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other']

Page({
  data: {
    curNewsType: 0,
    newsTypesText: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    hotNewsList: []
  },

  onLoad() {
    this.getHotNews()
  },

  onPullDownRefresh() {
    this.getHotNews(() => {
      wx.stopPullDownRefresh()
    })
  },

  selectNewsType(event) {
    let curNewsType = event.currentTarget.dataset.newstype
    this.setData({
      curNewsType: curNewsType
    })

    this.getHotNews()

  },

  getHotNews(callback) {
    // 根据新闻类型获取当前热点新闻列表
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
    let hotNewsList = []
    result.forEach((hotNewsInfo, i) => {
      let postDate = new Date(hotNewsInfo.date)
      hotNewsList.push({
        id: hotNewsInfo.id,
        title: hotNewsInfo.title,
        source: hotNewsInfo.source ? hotNewsInfo.source : '未知',
        time: postDate.toTimeString().substr(0, 5),
        imagePath: hotNewsInfo.firstImage ? hotNewsInfo.firstImage : '/images/timg.jpg'
        //imagePath: '/images/timg.jpg'
      })
    })
    this.setData({
      hotNewsList: hotNewsList
    })
  },

  showNewsDetail(event) {
    let newsid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + newsid
    })
  }
})
