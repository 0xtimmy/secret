import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Scrapbook from '../views/Scrapbook.vue'
import AddPhoto from '../views/AddPhoto.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/scrapbook/:pagenum',
      name: 'scrapbook',
      component: Scrapbook
    },
    { path: "/scrapbook", redirect: "/scrapbook/0" },
    {
      path: '/add',
      name: 'add',
      component: AddPhoto
    }
  ]
})

export default router
