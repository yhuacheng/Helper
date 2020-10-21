<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="死因查询" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="90px" class="mt10" label-position="left">
					<el-form-item label="服务名称" prop="nameId">
						<el-select v-model="form.nameId" placeholder="请选择" @change="getInfoData">
							<el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="国家" prop="country">
						<el-select v-model="form.country" placeholder="请选择">
							<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="注册邮箱" prop="email">
						<el-input v-model="form.email" style="width: 217px;" placeholder="请输入注册邮箱"></el-input>
					</el-form-item>
					<el-form-item label="Seller ID" prop="sellerIdOrAsin" v-if="form.nameId=='' ||form.nameId==8 || form.nameId==9">
						<el-input v-model="form.sellerIdOrAsin" style="width: 217px;" placeholder="请输入Seller ID"></el-input>
					</el-form-item>
					<el-form-item label="ASIN码" prop="sellerIdOrAsin" v-if="form.nameId==10 || form.nameId==11">
						<el-input v-model="form.sellerIdOrAsin" style="width: 217px;" placeholder="请输入ASIN码"></el-input>
					</el-form-item>
					<el-form-item label="总价" prop="price">
						<span class="primary fz16 bold"><span v-if="!form.price">0</span>{{form.price}} 元</span>
					</el-form-item>
					<el-form-item>
						<span class="info f12">{{form.info}}</span>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSubmit" :loading="btnLoading">提交</el-button>
					</el-form-item>
				</el-form>
				<div class="my-modal" v-if="state==0">
					<div>
						<i class="el-icon-warning-outline"></i>
						<span class="ml10">尊敬的用户朋友，该功能临时暂停使用，若有恢复，我们将在第一时间开放，给您带来的不便敬请谅解！</span>
					</div>
				</div>
			</el-tab-pane>

			<el-tab-pane label="购买记录" name="second" class="mt10">
				<!--列表-->
				<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
				 ref='tableData'>
					<el-table-column type="index" label="#" align="center"></el-table-column>
					<el-table-column prop="ServiceName" label="服务名称" align="center"></el-table-column>
					<el-table-column prop="Countey" label="国家" align="center"></el-table-column>
					<el-table-column prop="RegisteredEmail" label="注册邮箱" align="center"></el-table-column>
					<el-table-column prop="SellerIdOrAsin" label="SellerId / ASIN" align="center"></el-table-column>
					<el-table-column prop="SubTime" label="提交时间" align="center"></el-table-column>
					<el-table-column prop="State" label="状态" align="center">
						<template v-slot="scope">
							<span v-if="scope.row.State===1">待确认</span>
							<span class="primary" v-if="scope.row.State===2">处理中</span>
							<span class="success" v-if="scope.row.State===3">成功</span>
							<span class="danger" v-if="scope.row.State===4">失败</span>
							<span class="warning" v-if="scope.row.State===5">已取消</span>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
					 :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
					 :total="total">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import {
		countryList,
		infoList,
		dieAdd,
		dieList
	} from '@/api/api'
	export default {
		name: 'dieSearch',
		data() {
			return {
				title: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				listLoading: false,
				btnLoading: false,
				countryData: [],
				tableData: [],
				selsData: [],
				selectId: '',
				activeName: 'first',
				form: {
					nameId: '',
					name: '',
					country: '',
					email: '',
					sellerIdOrAsin: '',
					price: '',
					info: ''
				},
				state: 1,
				typeData: [{
						value: 8,
						label: '查店铺封禁原因'
					}, {
						value: 9,
						label: '查店铺封禁申诉失败原因'
					},
					{
						value: 10,
						label: '查ASIN封禁原因'
					},
					{
						value: 11,
						label: '查ASIN封禁申诉失败原因'
					}
				],
				rules: {
					nameId: [{
						required: true,
						message: '请选择服务名称',
						trigger: 'blur'
					}],
					country: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入注册邮箱',
						trigger: 'blur'
					}],
					sellerIdOrAsin: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getData()
			this.getCountryData()
			this.getModalState()
		},
		methods: {
			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let params = {
					UserId: sessionStorage.getItem('userId'),
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				dieList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			// 获取国家数据
			getCountryData() {
				let _this = this
				let params = {}
				countryList(params).then(res => {
					_this.countryData = res
				}).catch((e) => {})
			},

			//获取死因查询模块状态
			getModalState() {
				let _this = this
				let params = {
					ModularId: 7
				}
				infoList(params).then(res => {
					_this.state = res.State
				}).catch((e) => {})
			},

			//获取价格描述等信息(模块为死因查询的子模块，模块ID为8、9、10、11)
			getInfoData() {
				let _this = this
				let nameId = _this.form.nameId
				let typeData = _this.typeData
				for (const x in typeData) {
					if (nameId == typeData[x].value) {
						_this.form.name = typeData[x].label
					}
				}
				let params = {
					ModularId: nameId
				}
				infoList(params).then(res => {
					_this.form.price = res.Price
					_this.form.info = res.Remark
				}).catch((e) => {})
			},

			//添加
			addSubmit() {
				let _this = this
				_this.$refs.form.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							ServiceName: _this.form.name,
							CountryId: _this.form.country,
							RegisteredEmail: _this.form.email,
							SellerIdOrASIN: _this.form.sellerIdOrAsin,
							Price: _this.form.price,
						}
						dieAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeForm()
							_this.getData()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//清空form数据
			closeForm() {
				let _this = this
				_this.form.nameId = ''
				_this.form.name = ''
				_this.form.country = ''
				_this.form.email = ''
				_this.form.sellerIdOrAsin = ''
				_this.form.price = ''
				_this.form.info = ''
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
	};
</script>
