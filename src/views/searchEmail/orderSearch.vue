<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="订单查邮箱" name="first">
				<p>单个提交</p>
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="mt10" label-position="left">
					<el-form-item label="国家" prop="country">
						<el-select v-model="form.country" placeholder="请选择">
							<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="ASIN" prop="asin">
						<el-input v-model="form.asin" style="width: 217px;" placeholder="请输入ASIN"></el-input>
					</el-form-item>
					<el-form-item label="订单号" prop="order">
						<el-input v-model="form.order" style="width: 217px;" placeholder="请输入订单号"></el-input>
					</el-form-item>
					<el-form-item label="服务名称" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">帮助卖家，更安全更高效的联系买家，索取高质量好评。</p>
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
				<el-form ref="formMore" style="position: absolute;top:0px;left: 800px;">
					<p>批量提交</p>
					<el-form-item label="模板下载">
						<el-link type="primary" :underline="false" href="/document/批量订单查邮箱模板.xlsx">批量订单查邮箱模板.xlsx</el-link>
					</el-form-item>
					<el-form-item label="获取FBA">
						<el-link type="primary" :underline="false" @click.prevent='helpModal=true'>如何获取FBA订单文件？</el-link>
					</el-form-item>
					<el-upload ref="upload" :limit="1" drag action="/api/OrderMailboxQuery/ExcelOrderMailboxQuery" multiple
					 :on-success="handleAvatarSuccess" :on-error="handleError" :before-upload="beforeAvatarUpload" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
							<p class="danger">只能上传规范的Excel文件</p><br>
						</div>
					</el-upload>
				</el-form>
				<div class="my-modal" v-if="state==0">
					<div>
						<i class="el-icon-warning-outline"></i>
						<span class="ml10">尊敬的用户朋友，该功能临时暂停使用，若有恢复，我们将在第一时间开放，给您带来的不便敬请谅解！</span>
					</div>
				</div>
			</el-tab-pane>

			<el-tab-pane label="购买记录" name="second" class="mt10">

				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="searchForm">
						<el-form-item>
							<el-input size="small" v-model="searchForm.keyword" placeholder="请输入 ASIN / 订单号 查询"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="searchForm.state" placeholder="状态" size="small">
								<el-option value="0" label="全部状态"></el-option>
								<el-option value="1" label="待确认"></el-option>
								<el-option value="2" label="待处理"></el-option>
								<el-option value="3" label="成功"></el-option>
								<el-option value="4" label="失败"></el-option>
								<el-option value="5" label="已取消"></el-option>
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
					<el-table-column prop="ASIN" label="ASIN" align="center"></el-table-column>
					<el-table-column prop="OrderNumber" label="订单号" align="center"></el-table-column>
					<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
					<el-table-column prop="SubTime" label="提交时间" align="center"></el-table-column>
					<el-table-column prop="BuyerName" label="买家姓名" align="center"></el-table-column>
					<el-table-column prop="BuyerEmail" label="买家邮箱" align="center"></el-table-column>
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

		<!-- 帮助文档：如何获取FBA文件 -->
		<el-dialog title="如何获取FBA订单文件？" :visible.sync="helpModal" width="80%">
			<div>
				<h3 class="primary">账号权限</h3>
				<p>Amazon商家账号需要在主账号下开通以下权限，如下图所示：</p>
				<img src="../../assets/image/img_1.png" />
				<p>若未开通上述权限，则可通过商家主账号进行权限分配，如下图所示：</p>
				<img src="../../assets/image/img_2.png" />
				<h3 class="primary">Amazon Fulfilled Shipments (FBA)报告获取流程</h3>
				<p>① 选择REPORTS > Fulfillment，进入发货报告主页</p>
				<img src="../../assets/image/img_3.png" />
				<p>② 选择Amazon Fulfilled Shipments</p>
				<img src="../../assets/image/img_4.png" />
				<p>③ 下载条件设置（Event Date: 按订单生成日期，Exact Dates：精准日期，From: 选择订单开始时间，To:选择订单结束时间）</p>
				<p class="warning">注意：1.时间范围建议在3-15天随机选择；2.开始时间与结束时间不要跨月(跨月时报告的生成速度过慢)；3.FBA报告只能下载自当前时期之前的一年半;4.FBA报告一次请求时长最大为30天</p>
				<img src="../../assets/image/img_5.png" />
				<p>④ 点击下载</p>
				<img src="../../assets/image/img_6.png" />
				<p>⑤ 下载成功</p>
				<p class="warning">报告状态说明：In Progress:处理中，Cancelled:取消或无数据，No Data Available:无数据，Download:可下载</p>
				<img src="../../assets/image/img_7.png" />
				<p class="warning">温馨提示：文件名默认为一个一串数字的.txt文件，建议文件名更改为:{店铺名}_fba_{from date}_{to date}.txt，这样比较方便记录，例如:
					wahaha_us_fba_20300202_20300209.txt</p>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	import {
		countryList,
		infoList,
		orderSearchAdd,
		orderSearchList
	} from '@/api/api'
	export default {
		name: 'orderSearch',
		data() {
			return {
				title: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				listLoading: false,
				btnLoading: false,
				btnLoading2: false,
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
					asin: '',
					order: '',
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
					asin: [{
						required: true,
						message: '请输入ASIN',
						trigger: 'blur'
					}],
					order: [{
						required: true,
						message: '请输入订单号',
						trigger: 'blur'
					}]
				},
				helpModal: false
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
					KeyWord: _this.searchForm.keyword,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				orderSearchList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
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
					ModularId: 13
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
							ASIN: _this.form.asin,
							OrderNumber: _this.form.order,
							Price: _this.form.price,
						}
						orderSearchAdd(params).then(res => {
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
				_this.form.asin = ''
				_this.form.order = ''
			},

			// 文件上传
			handleAvatarSuccess(res, file) {
				if (res.Code == 'ok') {
					this.$message.success('文件导入成功！')
					this.getData()
				} else {
					this.$message.error('文件导入失败！')
				}
			},
			handleError(res) {
				this.$message.error('文件导入失败！')
			},
			beforeAvatarUpload(file) {
				const isXLS = file.type === 'application/vnd.ms-excel';
				const isSLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				if (!isXLS && !isSLSX) {
					this.$message.error('上传的文件必须为Excel');
				}
				return (isXLS || isSLSX)
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
