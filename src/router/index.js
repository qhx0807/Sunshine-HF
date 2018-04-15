import Vue from 'vue'
import Router from 'vue-router'

const  Login = r => require.ensure( [], () => r (require('@/components/Login')))
const  Main = r => require.ensure( [], () => r (require('@/components/Main')))
const  Message = r => require.ensure( [], () => r (require('@/components/Message')))
const  Market = r => require.ensure( [], () => r (require('@/components/Market')))
const  House = r => require.ensure( [], () => r (require('@/components/House')))
const  Log = r => require.ensure( [], () => r (require('@/components/Log')))

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
        },
        {
          path: '/Log',
          name: 'Log',
          component: Log
        }
      ]
    }
  ]
})
