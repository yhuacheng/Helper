<template>
	<div>
		<el-tabs v-model="activeName" class="mt20">
			<el-tab-pane label="评论" name="first">
				<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="mt10" label-position="left">
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
								<el-input v-model="form.word" placeholder="请输入关键词" style="width: 90%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="产品位置" prop="position">
								<el-input v-model="form.position" placeholder="请输入产品位置" style="width: 90%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="备注信息" prop="remark">
								<el-input v-model="form.remark" placeholder="请输入备注信息"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<div v-for="(item, index) in form.content" :key="item.key" style="border: 1px dashed #CCCCCC;padding: 30px 120px 15px 15px;margin-top: 30px;background: #F9F9F9;">
								<el-form-item :label="'评论标题 ' + (index+1)" :prop="'content.' + (index) + '.Title'" :rules="{ required: true, message: '评论标题不能为空', trigger: 'blur'}">
									<el-input v-model="item.Title" placeholder="请输入评论标题"></el-input>
								</el-form-item>
								<el-form-item :label="'评论内容 ' + (index+1)" :prop="'content.' + (index) + '.Message'" :rules="{ required: true, message: '评论内容不能为空', trigger: 'blur'}">
									<el-input type="textarea" v-model="item.Message" rows="5" placeholder="请输入评论内容"></el-input>
								</el-form-item>
								<el-form-item style="position: absolute;right: 15px;margin-top: -120px;">
									<el-button size="small" type="danger" @click.prevent="removeContent(item)" :disabled="form.content.length===1">删除此条</el-button>
								</el-form-item>
							</div>
							<el-form-item style="text-align: right;margin-top: 15px;">
								<el-button size="small" type="primary" @click="addContent">多加一条评论</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="服务名称" prop="name">
						<el-card style="width: 500px">
							<h4><i class="el-icon-loading" v-if="!form.name"></i>{{form.name}}</h4>
							<p class="info">产品添加评论，增加产品人气。</p>
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
							<el-date-picker size="small" v-model="searchForm.time" :unlink-panels='true' type="datetimerange"
							 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
					<el-table-column prop="Title" label="评论标题" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Message" label="评论内容" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Productlocation" label="产品位置" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Remarks" label="备注" align="center" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column prop="Price" label="单价" align="center"></el-table-column>
					<el-table-column prop="AddTimes" label="提交时间" align="center"></el-table-column>
					<el-table-column prop="State" label="状态" align="center">
						<template v-slot="scope">
							<span v-if="scope.row.State===1">待确认</span>
							<span class="primary" v-if="scope.row.State===2">处理中</span>
							<span class="success" v-if="scope.row.State===3">完成</span>
							<span class="danger" v-if="scope.row.State===4">失败</span>
							<span class="warning" v-if="scope.row.State===5">已取消</span>
						</template>
					</el-table-column>
					<el-table-column prop="Images" label="截图" align="center">
						<template slot-scope="scope">
							<img style="width: 40px;height: 40px;cursor: pointer;" v-show="scope.row.Images" :src="$IMGURL+scope.row.Images"
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

	</div>
</template>
<script>
	import {
		countryList,
		infoList,
		commentAdd,
		commentList
	} from '@/api/api'
	export default {
		name: 'comment',
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
					time: []
				},
				form: {
					country: '',
					shop: '',
					asin: '',
					word: '',
					position: '',
					remark: '',
					content: [{
						Title: '',
						Message: ''
					}],
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
					}]
				},
				imageModal: false,
				bigImageUrl: '',
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
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					UserId: sessionStorage.getItem('userId'),
					pageNum: _this.pageNum,
					pagesize: _this.pageSize,
					keyWord: _this.searchForm.keyword,
					Statetime: time1,
					Endtime: time2
				}
				commentList(params).then(res => {
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
					ModularId: 18
				}
				infoList(params).then(res => {
					_this.form.name = res.SubmenuName
					_this.form.price = res.Price
					_this.form.info = res.Remark
					_this.state = res.State
				}).catch((e) => {})
			},

			//新增一行评论
			addContent() {
				this.form.content.push({
					Title: '',
					Message: ''
				})
			},

			//删除一行评论
			removeContent(item) {
				var index = this.form.content.indexOf(item)
				if (index !== -1) {
					this.form.content.splice(index, 1)
				}
			},

			//添加
			addSubmit() {
				let _this = this
				console.log(_this.form.content)
				_this.$refs.form.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							CountryId: _this.form.country,
							ShopId: _this.form.shop,
							Asin: _this.form.asin,
							KeyWord: _this.form.word,
							tieleAndMeaageModels: _this.form.content,
							Price: _this.form.price,
							Productlocation: _this.form.position,
							Remarks: _this.form.remark
						}
						commentAdd(params).then(res => {
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
				_this.form.content = [{
					Title: '',
					Message: ''
				}]
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
			},
			
			//查看大图
			showImage(index, row) {
				let _this = this
				_this.imageModal = true
				_this.bigImageUrl = this.$IMGURL + row.Images
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
