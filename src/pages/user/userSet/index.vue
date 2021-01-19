<template>
    <view>
        <uni-nav-bar left-icon="back" left-text="返回"  status-bar fixed="true" background-color="#fb824e" color="#fff" 
        @clickLeft="handleClickLeft" @clickRight="handleClickRight">
            <view slot="right" class="iconfont icon-tianjia"></view>
        </uni-nav-bar> 

        <!-- 内容显示 -->
        <scroll-view scroll-y enable-back-to-top @scrolltolower="bottomList" class="list_content_scroll">
			<uni-swipe-action class="content_action">
				<view class="list_content" v-for="item in usersList" :key="item.id" >
					<uni-swipe-action-item :right-options="options"  @click="onClick($event,item.id)">
						<view class="content_card_item" @click.stop="handleitem(item.username,item.password)">
							<view>
                                <view><h4>{{item.employeeName}}</h4></view>
							    <view>性别：{{item.sex}}</view>
                            </view>
							<view>出生日期：{{item.birthday | dateBirth}}</view>
							<view>住址：{{item.address}}</view>
							<view>部门：{{item.department}}</view>
							<view>岗位：{{item.job}}</view>
                            <view>员工编号：{{item.employeeID}}</view>
                            <view>
								<text>账户类型：</text>
								<uni-tag class="tag" v-if="item.type===0" size="small" type="warning" :text="item.text"></uni-tag>
								<uni-tag class="tag" v-else size="small" type="primary" :text="item.text"></uni-tag>
							</view>
						</view>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
			<!-- 底部加载动画 -->
			<uni-load-more :status="loading"></uni-load-more>
		</scroll-view>

        <!-- 弹出式确认框 -->
        <uni-popup  ref="popupRefund" type="dialog">
            <uni-popup-dialog   type="info" mode="base" title="提示" :content="userMessage" :duration="2000" :before-close="true" @close="close" @confirm="close"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import {uniNavBar,uniSwipeActionItem,uniSwipeAction,uniTag,uniLoadMore,uniPopup,uniPopupDialog} from '@dcloudio/uni-ui'
export default {
    data() {
        return{
            // 用户列表
            usersList: [],
            // 提交服务端的数据
            getList: {
                start: 1,
                limit: 10,
                employeeID: '',
                employeeName: ''
            },
            // 数据总条数
            sum:null,
            // 加载动画效果类型
            loading: 'loading',
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
            userMessage: '用户账户信息'
        }
    },
    // 上拉刷新
		onPullDownRefresh() {
			// uni.startPullDownRefresh()
			this.getList.start = 1
			this.usersList = []
			this.gitUsers()
			uni.stopPullDownRefresh()
		},
    onLoad() {
        this.gitUsers()
    },
    methods: {
        // 获取用户列表
        async gitUsers() {
            const res = await this.request({url:'/userList',data:this.getList,method:'get'})
            if (res.success !== 200) {
                uni.showToast({
                    title: '获取用户列表失败',
                    icon: 'none'
                });
                return
            }
            res.message.forEach(v => {
                v.sex = v.sex === 0 ? '男' : '女'
                v.text = v.type === 0 ? '管理员' : '普通账户'
            })
            this.usersList = [...this.usersList,...res.message]
            this.sum = res.sum
            if (res.message.length < this.getList.limit) {
                this.loading = 'noMore'
            }
        },
        // 返回
        handleClickLeft() {
            uni.navigateBack({
                 delta: 1
            });
        },
        // 添加
        handleClickRight() {
            uni.navigateTo({
                 url: '/pages/user/userSet/newUser/index'
            });
        },
        // 滚动到底部加载
        scrolltolower() {
            if(this.getList.start < Math.ceil(this.sum / this.getList.limit)) {
					this.getList.start++
					this.getLists()
					return
				}
				this.loading = 'noMore'
        },
        // 关闭对话框
		close(done){
			// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
			done()
        },
        // 点击列表项
        handleitem(username,password){
            this.userMessage = '用户名：' + username + '  - ' + '密码：' + password
            this.$refs.popupRefund.open()
        },
        // 滚动选项操作
        async onClick(e,id) {
            if(e.content.text === '删除') {
                const res = await this.request({url:'/deluserId',data:{id:id},method:'post'})
                if (res.success !== 200) {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    });
                    return
                }
                uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                });
                if (id === Number(uni.getStorageSync('userinfo').id)) { // 如果删除的登录正在的账户清除sessionStorage 并且跳转到登录页
                    uni.setStorageSync('userinfo', '')
                    uni.setStorageSync('token', '')
                    uni.redirectTo({
                         url: '/pages/login/index'
                    });
                } else {
                    let index = this.usersList.findIndex(v => v.id === id)
                    this.usersList.splice(index,1)
                }
            } else {
                uni.navigateTo({
                 url: `/pages/user/userSet/newUser/index?id=${id}`
                });
            }
        }
    },
    components: {
        uniNavBar,
        uniSwipeActionItem,
        uniSwipeAction,uniTag,
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
    .list_content_scroll {
        .content_action {
            .list_content {
                margin-top: 30rpx;
                .content_card_item {
                    width: 100vw;
                    background-color: #fff;
                    // margin-top: 30rpx;
                    padding: 20rpx;
                    view {
                        padding: 5rpx 0;
                    }
                    :nth-child(1) {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    :nth-child(7) {
                        display: flex;
                        align-items: center;
                    }
                    .tag {
                        width: 100rpx;
                    }
                }
            }
        }
    }
</style>