import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Memberlist from '../views/member/Memberlist.vue'
import Record from '../views/Record.vue'
import Scheduler from '../views/Scheduler.vue'
import Meetinglog from '../views/Meetinglog.vue'
import MemberManager from '../views/member/MemberManager'
import Login from '../views/Login.vue'
import DashBoard from '../views/dashboard.vue'
import { store } from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name : 'Home',
    component: HomeView,
    props: true,
    children: [
      {
        path: '',
        name : 'DashBoard',
        component : DashBoard,
        porps: {
          memberListProps : [],
          mercenaryListProps : []
        }
      },
      {
        path: '/memberlist',
        name: 'memberlist',
        component: Memberlist,
        props: {
          memberListProps : [],
        }
      },
      {
        path: '/adminllist',
        name: 'adminlist',
        component: MemberManager,
        props: {
          managerListProps : [],
        }
      },
      {
        path: '/record',
        name: 'record',
        component: Record,
        props: {
          memberListProps : [],
        }
      },
      {
        path: '/scheduler',
        name: 'scheduler',
        component: Scheduler
      },
      {
        path: '/notice',
        name: 'notice',
        component: Meetinglog
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(!store.state.userInfo && to.path !== '/') {
    if(confirm('올바른 접근이 아닙니다. 사이트 이용을 위해 로그인 해 주세요.')) {
      next({
        path: '/'
      })
    } else {
      next(false)
    }
  } else {
    next()
  }
})

export default router
