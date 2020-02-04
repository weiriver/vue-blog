import Vue from 'vue'
import VueRouter from 'vue-router'
import MainLaout from '@/layout/web/Index'
import AdminLaout from '@/layout/admin/Index'
import adminRoutes from './admin'
import homeRoutes from './home'
import store from '@/store/index'

// 路由重复点击异常处理
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
  // 后台管理
  {
    path: '/admin',
    name: 'admin',
    component: AdminLaout,
    children: adminRoutes
  },
  // 博客主要展示页面
  {
    path: '/',
    name: 'home',
    meta: {title: '首页'},
    component: MainLaout,
    children: homeRoutes
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched[0].name == 'admin') {
    if (store.state.role == 1) {
      next()
    } else {
      next({
        path: '/home'
      })
    }
  } else {
    next()
  }
})

export default router
