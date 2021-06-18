import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('../views/Home.vue');
const VManage = () => import('../views/VManage.vue');
const RManage = () => import('../views/RManage.vue');
const DrivingRecord = () => import('../views/DrivingRecord.vue');
const Login = () => import('../views/Login.vue');
const DriverManage = () => import('../views/DriverManage.vue');
const Scheduling = () => import('../views/Scheduling.vue');
const Register = () => import('../views/Register');
const SelfCenter = () => import('../views/SelfCenter');
const Chat = () => import('../views/Chat.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/VManage',
    name: 'VManage',
    component: VManage
  },
  {
    path: '/RManage',
    name: 'RManage',
    component: RManage
  },
  {
    path: '/DrivingRecord',
    name: 'DrivingRecord',
    component: DrivingRecord
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/DriverManage',
    name: 'DriverManage',
    component: DriverManage
  },
  {
    path: '/Scheduling',
    name: Scheduling,
    component: Scheduling
  },
  {
    path: '/Register',
    name: Register,
    component: Register
  },
  {
    path: '/SelfCenter',
    name: SelfCenter,
    component: SelfCenter
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
