import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/index',
			name: '',
			hidden: true
		},
		{
			path: '/index',
			component: () => import('./views/Index.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/login',
			component: () => import('./views/Login.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/404',
			component: () => import('./views/404.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '首页面板',
			iconCls: 'el-icon-monitor',
			children: [{
				path: '/main',
				component: () => import('./views/Main.vue'),
				name: '我的主页'
			}]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '邮箱查询',
			iconCls: 'el-icon-search',
			children: [{
					path: '/linkSearch',
					component: () => import('./views/searchEmail/linkSearch.vue'),
					name: '链接查邮箱'
				},
				{
					path: '/orderSearch',
					component: () => import('./views/searchEmail/orderSearch.vue'),
					name: '订单查邮箱'
				},
			]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '增值服务',
			iconCls: 'el-icon-circle-plus-outline',
			children: [{
					path: '/delBad',
					component: () => import('./views/addedService/delBad.vue'),
					name: '删差评'
				},
				{
					path: '/noBad',
					component: () => import('./views/addedService/noBad.vue'),
					name: '首页无差评'
				},
				{
					path: '/keyToIndex',
					component: () => import('./views/addedService/keyToIndex.vue'),
					name: '关键词上首页'
				},
				{
					path: '/keyReport',
					component: () => import('./views/addedService/keyReport.vue'),
					name: 'ASIN关键词报告'
				},
				{
					path: '/shopCheck',
					component: () => import('./views/addedService/shopCheck.vue'),
					name: '店铺体检报告'
				},
				{
					path: '/shopCPC',
					component: () => import('./views/addedService/shopCPC.vue'),
					name: '店铺CPC报告'
				},
				{
					path: '/dieSearch',
					component: () => import('./views/addedService/dieSearch.vue'),
					name: '死因查询'
				},
				{
					path: '/addBuy',
					component: () => import('./views/addedService/addBuy.vue'),
					name: '加购'
				},
				{
					path: '/wish',
					component: () => import('./views/addedService/wish.vue'),
					name: '心愿单'
				},
				{
					path: '/liked',
					component: () => import('./views/addedService/liked.vue'),
					name: '点赞'
				},
				{
					path: '/hate',
					component: () => import('./views/addedService/hate.vue'),
					name: '点踩'
				},
				{
					path: '/comment',
					component: () => import('./views/addedService/comment.vue'),
					name: '评论'
				}
			]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '提现管理',
			iconCls: 'el-icon-bank-card',
			children: [{
					path: '/takeMoney',
					component: () => import('./views/moneyManage/takeMoney.vue'),
					name: '提现列表'
				},
				{
					path: '/moneyDetails',
					component: () => import('./views/moneyManage/moneyDetails.vue'),
					name: '我的账单'
				},
			]
		},
		{
			path: '*',
			hidden: true,
			redirect: {
				path: '/404'
			}
		}
	]
})