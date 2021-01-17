import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


// 挂载封装的网络请求封装函数
Vue.prototype.request = (params)=>{
    // 验证 没有token进入不了app内部
    const token = uni.getStorageSync('token')
			if(!token) {
				uni.reLaunch({
					 url: '/pages/login/index'
				});
			}
    let header = {...params.header};
    // 拼接header 带上token
    header["Authorization"] = uni.getStorageSync("token");
    // 加载中
    uni.showLoading({
      title: '加载中',
      mask: true
    });
    let baseUrl = 'http://127.0.0.1:4000/open'
    let userUrl = uni.getStorageSync('userUrl')
    if(userUrl) {
      // 如果用户设置了自定义接口地址 使用用户设置的接口
      baseUrl = userUrl
    }

    return new Promise((resolve,reject) => {
      
      wx.request({
        ...params,
        header: header,
        url:baseUrl+params.url,
        success(res){ 
            resolve(res.data);
        },
        fail(err){
            reject(err);
        },
        complete(){
          uni.hideLoading();
        }
      })
  })
};

// 将时间处理函数挂在到vue的上全局可以使用(vue过滤器) 传入毫秒数转换成时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日

  const hh = (dt.getHours() + '').padStart(2, '0') // 小时
  const mm = (dt.getMinutes() + '').padStart(2, '0') // 分
  const ss = (dt.getSeconds() + '').padStart(2, '0') // 秒
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('dateBirth', function (originVal) { // 员工出生的过滤函数
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日
  return `${y}年${m}月${d}日`
})

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
