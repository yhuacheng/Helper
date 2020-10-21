<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="点赞" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="mt10" label-position="left">
					<el-form-item label="链接" prop="link">
						<el-input v-model="form.link" style="width: 500px;" placeholder="请输入链接"></el-input>
					</el-form-item>
					<el-form-item label="原有点赞数" prop="numOld">
						<el-input v-model="form.numOld" style="width: 217px;" placeholder="请输入原有点赞数"></el-input>
					</el-form-item>
					<el-form-item label="需要点赞数" prop="num">
						<el-input v-model="form.num" style="width: 217px;" placeholder="请输入需要点赞数"></el-input>
					</el-form-item>
					<el-form-item label="服务名称" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">产品点赞，提高产品人气。</p>
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

			<el-tab-pane label="购买记录" name="second" class="mt10">
				<!--列表-->
				<el-table :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
				 ref='tableData'>
					<el-table-column type="index" label="#" align="center"></el-table-column>
					<el-table-column prop="Link" label="链接" align="center"></el-table-column>
					<el-table-column prop="EstimateNumber" label="原有点赞数" align="center"></el-table-column>
					<el-table-column prop="ActualNumber" label="需要点赞数" align="center"></el-table-column>
					<el-table-column prop="Price" label="单价" align="center"></el-table-column>
					<el-table-column prop="AddTimes" label="提交时间" align="center"></el-table-column>
					<el-table-column prop="BackNumber" label="完成数量" align="center"></el-table-column>
					<el-table-column prop="State" label="状态" align="center">
						<template v-slot="scope">
							<span v-if="scope.row.State===1">待确认</span>
							<span class="primary" v-if="scope.row.State===2">处理中</span>
							<span class="success" v-if="scope.row.State===3">处理完毕</span>
							<span class="danger" v-if="scope.row.State===4">已取消</span>
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
		infoList,
		likedHateAdd,
		likedHateList
	} from '@/api/api'
	export default {
		name: 'liked',
		data() {
			return {
				title: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				selsData: [],
				selectId: '',
				activeName: 'first',
				form: {
					link: '',
					num: '',
					numOld: '',
					name: '',
					price: '',
					info: ''
				},
				state: 1,
				rules: {
					link: [{
						required: true,
						message: '请输入链接',
						trigger: 'blur'
					}],
					num: [{
							required: true,
							message: '请输入需要点赞的数量',
							trigger: 'blur'
						},
						{
							pattern: /^\+?[1-9]\d*$/,
							message: '数量必须为大于0的正整数',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.getData()
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
					Type: 1
				}
				likedHateList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//获取服务名称价格描述等信息
			getInfoData() {
				let _this = this
				let params = {
					ModularId: 16
				}
				infoList(params).then(res => {
					_this.form.name = res.SubmenuName
					_this.form.price = res.Price
					_this.form.info = res.Remark
					_this.state = res.State
				}).catch((e) => {})
			},

			//购买
			addSubmit() {
				let _this = this
				_this.$refs.form.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							Type: 1,
							Link: _this.form.link,
							EstimateNumber: _this.form.numOld,
							ActualNumber: _this.form.num,
							Price: _this.form.price
						}
						likedHateAdd(params).then(res => {
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
				_this.form.link = ''
				_this.form.numOld = ''
				_this.form.num = ''
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
