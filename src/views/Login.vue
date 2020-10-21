<template>
	<div class="longin-box">
		<el-form v-show="doType==='login'" :model="loginForm" :rules="rules" ref="loginForm" class="login-container">
			<h3 class="title">系统登录</h3>
			<el-form-item prop="account">
				<el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item prop="imgCode">
				<el-input type="text" v-model="loginForm.imgCode" auto-complete="off" placeholder="验证码" style="width: 200px;"></el-input>
				<img :src='codeImgUrl' @click="getCodeImg" style="float: right;width: 85px;cursor: pointer;" title="看不清？点击更换一张" />
			</el-form-item>
			<el-form-item>
				<el-button class="login-btn" type="primary" @click="loginIn" :loading="btnLoading">登录</el-button>
				<div class="tixing"><span class="txt1">还没有账号？</span>
					<el-link type='primary' :underline="false" @click="doType='reg'">立即注册</el-link>
				</div>
			</el-form-item>
		</el-form>

		<el-form v-show="doType==='reg'" :model="regForm" :rules="rules2" ref="regForm" class="login-container">
			<h3 class="title">系统注册</h3>
			<el-form-item prop="account">
				<el-input type="text" v-model="regForm.account" auto-complete="off" placeholder="手机"></el-input>
			</el-form-item>
			<el-form-item prop="phoneCode">
				<el-input type="text" v-model="regForm.phoneCode" auto-complete="off" placeholder="验证码" style="width: 200px;"></el-input>
				<el-button type="primary" :disabled="disabledClick" @click="handlePhoneCode" style="float: right">{{btnTxt}}</el-button>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="regForm.password" auto-complete="off" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item prop="nickName">
				<el-input type="text" v-model="regForm.nickName" auto-complete="off" placeholder="昵称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="login-btn" type="primary" @click="resSubmiut" :loading="btnLoading">注册</el-button>
				<div class="tixing"><span class="txt1">已有账号？</span>
					<el-link type='primary' :underline="false" @click="doType='login'">立即登录</el-link>
				</div>
			</el-form-item>
		</el-form>

	</div>
</template>

<script>
	import {
		login,
		register,
		phoneCode,
	} from '@/api/api'
	export default {
		name: 'Login',
		data() {
			// 手机号验证
			const validatePhone = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请输入手机号"));
					this.disabledClick = true
				} else {
					if (!/^1[3456789]\d{9}$/.test(value)) {
						callback(new Error("请输入正确的手机号"));
						this.disabledClick = true
					} else {
						callback()
						this.disabledClick = false
					}
				}
			}
			return {
				doType: 'login',
				btnLoading: false,
				codeImgUrl: '/api/Login/CreateCheckCodeImage',
				loginForm: {
					account: '',
					password: '',
					codeImg: ''
				},
				rules: {
					account: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					imgCode: [{
						required: true,
						message: '请输入图片验证码',
						trigger: 'blur'
					}]
				},
				regForm: {
					account: '',
					password: '',
					phoneCode: '',
					nickName: ''
				},
				rules2: {
					account: [{
						validator: validatePhone,
						trigger: "change"
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							pattern: /^.{6,18}$/,
							message: '密码长度需在6~18位之间',
							trigger: 'blur'
						}
					],
					phoneCode: [{
						required: true,
						message: '请输入手机验证码',
						trigger: 'blur'
					}],
				},
				btnTxt: "获取验证码",
				totalTime: 60,
				disabledClick: true, // 节流
				clockTimer: null, // 定时器
			}
		},
		created() {
			this.getCodeImg()

			//回车键登录
			let _this = this
			document.onkeydown = function(e) {
				var key = window.event.keyCode
				if (key === 13) {
					_this.loginIn()
				}
			}
		},
		beforeDestroy() {
			//离开页面销毁回车键事件
			document.onkeydown = function(e) {
				var key = window.event.keyCode
				if (key === 13) {}
			}
		},
		methods: {
			// 登录
			loginIn() {
				let _this = this
				_this.$refs.loginForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							Phone: _this.loginForm.account,
							Password: _this.loginForm.password,
							Code: _this.loginForm.imgCode
						}
						login(params).then(res => {
							let user = res.Data.split(',')
							sessionStorage.setItem('userId', user[0])
							sessionStorage.setItem('userName', user[1])
							_this.btnLoading = false
							this.$router.push('/main')
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//获取验证码图片
			getCodeImg() {
				let _this = this
				_this.codeImgUrl = '/api/Login/CreateCheckCodeImage' + '?rand=' + Math.random();
			},

			//注册
			resSubmiut() {
				let _this = this
				_this.$refs.regForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							Phone: _this.regForm.account,
							PassWord: _this.regForm.password,
							PhoneCode: _this.regForm.phoneCode,
							Name: _this.regForm.nickName
						}
						register(params).then(res => {
							_this.btnLoading = false
							_this.doType = 'login'
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			handlePhoneCode() {
				let _this = this
				if (_this.disabledClick) return // 节流 防止频繁访问接口
				_this.getPhoneCode()
				_this.disabledClick = true
				_this.btnTxt = _this.totalTime + '秒后重新获取'
				_this.clockTimer = window.setInterval(() => {
					_this.totalTime--
					_this.btnTxt = _this.totalTime + '秒后重新获取'
					if (_this.totalTime == 0) {
						window.clearInterval(_this.clockTimer)
						_this.btnTxt = '获取验证码'
						_this.totalTime = 60
						_this.disabledClick = false
					}
				}, 1000)
			},

			//获取手机验证码
			getPhoneCode() {
				let _this = this
				let params = {
					Phone: _this.regForm.account
				}
				phoneCode(params).then(res => {}).catch((e) => {})
			}

		}
	}
</script>
