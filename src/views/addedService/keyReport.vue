<template>
	<div>
		<el-alert title="人工查询依赖供应商，如渠道供应中断，未获得结果的人工查询费用将返回账户。" type="warning" show-icon class="mt20"></el-alert>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="ASIN关键词报告购买" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="80px" class="mt10" label-position="left">
					<el-form-item label="国家" prop="country">
						<el-select v-model="form.country" placeholder="请选择">
							<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="ASIN码" prop="asin">
						<el-input v-model="form.asin" style="width: 217px;" placeholder="请输入ASIN码"></el-input>
						<span class="info ml20 f12">若一个Listing下有多个子ASIN，请输入具体的子ASIN查询，用父ASIN去查询可能查不到。</span>
					</el-form-item>
					<el-form-item label="报告类型" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">关键词报告可查询此ASIN下每个关键词的点击次数，加购数量，购买数量等数据。</p>
							<p class="txt-r">
								<el-link type="primary" :underline="false" icon="el-icon-tickets" @click.prevent='helpModal=true'>查看样例</el-link>
							</p>
						</el-card>
					</el-form-item>
					<el-form-item label="促销价" prop="price">
						<span class="primary fz16 bold"><i class="el-icon-loading" v-if="!form.price"></i>{{form.price}} 元/份</span>
					</el-form-item>
					<el-form-item>
						<span class="info f12">{{form.info}}</span>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSubmit" :loading="btnLoading">购买</el-button>
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
					<el-table-column prop="ASIN" label="ASIN" align="center"></el-table-column>
					<el-table-column prop="Country" label="国家" align="center"></el-table-column>
					<el-table-column prop="BuyTime" label="购买时间" align="center"></el-table-column>
					<el-table-column prop="State" label="状态" align="center">
						<template v-slot="scope">
							<span v-if="scope.row.State===1">待确认</span>
							<span class="primary" v-if="scope.row.State===2">处理中</span>
							<span class="success" v-if="scope.row.State===3">成功</span>
							<span class="danger" v-if="scope.row.State===4">失败</span>
							<span class="warning" v-if="scope.row.State===5">已取消</span>
						</template>
					</el-table-column>
					<el-table-column prop="AsinType" label="报告截图" align="center">
						<template slot-scope="scope">
							<img style="width: 40px;height: 40px;cursor: pointer;" v-show="scope.row.AsinType" :src="$IMGURL+scope.row.AsinType"
							 @click.stop="showImage(scope.$index,scope.row)" />
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

		<!--查看图片大图-->
		<el-dialog title="查看大图" :visible.sync='imageModal' :before-close="closeImageModal">
			<div class="txt-c">
				<img :src='bigImageUrl' style="max-width: 100%;" />
			</div>
		</el-dialog>
		
		<!-- 示例文档 -->
		<el-dialog title="ASIN关键词报告样例" :visible.sync="helpModal" width="50%">
			<img src="../../assets/image/asin_key_words.png" />
			<div slot="footer" class="dialog-footer txt-c">
			  <el-link type="primary" class="fz16" :underline="false" href="/document/ASIN关键词报告样例.xlsx">下载样例</el-link>
			</div>
		</el-dialog>
		
	</div>
</template>
<script>
	import {
		countryList,
		infoList,
		keyReportAdd,
		keyReportList
	} from '@/api/api'
	export default {
		name: 'keyReport',
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
					country: '',
					asin: '',
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
						message: '请输入ASIN码',
						trigger: 'blur'
					}]
				},
				imageModal: false,
				bigImageUrl: '',
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
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				keyReportList(params).then(res => {
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
					ModularId: 4
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
							CountryId: _this.form.country,
							ASIN: _this.form.asin,
							Price: _this.form.price
						}
						keyReportAdd(params).then(res => {
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
			},

			//查看大图
			showImage(index, row) {
				let _this = this
				_this.imageModal = true
				_this.bigImageUrl = this.$IMGURL + row.AsinType
			},

			//关闭大图窗口
			closeImageModal() {
				let _this = this
				_this.imageModal = false
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
