import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Memberlist from '../views/member/Memberlist.vue'
import Record from '../views/Record.vue'
import Scheduler from '../views/Scheduler.vue'
import Meetinglog from '../views/Meetinglog.vue'
import MemberManager from '../views/member/MemberManager'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/memberlist',
    name: 'memberlist',
    component: Memberlist
  },
  {
    path: '/adminllist',
    name: 'adminlist',
    component: MemberManager
  },
  {
    path: '/record',
    name: 'record',
    component: Record
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
