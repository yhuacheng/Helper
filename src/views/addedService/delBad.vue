<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="删差评" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="mt10" label-position="left">
					<el-form-item label="Review链接" prop="review">
						<el-input v-model="form.review" style="width: 217px;" placeholder="请输入Review链接"></el-input>
					</el-form-item>
					<el-form-item label="服务名称" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">支持全国家删除，预付50%，成功后收全款，不成功不收费。</p>
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
					<el-table-column prop="ReviewLink" label="Review链接" align="center"></el-table-column>
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
		infoList,
		delBadAdd,
		delBadList
	} from '@/api/api'
	export default {
		name: 'delBad',
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
					review: '',
					name: '',
					price: '',
					info: ''
				},
				state: 1,
				rules: {
					review: [{
						required: true,
						message: '请输入Review链接',
						trigger: 'blur'
					}]
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
					pagesize: _this.pageSize
				}
				delBadList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//获取服务名称价格描述等信息
			getInfoData() {
				let _this = this
				let params = {
					ModularId: 1
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
							Review: _this.form.review,
							Price: _this.form.price
						}
						delBadAdd(params).then(res => {
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
				_this.form.review = ''
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
