// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import './theme/index.less'

Vue.use(iview)

global.apiUrl = 'http://120.77.169.165:3000'
// global.apiUrl = 'http://localhost:3000'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iview.LoadingBar.start()
  next()
})

router.afterEach(route => {
  iview.LoadingBar.finish()
  window.scrollTo(0, 0)
})

Vue.directive('imgview', {
  bind (el, binding, vnode) {
    el.style.cursor = 'zoom-in'
    el.addEventListener('click', function (e) {
      let imgSrc = el.getAttribute('src')
      if (imgSrc) {
        document.getElementById('imgViewDom').firstChild.src = imgSrc
        document.getElementById('imgViewDom').style.display = 'flex'
      }
    })
  },
  unbind (el) {
    el.removeEventListener('click', null)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
