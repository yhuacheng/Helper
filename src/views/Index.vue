<template>
	<div class="out-box">
		<div class="in-box">
			<div class="head-box">
				<a class="hd-logo fl">
					<i class="el-icon-s-opportunity"></i><span>评论助手</span>
				</a>
				<div class="hd-bar fr">
					<el-button type="success" @click="$router.push('/login')">进入助手</el-button>
				</div>
			</div>
			<div class="content1">
				<div class="text fl">
					<h2>售后邮件 轻松管理</h2>
					<p style="padding: 50px 0px">站内信自动群发功能免费开通，登录即可使用<br>免费、省时、稳定、自由，大大提高工作效率</p>
					<el-button size="mini" type="success" @click="$router.push('/login')">进入助手</el-button>
				</div>
				<div class="img fr">
					<img src="../assets/image/banner.png">
				</div>
				<br clear="all" />
			</div>
			<div class="content2">
				<div class="title">
					<h2>平台优势</h2>
					<p>免费、省时、稳定、自由 提供专业的解决方案</p>
				</div>
				<div class="con-box">
					<div>
						<span><img src="../assets/image/ad3.png"></span>
						<h3>免费</h3>
						<p>专注服务卖家 不收取任何附加费用</p>
					</div>
					<div>
						<span><img src="../assets/image/ad1.png"></span>
						<h3>省时</h3>
						<p>一键自动批量发送 售后服务站内邮件</p>
					</div>
					<div>
						<span><img src="../assets/image/ad4.png"></span>
						<h3>稳定</h3>
						<p>服务稳定 安全可靠 无后顾之忧</p>
					</div>
					<div>
						<span><img src="../assets/image/ad2.png"></span>
						<h3>自由</h3>
						<p>支持自由定制群发模板 定时发送站内邮件给买家</p>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="copyright">Copyright © 评论助手 All Rights Reserved.</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	body {
		margin: 0;
		padding: 0;
	}

	ul,
	li {
		list-style: none;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.out-box {
		width: 100%;
	}

	.head-box {
		height: 68px;
		line-height: 68px;
		background-color: #0D6DFF;
		width: 80%;
		padding: 0 10%;
	}

	.hd-logo {
		height: 100%;
		line-height: 68px;
		margin-left: 40px;
		color: #FFFFFF;
		font-size: 24px;
		font-weight: bold;
		font-style: oblique;
		letter-spacing: 4px
	}

	.hd-logo img {
		vertical-align: middle;
		max-height: 80%;
	}

	.hd-bar {
		height: 68px;
		line-height: 68px;
		color: #FFFFFF;
	}

	.content1 {
		background: #4466FF;
		padding: 5% 20%;
	}

	.content1 .text {
		color: #FFFFFF;
	}

	.content2 {
		width: 70%;
		padding: 5% 15%;
	}

	.content2 .title {
		text-align: center;
		padding: 0 0 50px 0
	}

	.content2 .con-box {
		display: flex;
		justify-content: space-between;
		text-align: center;
	}

	.footer {
		background: #333;
		padding: 30px 0;
	}

	.copyright {
		color: #ccc;
		text-align: center;
	}
</style>
