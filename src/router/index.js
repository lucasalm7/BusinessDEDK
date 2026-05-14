import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './HomePage.vue'
import Media from './Media.vue'
import Network from './Network.vue'
import About from './About.vue'
import Events from './Events.vue'
import Advisors from './Advisors.vue'
import BecomeAMember from './BecomeAMember.vue'
import BorderRegion from './BorderRegion.vue'
import Blog from './Blog.vue'
import Photogallery from './Photogallery.vue'
import Resources from './Resources.vue'
import MediaSubPage from '../subpages/MediaSubPage.vue'
import NetworkSubPage from '../subpages/NetworkSubPage.vue';
import BlogSubPage from '../subpages/BlogSubPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/media',
    name: 'Media',
    component: Media
  },
  {
    path: '/network',
    name: 'Network',
    component: Network
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/advisors',
    name: 'Advisors',
    component: Advisors
  },
  {
    path: '/become-a-member',
    name: 'BecomeAMember',
    component: BecomeAMember
  },
  {
    path: '/border-region',
    name: 'BorderRegion',
    component: BorderRegion
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
  path: '/blog/:slug',
  name: 'BlogSubPage',
  component: BlogSubPage
},
  {
    path: '/photogallery',
    name: 'Photogallery',
    component: Photogallery
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  },
  {
  path: '/home',
  redirect: '/'
  },
  {
  path: '/video/:slug',
  name: 'VideoDetail',
  component: MediaSubPage
},
{
  path: '/network/:id',
  name: 'NetworkDetail',
  component: NetworkSubPage
}
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router