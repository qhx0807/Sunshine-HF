import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Message from '@/components/Message'
import Market from '@/components/Market'
import House from '@/components/House'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children: [{
          path: '/Message',
          name: 'Message',
          component: Message
        },
        {
          path: '/Market',
          name: 'Market',
          component: Market
        },
        {
          path: '/House',
          name: 'House',
          component: House
        }
      ]
    }
  ]
})
