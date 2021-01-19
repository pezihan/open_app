<template>
	<view class="content">
		<nav-content :seekInput="seekInput" :pickerIndex="pickerIndex" :pickerArray="pickerArray" 
		:items="items" :current="current" @handleClickLeft="handleClickLeftFu"
		@handleClickRight="handleClickRightFu" @bindPickerChange="handleBindPickerChange" 
		@handleEnterClick="handleEnterClickFu">
		</nav-content>
		<scroll-view scroll-y enable-back-to-top @scrolltolower="bottomList" class="list_content_scroll">
			<uni-swipe-action class="content_action">
				<view class="list_content" v-for="item in dataList" :key="item.id" >
					<checkbox-group class="list_select" v-if="checkboxShow" @change="handleItemChange(item.id)">
						<checkbox  :checked="item.checked" style="transform:scale(0.7)"/>
					</checkbox-group>
					<view class="content_card">
						<uni-swipe-action-item :right-options="options"  @click="onClick($event,item.id)">
							<view class="content_card_item" @click.stop="handleitem(item.id)">
								<view class="content_item_left">
									<image src="../../static/no.jpg" mode="widthFix"></image>
								</view>
								<view class="content_item_right">
									<view><h4>{{item.commodity}}</h4></view>
									<view>产品编号：{{item.product}}</view>
									<view>单价：{{item.univalence}}</view>
									<view>库存：{{item.repertory}}</view>
									<view>操作人：{{item.operator}}</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</view>
				</view>
			</uni-swipe-action>
			<!-- 底部加载动画 -->
			<uni-load-more :status="loading"></uni-load-more>
		</scroll-view>

		<!-- 底部工具栏 -->
		<view class="bottom_tool" v-show="checkboxShow">
			<checkbox-group class="bottom_tool_checke" @change="handleItemAllChecked">
				<checkbox :checked="checked" style="transform:scale(0.7)" />全选
			</checkbox-group>
			<view>
				<view class="bottom_tool_no" @click="handleClickLeftFu">取    消</view>
				<view class="bottom_tool_yes" @click="handleDelete">删    除</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navContent from "@/components/Nav.vue"
	import {uniSwipeAction,uniSwipeActionItem,uniTag,uniLoadMore,uniPopup,uniPopupDialog} from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
				// 搜索输入框
				seekInput: "",
				// 下拉滚动选择器 列表
				pickerArray: ['产品编号', '产品名称'],
				// 下拉滚动选择器 索引
				pickerIndex: 0,
				// 选项卡列表
				items: [
					{id:0,title: "所有产品"}
				],
				// 顶部选项卡索引
				current: 0,
				// 滑动列表参数
				options:[
					{
						text: '修改',
						style: {
							backgroundColor: '#007aff'
						}
					}, 
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				// 提交服务端的数据
				getList: {
					start: 1,
					limit: 10,
					product: '',
					commodity: ''
				},
				// 产品数据
				dataList: [],
				// 多选按钮编辑
				checkboxShow: false,
				// 总数据条数
				sum: 0,
				// 全选
				checked: false,
				// 加载动画效果类型
				loading: 'loading',
				// 提交到后台删除的id数组
				deleteId: [],
			}
		},
		onLoad() {
			this.getLists()
		},
		// 上拉刷新
		onPullDownRefresh() {
			// uni.startPullDownRefresh()
			this.getList.start = 1
			this.dataList = []
			this.getLists()
			uni.stopPullDownRefresh()
		},
		methods: {
			// 获取列表数据
			async getLists(text) {
				this.getList.product = ''
				this.getList.commodity = ''
				this.seekInput = text!=null?text:this.seekInput
				if (this.pickerIndex===0) {
					this.getList.product = this.seekInput
				} else {
					this.getList.commodity = this.seekInput
				}
				const res = await this.request({url:'/commoditys',data:this.getList,method:'get'})
				if (res.success !== 200) {
					uni.showToast({
						title: '获取列表数据失败',
						duration: 2000
					});
					return
				}
				res.message.forEach((v) => {
					v.checked = false
				})
				this.sum = res.sum
				this.dataList = [...this.dataList,...res.message]
			},
			// 点击导航子组件编辑按钮
			handleClickLeftFu () {
				// console.log("编辑");
				if(this.checkboxShow===true) {
					this.dataList.forEach((v)=>{
						v.checked = false
					})
					this.checked = false
				}
				// console.log(this.dataList);
				this.checkboxShow =! this.checkboxShow
			},
			// 点击导航子组件添加按钮
			handleClickRightFu() {
				uni.navigateTo({
					url: `/pages/shipments/newShipment/index`
				});
			},
			// 导航栏子组件选择按钮状态发生改变
        	handleBindPickerChange(index) {
				console.log(index);
            	this.pickerIndex = index
			},
			 // 按下导航子组件回车键进行搜索
			handleEnterClickFu (text) {
				this.getList.start=1
				this.dataList = []
				this.getLists(text) // 搜索框文字
			},
			// 全选
			handleItemAllChecked() {
				if(this.checked===true) {
					this.dataList.forEach(v => {
						v.checked = false
					})
				}else {
					this.dataList.forEach(v => {
						v.checked = true
					})
				}
				this.checked =! this.checked
			},
			// 复选框改变事件
			handleItemChange(id) {
				let checkedSum = 0
				this.dataList.forEach(v => {
					if(v.id === id) {
						v.checked =! v.checked
					}
					if(v.checked === true) {
						checkedSum++
					}
				})
				this.checked=checkedSum===this.dataList.length?true:false
			},
			// 滚动视图触底事件
			bottomList() {
				if(this.getList.start < Math.ceil(this.sum / this.getList.limit)) {
					this.getList.start++
					this.getLists()
					return
				}
				this.loading = 'noMore'
			},
			// 删除数据函数
			async deletes () {
				const res = await this.request({url:'/deleteCommod',data:{ deleteId: this.deleteId },method:'post'})
				if(res.success !== 200) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
					this.deleteId = []
					return
				}
				uni.showToast({
						title: '删除成功',
						icon: "success"
					});
				this.deleteId = []
			},
			// 批量删除
			handleDelete() {
				this.dataList.forEach(v => {
					if(v.checked === true) {
						this.deleteId.push(v.id)
					}
				})
				if(!this.deleteId.length) {
					uni.showToast({
						title: '请选择需要删除的订单',
						icon: 'none'
					});
					return
				}
				this.deletes()
				this.checkboxShow = false
				this.checked = false
				this.dataList = []
				this.getLists()
			},
			// 列表单击
			handleitem(id) {
				// 在多选按钮显示的时候
				if(this.checkboxShow === true) {
					this.handleItemChange(id)
				}
			},
			// 滑动按钮点击事件
			onClick(e,id){
				if(e.content.text === '删除') {
					this.deleteId.push(id)
					this.deletes()
					// 在数据列表中获取删除数据的索引，然后通过索引在数组中删除
					let index = this.dataList.findIndex(v => v.id===id)
					this.dataList.splice(index,1)
					this.sum--
				} else {
					// 修改
					uni.navigateTo({
						url: `/pages/shipments/newShipment/index?id=${id}`
					});
				}
			}
		},
		components:{
			navContent,
			uniSwipeAction,
			uniSwipeActionItem,
			uniTag,
			uniLoadMore,
			uniPopup,
			uniPopupDialog
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
	}
	.content {
		.list_content_scroll {
			height: calc(100vh - 170rpx);
			.content_action {
				.list_content {
					background-color: #fff;
					margin: 20rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;
					.list_select {
						// flex: 1;	
						padding-left: 20rpx;
					}
					.content_card {
						flex: 8;
						.content_card_item {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
							.content_item_left {
								flex: 3;
								image {
									width: 160rpx;
									margin: 20rpx;
								}
							}
							.content_item_right {
								flex: 6;
								view {
									padding: 7rpx;
								}
							}
						}
					}
				}
			}
		}
	}
	.bottom_tool {
		position: fixed;
		// 打包成app这里bottom要设置为 0 app默认忽略掉了底部导航栏高度
		bottom: 90rpx;
		// bottom: 0;
		left: 0;
		background-color: #fff;
		width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.bottom_tool_checke {
			checkbox {
				padding-left: 20rpx;
			}
  		}

		.bottom_tool_no {
			width: 160rpx;
			height: 80rpx;
			background-color: rgb(194, 194, 194);
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			display: inline-block;
		}

		.bottom_tool_yes {
			width: 160rpx;
			height: 80rpx;
			background-color: #fd4c4c;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			display: inline-block;
		}
	}
</style>
