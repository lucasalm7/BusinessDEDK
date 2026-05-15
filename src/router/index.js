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
import EventSubPage from '../subpages/EventSubPage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Business DE/DK - Home',
      breadcrumgb: [
        { name: 'Home', link: '/' }
      ]
    }
  },
  {
    path: '/media',
    name: 'Media',
    component: Media,
    meta: {
      title: 'Business DE/DK - Media',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Media', link: '/media' }
      ]
    }
  },
  {
    path: '/network',
    name: 'Network',
    component: Network,
    meta: {
      title: 'Business DE/DK - Network',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Network', link: '/network' }
      ]
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'Business DE/DK - About',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' }
      ]
    }
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
    meta: {
      title: 'Business DE/DK - Events',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Events', link: '/events' }
      ]
    }
  },
  {
    path: '/events/:slug',
    name: 'EventSubPage',
    component: EventSubPage,
    meta: {
      title: 'Business DE/DK - Event Details',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Events', link: '/events' },
        { name: 'Event Details', link: '' }
      ]
    }
  },
  {
    path: '/advisors',
    name: 'Advisors',
    component: Advisors,
    meta: {
      title: 'Business DE/DK - Advisors',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Advisors', link: '/advisors' }
      ]
    }
  },
  {
    path: '/become-a-member',
    name: 'BecomeAMember',
    component: BecomeAMember,
    meta: {
      title: 'Business DE/DK - Become a Member',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Become a Member', link: '/become-a-member' }
      ]
    }
  },
  {
    path: '/border-region',
    name: 'BorderRegion',
    component: BorderRegion,
    meta: {
      title: 'Business DE/DK - Border Region',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Border Region', link: '/border-region' }
      ]
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: 'Business DE/DK - Blog',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Blog', link: '/blog' }
      ]
    }
  },
  {
  path: '/blog/:slug',
  name: 'BlogSubPage',
  component: BlogSubPage,
  meta: {
    title: 'Business DE/DK - Blog Post',
    breadcrumb: [
      { name: 'Home', link: '/' },
      { name: 'Blog', link: '/blog' },
      { name: 'Blog Post', link: '' }
    ]
  }
},
  {
    path: '/photogallery',
    name: 'Photogallery',
    component: Photogallery,
    meta: {
      title: 'Business DE/DK - Photo Gallery',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Photo Gallery', link: '/photogallery' }
      ]
    }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources,
    meta: {
      title: 'Business DE/DK - Resources',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Resources', link: '/resources' }
      ]
    }
  },
  {
  path: '/home',
  redirect: '/'
  },
  {
  path: '/video/:slug',
  name: 'VideoDetail',
  component: MediaSubPage,
  meta: {
    title: 'Business DE/DK - Video Details',
    breadcrumb: [
      { name: 'Home', link: '/' },
      { name: 'Media', link: '/media' },
      { name: 'Video Details', link: '' }
    ]
  }
},
{
  path: '/network/:id',
  name: 'NetworkDetail',
  component: NetworkSubPage,
  meta: {
    title: 'Business DE/DK - Network Details',
    breadcrumb: [
      { name: 'Home', link: '/' },
      { name: 'Network', link: '/network' },
      { name: 'Network Details', link: '' }
    ]
  }
},
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFoundPage
}
]



const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router