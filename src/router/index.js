import Vue from 'vue'
import VueRouter from 'vue-router'
import adminLoginView from '../views/adminLoginView.vue'
import adminHomeView from '../views/adminHomeView.vue'
import welcome from '../components/welcome.vue'
import userListView from '../components/userListView.vue'
import productsCatalogView from '../components/productsCatalogView.vue'
import userLoginRegisterView from '../views/userLoginRegisterView.vue'
import userLogin from '../components/userLogin.vue'
import homeView from '../views/homeView.vue'
import productView from '../components/productView.vue'
import releaseProductView from '../components/releaseProductView.vue'
import productInfoView from '../components/productInfoView.vue'
import userRegisterView from '../components/userRegisterView.vue'
import productWantedView from '../components/productWantedView.vue'
import productWantedListView from '../components/productWantedListView.vue'
import userInfoView from '../components/userInfoView.vue'
import updatePassView from '../components/updatePassView.vue'

Vue.use(VueRouter)


const router = new VueRouter({

  routes: [{
      path: '/adminLoginView',
      component: adminLoginView
    },
    {
      path: '/adminHomeView',
      component: adminHomeView,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: welcome
        },
        {
          path: '/userList',
          component: userListView
        },
        {
          path: '/productsCatalog',
          component: productsCatalogView
        }
      ]
    },
    {
      path: '/userLoginRegisterView',
      component: userLoginRegisterView,
      children: [{
          path: '/userLogin',
          component: userLogin
        },
        {
          path: '/userRegister',
          component: userRegisterView
        }
      ]
    },
    {
      path: '/home',
      redirect: '/productList',
      component: homeView,
      children: [{
          path: '/productList',
          component: productView
        },
        {
          path: '/releaseProduct',
          component: releaseProductView
        },
        {
          path: '/productInfo/',
          name: 'productInfo',
          component: productInfoView
        },
        {
          path: '/productWanted',
          component: productWantedView
        },
        {
          path: '/productWantedList',
          component: productWantedListView
        },
        {
          path: '/userInfo',
          component: userInfoView
        },
        {
          path: '/updatePass',
          component: updatePassView
        }
      ]
    }
  ]
})

export default router