<template>
	<view class="content">
		<view class="content_top">
			<image mode="widthFix" src="../../static/logo.png"></image>
			<h2>{{userinfo.username}}</h2>
		</view>
		<uni-card class="content_item">
			<view class="content_item_user">
				<view>姓名：{{userinfo.employeeName}}</view>
				<view>性别：{{userinfo.sex}}</view>
			</view>
			<view>住址：{{userinfo.address}}</view>
			<view>出生日期：{{userinfo.birthday | dateBirth}}</view>
			<view>所在部门：{{userinfo.department}}</view>
			<view>员工编号：{{userinfo.job}}</view>
		</uni-card>
		<uni-card class="content_button">  
			<navigator url="/pages/user/userSet/index">
				<button type="primary" v-if="userinfo.type===0">用户管理</button>
			</navigator>
			<navigator :url="'/pages/user/password/index?id='+id">
				<button type="warn">修改密码</button>
			</navigator>
			<button type="default" @click="handleQuit">退出登录</button>
		</uni-card>
	</view>
</template>

<script>
import {uniCard } from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
				// 用户id
				id: uni.getStorageSync('userinfo').id,
				// 用户信息
				userinfo: {}
			}
		},
		async onLoad() {
			if(!this.id) {
				uni.navigateTo({
					url: `/pages/login/index`
				});
				return
			}
			const res = await this.request({url:'/userId',data:{id:this.id},method:'get'})
			if (res.success !== 200) {
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				});
				return
			}
			res.message.sex = res.message.sex === 0 ? '男' : '女'
			this.userinfo = res.message
		},
		methods: {
			// 退出登录
			handleQuit() {
				uni.setStorageSync('userinfo', '')
				uni.setStorageSync('token', '')
				uni.redirectTo({
					 url: '/pages/login/index'
				});
			}
		},
		components: {
			uniCard
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
	}
	.content {
		.content_top {
			background-color: #fb824e;
			color: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100vw;
			height: 450rpx;
			image {
				margin-top: 30rpx;
				width: 130rpx;
				filter: invert(100%);
			}
			h2{
				margin-top: 50rpx;
			}
		}
		.content_item {
			&::after{
					border: none!important;
				}
			border-radius: 40rpx;
			margin-top: -60rpx;
			view {
				padding: 20rpx;
			}
			.content_item_user {
				display: flex;
				justify-content: space-between;
				padding: 0;
			}
		}
		.content_button {
			border-radius: 40rpx;
			&::after{
					border: none!important;
				}
			button {
				border-radius: 50rpx;
				margin: 20rpx;
				&::after{
					border: none!important;
				}
			}
		}
	}
</style>
