const routes = [
  {
    path: 'article/manager',
    name: 'article-manager',
    meta: {title: '文章列表', keepAlive: true},
    component: () => import(/* webpackChunkName: "article-manager" */ '@/views/admin/article/manager/Index.vue')
  },
  {
    path: 'article/edit',
    name: 'article-add',
    meta: {title: '文章新增'},
    component: () => import(/* webpackChunkName: "article-manager" */ '@/views/admin/article/edit/Index.vue')
  },
  {
    path: 'article/edit/:id',
    name: 'article-edit',
    meta: {title: '文章修改'},
    component: () => import(/* webpackChunkName: "article-manager" */ '@/views/admin/article/edit/Index.vue')
  },
  {
    path: 'user',
    name: 'user-manager',
    meta: {title: '用户管理'},
    component: () => import(/* webpackChunkName: "user-manager" */ '@/views/admin/user/manager/Index.vue')
  },
  {
    path: 'tree',
    name: 'tree-manager',
    meta: {title: '目录管理', keepAlive: true},
    component: () => import(/* webpackChunkName: "tree-manager" */ '@/views/admin/tree/manager/Index.vue')
  }
]
export default routes
