<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="心愿单" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="80px" class="mt10" label-position="left">
					<el-row>
						<el-col :span="8">
							<el-form-item label="国家" prop="country">
								<el-select v-model="form.country" placeholder="请选择">
									<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="店铺名" prop="shop">
								<el-input v-model="form.shop" style="width: 217px;" placeholder="请输入店铺名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="ASIN" prop="asin">
								<el-input v-model="form.asin" style="width: 217px;" placeholder="请输入ASIN"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="关键词" prop="word">
								<el-input v-model="form.word" style="width: 217px;" placeholder="请输入关键词"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="数量" prop="num">
								<el-input v-model="form.num" style="width: 217px;" placeholder="请输入数量"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="产品位置" prop="position">
								<el-input v-model="form.position" placeholder="请输入产品位置"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="备注信息" prop="remark">
						<el-input type="textarea" v-model="form.remark" rows="5" placeholder="请输入备注信息" style="width: 500px;"></el-input>
					</el-form-item>
					<el-form-item label="服务名称" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">产品加入心愿单，增加人气。</p>
						</el-card>
					</el-form-item>
					<el-form-item label="价格" prop="price">
						<span class="primary fz16 bold"><i class="el-icon-loading" v-if="!form.price"></i>{{form.price}} 元/个</span>
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

			<el-tab-pane label="下单记录" name="second" class="mt10">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="searchForm">
						<el-form-item>
							<el-input size="small" v-model="searchForm.keyword" placeholder="输入 ASIN / 店铺 查询"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="searchForm.state" placeholder="状态" size="small">
								<el-option value="0" label="全部状态"></el-option>
								<el-option value="1" label="待确认"></el-option>
								<el-option value="2" label="处理中"></el-option>
								<el-option value="3" label="处理完毕"></el-option>
								<el-option value="4" label="已取消"></el-option>
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
					<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
					<el-table-column prop="ShopId" label="店铺" align="center"></el-table-column>
					<el-table-column prop="ASIN" label="ASIN" align="center"></el-table-column>
					<el-table-column prop="KeyWord" label="关键词" align="center"></el-table-column>
					<el-table-column prop="Number" label="数量" align="center"></el-table-column>
					<el-table-column prop="Productlocation" label="产品位置" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Remarks" label="备注" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Price" label="单价" align="center"></el-table-column>
					<el-table-column prop="AddTimes" label="提交时间" align="center"></el-table-column>
					<el-table-column prop="Actual" label="完成数量" align="center"></el-table-column>
					<el-table-column prop="State" label="状态" align="center">
						<template v-slot="scope">
							<span v-if="scope.row.State===1">待确认</span>
							<span class="primary" v-if="scope.row.State===2">处理中</span>
							<span class="success" v-if="scope.row.State===3">处理完毕</span>
							<span class="danger" v-if="scope.row.State===4">已取消</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template v-slot="scope">
							<el-link type="primary" :underline="false" :href="$IMGURL+scope.row.Images" v-if="scope.row.State===3 && scope.row.Images">
								<el-button size="small" type="primary">下载截图</el-button>
							</el-link>
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
		wishAdd,
		wishList
	} from '@/api/api'
	export default {
		name: 'wish',
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
				searchForm: {
					keyword: '',
					state: '0'
				},
				form: {
					country: '',
					shop: '',
					asin: '',
					word: '',
					position: '',
					remark: '',
					num: '',
					name: '',
					price: '',
					info: ''
				},
				state: 1,
				rules: {
					country: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					shop: [{
						required: true,
						message: '请输入店铺名称',
						trigger: 'blur'
					}],
					asin: [{
						required: true,
						message: '请输入ASIN',
						trigger: 'blur'
					}],
					word: [{
						required: true,
						message: '请输入关键词',
						trigger: 'blur'
					}],
					num: [{
							required: true,
							message: '请输入数量',
							trigger: 'blur'
						},
						{
							pattern: /^\+?[1-9]\d*$/,
							message: '数量必须为>0的正整数',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.getData()
			this.getCountryData()
			this.getInfoData()
		},
		methods: {
			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let params = {
					UserId: sessionStorage.getItem('userId'),
					pageNum: _this.pageNum,
					pagesize: _this.pageSize,
					keyWord: _this.searchForm.keyword,
					State: _this.searchForm.state
				}
				wishList(params).then(res => {
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

			//获取服务名称价格描述等信息
			getInfoData() {
				let _this = this
				let params = {
					ModularId: 15
				}
				infoList(params).then(res => {
					_this.form.name = res.SubmenuName
					_this.form.price = res.Price
					_this.form.info = res.Remark
					_this.state = res.State
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
							CountryId: _this.form.country,
							ShopId: _this.form.shop,
							ASIN: _this.form.asin,
							KeyWord: _this.form.word,
							Number: _this.form.num,
							Price: _this.form.price,
							Productlocation: _this.form.position,
							Remarks: _this.form.remark
						}
						wishAdd(params).then(res => {
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
				_this.form.country = ''
				_this.form.shop = ''
				_this.form.asin = ''
				_this.form.word = ''
				_this.form.position = ''
				_this.form.remark = ''
				_this.form.num = ''
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
	};
</script>
