import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import testComponent from '../components/testComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/posts',
    name: 'Posts',
    component: testComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router