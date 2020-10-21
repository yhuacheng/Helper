import {
	get,
	post
} from './http'

export const login = (params) => post('/api/Login/UserLogin', params) //登录

export const register = (params) => post('/api/AroundUser/Register', params) //注册
export const phoneCode = (params) => post('/api/AroundUser/zCSend', params) //获取手机验证码

export const editPassword = (params) => post('/api/AroundUser/ResetPwd', params) //修改密码

export const noticeList = (params) => get('/api/Notice/GetNotice', params) //公告

export const takeMoneyList = (params) => get('/api/DrawMoney/GetUserByWithdrawal', params) //提现列表
export const takeMoneyAdd = (params) => post('/api/DrawMoney/UserWithdrawal', params) //提现新增

export const moneyList = (params) => get('/api/AroundUserFinanceLog/GetPay', params) //我的账单

export const countryList = (params) => get('/api/Country/GetCountryList', params) //国家数据

export const infoList = (params) => get('/api/Usubmenu/GetSubmenu', params) //获取服务名称价格描述等信息

export const delBadAdd = (params) => post('/api/BadEvaluate/DeleteBadEvaluate', params) //删差评
export const delBadList = (params) => get('/api/BadEvaluate/GetBadEvaluate', params) //删差评列表

export const noBadAdd = (params) => post('/api/HomePagNoBadEvaluate/AddPagNoBadEvaluate', params) //首页无差评
export const noBadList = (params) => get('/api/HomePagNoBadEvaluate/GetPagNoBadEvaluate', params) //首页无差评列表

export const keyToIndexAdd = (params) => post('/api/KeyWordUpHomePag/AddKeyWordUpHomePag', params) //关键词上首页
export const keyToIndexList = (params) => get('/api/KeyWordUpHomePag/GetKeyWordUpHomePag', params) //关键词上首页列表

export const keyReportAdd = (params) => post('/api/AsinKeyWord/AddAsinKeyWord', params) //Asin关键词报告
export const keyReportList = (params) => get('/api/AsinKeyWord/GetAsinKeyWord', params) //Asin关键词报告列表

export const shopCheckAdd = (params) => post('/api/ShopReport/AddShopReport', params) //店铺体检报告
export const shopCheckList = (params) => get('/api/ShopReport/GetShopReport', params) //店铺体检报告列表

export const shopCPCAdd = (params) => post('/api/ShopCpcReport/AddShopCpcReport', params) //店铺CPC报告
export const shopCPCList = (params) => get('/api/ShopCpcReport/GetShopCpcReport', params) //店铺CPC报告列表

export const dieAdd = (params) => post('/api/BugQuery/AddBugQuery', params) //死亡原因
export const dieList = (params) => get('/api/BugQuery/GetBugQuery', params) //死亡原因列表

export const linkSearchAdd = (params) => post('/api/LinkMailboxQuery/AddLinkMailboxQuery', params) //链接查邮箱
export const linkSearchList = (params) => get('/api/LinkMailboxQuery/GetLinkMailboxQuery', params) //链接查邮箱列表

export const orderSearchAdd = (params) => post('/api/OrderMailboxQuery/AddOrderMailboxQuery', params) //订单查邮箱
export const orderSearchList = (params) => get('/api/OrderMailboxQuery/GetOrderMailboxQuery', params) //订单查邮箱列表

export const addBuyAdd = (params) => post('/api/AddShopCart/AddtoShopCart', params) //加购
export const addBuyList = (params) => get('/api/AddShopCart/GetAddShopCart', params) //加购列表

export const wishAdd = (params) => post('/api/Wishs/AddWishs', params) //心愿
export const wishList = (params) => get('/api/Wishs/GetWishs', params) //心愿列表

export const likedHateAdd = (params) => post('/api/Different/AddDifferent', params) //点赞点踩添加(点赞点踩共用)
export const likedHateList = (params) => get('/api/Different/GetDifferent', params) //点赞点踩列表(点赞点踩共用)

export const commentAdd = (params) => post('/api/Evaluate/AddEvaluate', params) //评论
export const commentList = (params) => get('/api/Evaluate/GetEvaluate', params) //评论列表
