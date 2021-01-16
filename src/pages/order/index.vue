<template>
	<view class="content">
		<navContent :seekInput="seekInput" :pickerArray="pickerArray" 
		:pickerIndex="pickerIndex" :items="items" :current="current"
		@bindPickerChange="handleBindPickerChange" @onClickItem="handleClickItem"
		@handleClickLeft="handleClickLeftFu" @handleEnterClick="handleEnterClickFu"
		@handleClickRight="handleClickRightFu">
		</navContent>
		
		<!-- 内容显示 -->
		<scroll-view scroll-y enable-back-to-top @scrolltolower="bottomList" class="list_content_scroll">
			<uni-swipe-action class="content_action">
				<view class="list_content" v-for="item in dataList" :key="item.id" >
					<checkbox-group class="list_select" v-if="checkboxShow" @change="handleItemChange(item.id)">
						<checkbox  :checked="item.checked" style="transform:scale(0.7)"/>
					</checkbox-group>
					<view class="content_card">
						<uni-swipe-action-item :right-options="options"  @click="onClick($event,item.id,item.staus)">
							<view class="content_card_item" @click.stop="handleitem(item.id)">
								<view class="content_item_left">
									<view>商品：{{item.commodity}}</view>
									<view>订单编号：{{item.employeeID}}</view>
									<view>物流单号：{{item.number}}</view>
									<view>创建时间：{{item.time | dateFormat}}</view>
									<view>数量：{{item.amount}}</view>
									<view>金额：{{item.sum}}</view>
								</view>
								<view class="content_item_right">
									<view class="content_item_name">姓名：{{item.employeeName}}</view>
									<view>
										<text>状态：</text>
										<uni-tag class="tag" v-if="item.staus==='已完成'" size="small" type="success" :text="item.staus"></uni-tag>
										<uni-tag class="tag" v-else-if="item.staus==='进行中'" size="small" type="primary" :text="item.staus"></uni-tag>
										<uni-tag class="tag" v-else size="small" type="warning" :text="item.staus"></uni-tag>
									</view>
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

		<!-- 发货物流输入框弹窗 -->
		<uni-popup  ref="popup" type="dialog">
            <uni-popup-dialog   type="input" mode="input" title="发货" placeholder="请输入物流单号" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
        </uni-popup>

		<!-- 弹出式确认框 -->
        <uni-popup  ref="popupRefund" type="dialog">
            <uni-popup-dialog   type="info" mode="base" title="提示" content="是否添加已收货事务" :duration="2000" :before-close="true" @close="close" @confirm="confirmRefund"></uni-popup-dialog>
        </uni-popup>
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
				pickerArray: ['收货人姓名', '订单编号', '电话号码', '物流信息'],
				// 下拉滚动选择器 索引
				pickerIndex: 0,
				// 选项卡列表
				items: [
					{id:0,title: "所有订单"},
					{id:1,title: "退货订单"},
					{id:2,title: "换货订单"},
					{id:3,title: "维修订单"},
					{id:4,title: "待发货"},
					{id:5,title: "待收货"},
					{id:6,title: "已发货"}
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
				// 多选按钮
				checkboxShow: false,
				// 提交服务端的数据
				getList: {
					navigation: 0,
					start: 1,
					limit: 10,
					employeeName: '',
					employeeID: '',
					phone: '',
					number: ''
				},
				// 列表数据
				dataList: [],
				// 提交到后台删除的id数组
				deleteId: [],
				// 加载动画效果类型
				loading: 'loading',
				// 总数据条数
				sum: 0,
				// 全选
				checked: false,
				// 新订单物流信息
				editListNuber: {
					id:null,
					number: '',
					cangku: uni.getStorageSync('userinfo').employeeName,
					orderStatus:'',
					orderText:'',
					orderNumber:''
				}
			}
		},
		// 上拉刷新
		onPullDownRefresh() {
			// uni.startPullDownRefresh()
			this.dataList = []
			this.getLists()
			uni.stopPullDownRefresh()
		},
		mounted() {
			// console.log("请求数据");
			this.getLists()
		},
		// 页面重新显示时触发的生命周期函数
		// onShow() {
		// 	this.dataList = []
		// 	this.getLists()
		// },
		methods: {
			// 请求列表数据
			async getLists(text) {
				this.loading = 'loading'
				let url = ''
				this.getList.employeeName = ''
				this.getList.employeeID = ''
				this.getList.phone = ''
				this.getList.number = ''
				this.seekInput = text!=null?text:this.seekInput
				if(this.current<=3){
					url='/order'
					this.getList.navigation = this.current
				} else {
					url = '/getmanagement'
					this.getList.navigation = this.current - 4
				}
				if(this.pickerIndex===0) {
						this.getList.employeeName = this.seekInput
					}else if(this.pickerIndex===1) {
						this.getList.employeeID = this.seekInput
					}else if(this.pickerIndex===2) {
						this.getList.phone = this.seekInput
					}else {
						this.getList.number = this.seekInput
					}
				const res = await this.request({url:url,data:this.getList,method:'get'});
				res.message.forEach((v) => {
					v.checked = false
				})
				this.sum = res.sum
				this.dataList = [...this.dataList,...res.message]
				if(res.message.length < this.getList.limit){
					this.loading = 'noMore'
				}
				// console.log(this.dataList);
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
			// 点击导航子组件添加按钮
			handleClickRightFu() {
				uni.navigateTo({
					url: `/pages/order/newOrder/index`
				});
			},
			// 切换子组件顶部滚动选项卡
			handleClickItem (index) {
				this.current = index
				if(index===4) {
					this.pickerIndex = 0
					this.pickerArray = ['收货人姓名', '订单编号', '电话号码']
				} else {
					this.pickerArray = ['收货人姓名', '订单编号', '电话号码', '物流信息']
				}
				if(index<=3){
					this.options = [{text: '修改',style: {backgroundColor: '#007aff'}}, {text: '删除',style: {backgroundColor: '#dd524d'}}]
				} else if (index === 4) {
					this.options = [{text: '发货',style: {backgroundColor: '#33cc66'}}]
				} else if (index === 5) {
					this.options = [{text: '收货',style: {backgroundColor: '#dd524d'}},{text: '售后发货',style: {backgroundColor: '#33cc66'}}]
				} else {
					this.options = []
				}
				this.getList.start = 1
				this.dataList = []
				this.getLists()
			},
			// 订单删除函数
			async deletes() {
				const res = await this.request({url:'/delete',data:{ deleteId: this.deleteId },method:'post'})
				if (res.success !== 200) {
					this.deleteId = []
					uni.showToast({
						title: '删除失败',
						icon: "none"
					});
					return
				}
				uni.showToast({
						title: '删除成功',
						icon: "success"
					});
				this.deleteId = []
			},
			// 滑动按钮点击事件
			onClick(e,id,value){
				// console.log('点击了'+(e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
				// console.log(e.content);
				if(value === '维修中') {
					this.editListNuber.orderStatus = 'maintain'
				} else if(value === '换货中') {
					this.editListNuber.orderStatus = 'exchange'
				} else {
					this.editListNuber.orderStatus = 'returns'
				}
				if(e.content.text === '删除') {
					this.deleteId.push(id)
					console.log(this.deleteId);
					this.deletes()
					// 在数据列表中获取删除数据的索引，然后通过索引在数组中删除
					let index = this.dataList.findIndex(v => v.id===id)
					this.dataList.splice(index,1)
					this.sum--
				} else if(e.content.text === '发货') {
					this.editListNuber.id = id
					this.editListNuber.orderStatus = ''
					this.editListNuber.orderText = ''
					this.editListNuber.orderNumber = ''
					this.$refs.popup.open()
				} else if (e.content.text === '收货') {
					this.editListNuber.id = id
					this.editListNuber.number = ''
					this.editListNuber.orderNumber = ''
					this.editListNuber.orderText = '仓库已收货'
					this.$refs.popupRefund.open()
				} else if(e.content.text === '售后发货') {
					this.editListNuber.id = id
					this.editListNuber.number = ''
					this.editListNuber.orderText = ''
					this.$refs.popup.open()
				} else {
					// console.log("修改按钮点击",value);
					uni.navigateTo({
						 url: `/pages/order/newOrder/index?id=${id}`
					});
				}
			},
			// 滚动栏触底加载事件
			bottomList() {
				if(this.getList.start < Math.ceil(this.sum / this.getList.limit)) {
					this.getList.start++
					this.getLists()
					return
				}
				this.loading = 'noMore'
			},
			// 点击列表
			handleitem(id) {
				// 在多选按钮显示的时候
				if(this.checkboxShow === true) {
					this.handleItemChange(id)
					return
				}
				// 多选按钮不显示时候  跳转
				uni.navigateTo({
					url: `/pages/order/orderdetail/index?id=${id}`,
					animationType: 'slide-in-right',
    				animationDuration: 300
				});
				console.log("ss");
			},
			// 单选
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
			// 点击批量删除
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
			// 关闭对话框
			close(done){
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
				done()
			},
			// 物流输入框对话框按下确认按钮
			async confirm(done,value){
				if(value==='') {
					uni.showToast({
						title: '请输入物流订单号',
						icon: 'none'
					});
					return
				}
				if(this.editListNuber.orderStatus === '') {
					// 新订单发货
					this.editListNuber.number = value
				} else {
					// 售后订单发货
					this.editListNuber.orderNumber = value
				}
				const res = await this.request({url:'/logistics',data:this.editListNuber,method:'post'})
				if (res.success !== 200) {
					done()
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					return
				}
				done()
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
				this.dataList = []
				this.getLists()
			},
			// 确认已收货
			async confirmRefund(done) {
				const res = await this.request({url:'/logistics',data:this.editListNuber,method:'post'})
				if (res.success !== 200) {
					done()
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					return
				}
				done()
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
				let index = this.dataList.findIndex(v => v.id === this.editListNuber.id)
				this.dataList.splice(index,1)
			}
		},
		components: {
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
	.content {
		background-color: #f7f7f7;
	}
	.list_content_scroll {
		padding-bottom: 15rpx;
		height: calc(100vh - 152rpx);
		.content_action {
			.list_content{
				display: flex;
				justify-content: center;
				align-items: center;
				.list_select {
				padding-left: 10rpx;
				flex: 1;
			}
				.content_card {
					padding: 0 20rpx;
					padding-right: 0;
					flex: 15;
					background-color: #fff;
					margin: 10rpx 0;
					.content_card_item {
						// height: 92rpx;
						background-color: #fff;
						padding: 0;
					}
				}
			}
			
		}
	}
	.content_card_item {
		display: flex;
		justify-content: center;
		width: 100%;
		.content_item_left {
			flex: 10;
			padding: 10rpx 0;
		}
		.content_item_right {
			flex: 6;
			padding-right: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.content_item_name {
				
			}
			.tag {
				display: inline-block	;
				width: 120rpx;
			}
		}
	}

	.bottom_tool {
		position: fixed;
		bottom: 90rpx;
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
