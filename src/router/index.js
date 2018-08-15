import Vue from 'vue'
import Router from 'vue-router'
// import Rank from 'components/rank/rank'
// import Recommend from 'components/recommend/recommend'
// import Search from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetails from 'components/singer-details/singer-details'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

Vue.use(Router)

const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}

const Rank = (resolve) => {
  import('components/rank/rank').then((rank) => {
    resolve(rank)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((search) => {
    resolve(search)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((singer) => {
    resolve(singer)
  })
}

const SingerDetails = (resolve) => {
  import('components/singer-details/singer-details').then((singerdetails) => {
    resolve(singerdetails)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((disc) => {
    resolve(disc)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((toplist) => {
    resolve(toplist)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((usercenter) => {
    resolve(usercenter)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [{
        path: ':id',
        name: 'top-list',
        component: TopList
      }]
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [{
        path: ':id',
        name: 'disc',
        component: Disc
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetails
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'singer-details',
          component: SingerDetails
        }
      ]
    },
    {
      path: '/user',
      name: 'user-center',
      component: UserCenter
    }
  ]
})
