import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Memberlist from '../views/Memberlist.vue'
import Record from '../views/Memberlist.vue'
import Scheduler from '../views/Scheduler.vue'
import Meetinglog from '../views/Meetinglog.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/memberlist',
    name: 'memberlist',
    component: Memberlist
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
    path: '/meetinglog',
    name: 'meetinglog',
    component: Meetinglog
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
