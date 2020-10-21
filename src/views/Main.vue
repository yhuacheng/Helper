<template>
	<section class="main-box">
		<el-card>
			<div slot="header">
				<span>钱包</span>
			</div>
			<div class="card-box1">
				<div class="item">
					<p>余额</p>
					<h2 class="primary">{{balance}}</h2>
				</div>
				<div class="item">
					<p>总收入</p>
					<h2 class="success">{{allIn}}</h2>
				</div>
				<div class="item">
					<p>总支出</p>
					<h2 class="danger">{{allOut}}</h2>
				</div>
				<div class="item btn-item">
					<el-button type="success" size="mini" @click="payModal=true">充值</el-button>
				</div>
				<div class="item btn-item">
					<el-button type="danger" size="mini" @click="$router.push('/takeMoney')">提现</el-button>
				</div>
				<div class="item btn-item">
					<el-button type="primary" size="mini" @click="$router.push('/moneyDetails')">账单</el-button>
				</div>
			</div>
		</el-card>

		<el-card class="card-box2">
			<div slot="header">
				<span>公告</span>
			</div>
			<div>
				<!--公告列表-->
				<el-table :data="tableNotice" v-loading="listLoading" style="width: 100%;height: 400px;" id="tableNotice" ref='tableNotice'>
					<el-table-column type="index" label="#" align="center"></el-table-column>
					<el-table-column prop="Title" label="公告标题" align="center">
						<template v-slot="scope">
							<el-link type="primary" :underline="false" @click="showNotice(scope.$index,scope.row)">{{scope.row.Title}}</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="AddTime" label="发布时间" align="center"></el-table-column>
				</el-table>
			</div>
		</el-card>

		<el-card class="card-box3">
			<div slot="header">
				<span>FAQ</span>
			</div>
			<div style="height: 402px;">
				<el-collapse accordion>
					<el-collapse-item title="【评论助手】能为您做什么？" name="1">
						<div>"评论助手"是一款可以查询亚马逊买家真实邮箱的工具。在这里，您可以通过买家的站外真实邮箱消差评、邀测评、催好评、做营销等等</div>
					</el-collapse-item>
					<el-collapse-item title="【链接查邮箱】是什么？" name="2">
						<div>“链接查邮箱”，可以获取亚马逊留评买家的联系方式，包括：真实邮箱、姓名，等等。帮助卖家，更安全更高效的联系买家，沟通差评问题。</div>
						<div>通过什么方式查询？</div>
						<div>可以通过Review 链接或Review ID进行查询。</div>
						<div>时效性如何？</div>
						<div>查询预计等待1分钟，个别情况下可能需要2-3天，查询成功后即可点击购买。你可以在下方的“已提交查询”中查看查询情况。</div>
					</el-collapse-item>
					<el-collapse-item title="【订单查邮箱】是什么？" name="3">
						<div>“订单查邮箱”，可以获取订单号对应的买家联系方式，包括：真实邮箱、姓名，等等。帮助卖家，更安全更高效的联系买家，索取高质量好评。</div>
						<div>通过什么方式查询？</div>
						<div>可以通过订单号+ASIN，查询你们店铺出单的买家联系方式。</div>
						<div>时效性如何？</div>
						<div>目前系统会在2个工作日左右返回查询结果，你可以在“查询记录”中查看查询情况。</div>
					</el-collapse-item>
					<el-collapse-item title="【评论助手】如何查看消费记录？" name="6">
						<div>点击首页面板的“账单”按钮，或者从“提现管理”-->"我的账单"进行查看</div>
					</el-collapse-item>
					<el-collapse-item title="【评论助手】可以在不同电脑登录使用吗？" name="4">
						<div>可以。评论助手不限任何电脑或 IP 登录使用，且可以建立多账号，分别管理使用。</div>
					</el-collapse-item>
					<el-collapse-item title="【评论助手】如何修改账号密码？" name="5">
						<div>将鼠标移到右上角的昵称上，你将看到“修改密码”的选项。</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</el-card>

		<!--充值二维码-->
		<el-dialog :visible.sync="payModal" width="30%">
			<div class="txt-c">
				<img src="../assets/image/pay.png">
			</div>
		</el-dialog>

		<!--公告查看-->
		<el-dialog :visible.sync="noticeModal" width="70%">
			<el-form :model="viewNotice" ref="viewNotice" style="padding: 20px;">
				<el-form-item>
					<h3 class="txt-c">{{viewNotice.title}}</h3>
				</el-form-item>
				<el-form-item>
					<span v-html="viewNotice.content"></span>
				</el-form-item>
				<el-form-item>
					<p class="txt-r">{{viewNotice.time}}</p>
				</el-form-item>
			</el-form>
		</el-dialog>

	</section>
</template>

<script>
	import {
		moneyList,
		noticeList
	} from '@/api/api'

	export default {
		name: 'Main',
		data() {
			return {
				listLoading: false,
				tableNotice: [],
				viewNotice: {},
				balance: 0,
				allIn: 0,
				allOut: 0,
				noticeModal: false,
				payModal: false
			}
		},
		created() {
			this.getBalanceData()
			this.getNoticeData()
		},
		methods: {
			// 获取余额、总收入、总支出金额
			getBalanceData() {
				let _this = this
				let params = {
					UserId: sessionStorage.getItem('userId'),
					Statetime: '',
					Endtime: '',
					State: '0',
					pageNum: 1,
					pagesize: 100000000
				}
				moneyList(params).then(res => {
					_this.balance = res.Account[0].AccountBalance
					_this.allIn = res.Account[0].AccumulatedIncome
					_this.allOut = res.Account[0].AccumulatedExpenditure
				}).catch((e) => {})
			},

			// 获取公告数据
			getNoticeData() {
				let _this = this
				_this.listLoading = true
				let params = {}
				noticeList(params).then(res => {
					_this.listLoading = false
					_this.tableNotice = res
				}).catch((e) => {})
			},
			//查看公告
			showNotice(index, row) {
				let _this = this
				_this.viewNotice = {
					title: row.Title,
					content: row.Contenting,
					time: row.AddTime
				}
				_this.noticeModal = true
			}
		}
	}
</script>
