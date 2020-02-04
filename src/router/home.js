const routes = [
  {
    path: '/login',
    meta: {title: '登录'},
    component: () => import(/* webpackChunkName: "login" */ '@/views/web/login/Index.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: {title: '文章列表', keepAlive: true},
    component: () => import(/* webpackChunkName: "home" */ '@/views/web/home/Index.vue')
  },
  {
    path: '/structure',
    name: 'structure',
    meta: {title: '目录', keepAlive: true},
    component: () => import(/* webpackChunkName: "structure" */ '@/views/web/structure/Index.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: '关于我'},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/web/article/Index.vue')
  },
  {
    path: '/archives',
    name: 'archives',
    meta: {title: '归档', keepAlive: true},
    component: () => import(/* webpackChunkName: "archives" */ '../views/web/archives/Index.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    meta: {title: '分类'},
    component: () => import(/* webpackChunkName: "about" */ '../views/web/categories/Index.vue')
  },
  {
    path: '/categories/:name',
    name: 'categories-type',
    meta: {title: '具名分类'},
    component: () => import(/* webpackChunkName: "categories" */ '../views/web/categories/Index.vue')
  },
  {
    path: '/tags/:name',
    name: 'tags',
    meta: {title: '具名标签'},
    component: () => import(/* webpackChunkName: "tags" */ '../views/web/tags/Index.vue')
  },
  {
    path: '/article/:id',
    name: 'article',
    meta: {title: '文章'},
    component: () => import(/* webpackChunkName: "article" */ '../views/web/article/Index.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
]
export default routes
