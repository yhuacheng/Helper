<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-form-item>
					<el-date-picker size="small" v-model="searchForm.time" :unlink-panels='true' type="datetimerange" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.state" placeholder="状态" size="small">
						<el-option value="0" label="全部"></el-option>
						<el-option value="2" label="收入"></el-option>
						<el-option value="1" label="支出"></el-option>
						<el-option value="3" label="退款"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="searchData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
		 ref='tableData'>
			<el-table-column type="index" label="#" align="center"></el-table-column>
			<el-table-column prop="BusinessNumber" label="流水号" align="center"></el-table-column>
			<el-table-column prop="TransactionType" label="收支类型" align="center">
				<template v-slot="scope">
					<span class="success" v-if="scope.row.PaymentState===1">充值收入</span>
					<span class="danger" v-if="scope.row.PaymentState===2">扣款支出</span>
					<span class="danger" v-if="scope.row.PaymentState===3">提现支出</span>
					<span class="danger" v-if="scope.row.PaymentState===4">首页无差评支出</span>
					<span class="danger" v-if="scope.row.PaymentState===5">关键词上首页支出</span>
					<span class="danger" v-if="scope.row.PaymentState===6">ASIN关键词报告支出</span>
					<span class="danger" v-if="scope.row.PaymentState===7">店铺体验报告支出</span>
					<span class="danger" v-if="scope.row.PaymentState===8">店铺CPC报告支出</span>
					<span class="danger" v-if="scope.row.PaymentState===9">死因查询支出</span>
					<span class="danger" v-if="scope.row.PaymentState===10">删差评支出</span>
					<span class="warning" v-if="scope.row.PaymentState===11">首页无差评退款</span>
					<span class="warning" v-if="scope.row.PaymentState===12">关键词上首页退款</span>
					<span class="warning" v-if="scope.row.PaymentState===13">ASIN关键词退款</span>
					<span class="warning" v-if="scope.row.PaymentState===14">店铺体验报告退款</span>
					<span class="warning" v-if="scope.row.PaymentState===15">店铺CPC体验报告退款</span>
					<span class="warning" v-if="scope.row.PaymentState===16">死因查询退款</span>
					<span class="danger" v-if="scope.row.PaymentState===17">链接查邮箱支出</span>
					<span class="warning" v-if="scope.row.PaymentState===18">链接查邮箱退款</span>
					<span class="danger" v-if="scope.row.PaymentState===19">订单查邮箱支出</span>
					<span class="warning" v-if="scope.row.PaymentState===20">订单查邮箱退款</span>
					<span class="danger" v-if="scope.row.PaymentState===21">加购总额支出</span>
					<span class="danger" v-if="scope.row.PaymentState===22">心愿单总额支出</span>
					<span class="danger" v-if="scope.row.PaymentState===23">点赞支出</span>
					<span class="danger" v-if="scope.row.PaymentState===24">点踩支出</span>
					<span class="danger" v-if="scope.row.PaymentState===25">上评总额支出</span>
				</template>
			</el-table-column>
			<el-table-column prop="TransactionAmount" label="金额" align="center"></el-table-column>
			<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
			<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<span style="position: relative;top: 5px;color: #606266;">
				<span>余额：{{balance}}</span>
				<span style="margin-left: 30px;">总收入：{{allIn}}</span>
				<span style="margin-left: 30px;">总支出：{{allOut}}</span>
			</span>
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
	import {
		moneyList,
	} from '@/api/api'

	export default {
		name: 'moneyDetails',
		data() {
			return {
				title: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				doType: '',
				editModal: false,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				selsData: [],
				selectId: '',
				searchForm: {
					time: [],
					state: '0'
				},
				balance: 0,
				allIn: 0,
				allOut: 0
			}
		},
		created() {
			this.getData()
		},
		methods: {
			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					UserId: sessionStorage.getItem('userId'),
					Statetime: time1,
					Endtime: time2,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				moneyList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
					_this.balance = res.Account[0].AccountBalance
					_this.allIn = res.Account[0].AccumulatedIncome
					_this.allOut = res.Account[0].AccumulatedExpenditure
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
			},

			//选中数据
			selsChange(selsData) {
				this.selsData = selsData
			},

			//翻页
			handleSizeChange(val) {
				let _this = this
				_this.pageSize = val
				_this.getData()
			},
			//跳转
			handleCurrentChange(val) {
				let _this = this
				_this.pageNum = val
				_this.getData()
			}

		}
	}
</script>
