import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'videos',
        name: 'videos',
        component: () => import('../views/Videos.vue'),
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('../views/Account.vue'),
      },
      {
        path: 'live',
        name: 'live',
        component: () => import('../views/Live.vue'),
      },
      {
        path: '/video/:videoId',
        name: 'video-player',
        component: () => import('../views/VideoPlayer.vue'),
        props: true // Isso permite que o componente use o videoId como uma prop
      }
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
