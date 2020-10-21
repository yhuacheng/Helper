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
						<el-option value="" label="全部"></el-option>
						<el-option value="1" label="待处理"></el-option>
						<el-option value="2" label="提现成功"></el-option>
						<el-option value="3" label="提现失败"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="searchData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="infor" @click="handtakeModal">申请提现</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
		 ref='tableData'>
			<el-table-column type="index" label="#" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyNumber" label="流水号" align="center"></el-table-column>
			<el-table-column prop="RemoveMoeny" label="提现金额" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyTime" label="申请时间" align="center"></el-table-column>
			<el-table-column prop="BankAccount" label="银行账号" align="center"></el-table-column>
			<el-table-column prop="Bank" label="开户银行" align="center"></el-table-column>
			<el-table-column prop="BankName" label="开户名" align="center"></el-table-column>
			<el-table-column prop="State" label="状态" align="center">
				<template v-slot="scope">
					<span v-if="scope.row.State===1">处理中</span>
					<span class="success" v-if="scope.row.State===2">提现成功</span>
					<span class="danger" v-if="scope.row.State===3">提现失败</span>
				</template>
			</el-table-column>
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

		<!-- 提现 -->
		<el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal" width="30%">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-form-item label="提现金额" prop="money">
					<el-input v-model="editForm.money"></el-input>
				</el-form-item>
				<el-form-item label="银行账号" prop="account">
					<el-input v-model="editForm.account"></el-input>
				</el-form-item>
				<el-form-item label="开户银行" prop="bank">
					<el-input v-model="editForm.bank"></el-input>
				</el-form-item>
				<el-form-item label="开户名" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button type="primary" @click="addSubmit" :loading="btnLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import {
		takeMoneyList,
		takeMoneyAdd,
		moneyList
	} from '@/api/api'

	export default {
		name: 'takeMoney',
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
					time: ['', ''],
					state: ''
				},
				editForm: {
					money: '',
					account: '',
					bank: '',
					name: ''
				},
				rules: {
					money: [{
							required: true,
							message: '请输入提现金额',
							trigger: 'blur'
						},
						{
							pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
							message: '金额格式不正确',
							trigger: 'blur'
						}
					],
					account: [{
						required: true,
						message: '请输入提现账户',
						trigger: 'blur'
					}],
					bank: [{
						required: true,
						message: '请输入开户银行',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入开户名',
						trigger: 'blur'
					}]
				},
				balance: 0,
				allIn: 0,
				allOut: 0
			}
		},
		created() {
			this.getData()
			this.getBalanceData()
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
				takeMoneyList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//获取余额数据
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

			//打开提现弹窗
			handtakeModal() {
				let _this = this
				_this.editModal = true
				_this.title = '提现申请'
			},

			//提现新增
			addSubmit() {
				let _this = this
				_this.$refs.editForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							RemoveMoney: _this.editForm.money,
							BankAccount: _this.editForm.account,
							Bank: _this.editForm.bank,
							BankName: _this.editForm.name,
							Id: sessionStorage.getItem('userId')
						}
						takeMoneyAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeModal()
							_this.getData()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭提现弹窗
			closeModal() {
				let _this = this
				_this.editModal = false
				_this.btnLoading = false
				_this.$refs['editForm'].resetFields()
				_this.editForm = {
					money: '',
					account: '',
					bank: '',
					name: ''
				}
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
