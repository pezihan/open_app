<template>
    <view class="content">
        <scroll-view scroll-y enable-back-to-top class="content_item">
            <uni-card class="content_item_one">
                <view><h4>{{statusList.commodity}}</h4></view>
                <view>数量：{{statusList.amount}}</view>
                <view>金额：{{statusList.sum}}</view>
                <view>订单编号：{{statusList.employeeID}}</view>
                <view>创建时间：{{statusList.time | dateFormat}}</view>
                <view>订单操作人：{{statusList.operator}}</view>
                <view class="item_tag">
                    <text>状态：</text>
					<uni-tag class="tag" v-if="statusList.staus==='已完成'" size="small" type="success" :text="statusList.staus"></uni-tag>
					<uni-tag class="tag" v-else-if="statusList.staus==='进行中'" size="small" type="primary" :text="statusList.staus"></uni-tag>
					<uni-tag class="tag" v-else size="small" type="warning" :text="statusList.staus"></uni-tag>
                </view>
                <view><button type="warn" v-if="statusList.staus==='退货中'" @click="handleBox">确认退款</button></view>
            </uni-card>
            <uni-card class="content_item_two">
                <view>买家姓名：{{statusList.employeeName}}</view>
                <view>电话：{{statusList.phone}}</view>
                <view>收货地址：{{statusList.address}} </view>
                <view>物流单号：{{statusList.number}}</view>
                <view>物流操作人：{{statusList.cangku}}</view>
            </uni-card>
            <uni-card >
                <view class="content_item_three">
                    <view><h4>维修记录：</h4></view>
                    <view>{{statusList.maintain}}</view>
                </view>
            </uni-card>
            <uni-card >
                <view class="content_item_three">
                    <view><h4>换货记录：</h4></view>
                    <view>{{statusList.exchange}}</view>
                </view>
            </uni-card>
            <uni-card >
                <view class="content_item_three">
                    <view><h4>退货记录：</h4></view>
                    <view>{{statusList.returns}}</view>
                </view>
            </uni-card>
        </scroll-view>
        <!-- 悬浮按钮 -->
        <uni-fab :content="content" :pattern="pattern" horizontal="right" @trigger="hanleFab"></uni-fab>
        <!-- 弹出式输入框 -->
        <uni-popup  ref="popup" type="dialog">
            <uni-popup-dialog   type="input" mode="input" :title="dialogText" placeholder="请输入新增事务内容" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
        </uni-popup>
        <!-- 弹出式确认框 -->
        <uni-popup  ref="popupRefund" type="dialog">
            <uni-popup-dialog   type="info" mode="base" title="提示" content="是否确认退款" :duration="2000" :before-close="true" @close="close" @confirm="confirmRefund"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import { uniCard,uniFab,uniTag,uniPopup,uniPopupDialog} from '@dcloudio/uni-ui'
export default {
    data() {
        return {
            // 订单数据
            statusList:{},
            // 悬浮菜单展开项
            content: [
                {text:'新增维修',iconPath:'../../../static/icon/weixiu.png'},
                {text:'新增换货',iconPath:'../../../static/icon/tuihuanhuo.png'},
                {text:'新增退货',iconPath:'../../../static/icon/tuihuo.png'}
            ],
            // 悬浮菜单配置
            pattern:{
                buttonColor: "#999999"
            },
            // 新建售后事务数据（发送到服务器）
            stausEdit: {
                id: '',
                staus: '',
                stausText: ''
            },
            // 弹出框标题
            dialogText: '新增事务'
        }
    },
    onLoad(option) {
        // 页面跳转传入的id保存到售后提交的数据对象中
        this.stausEdit.id = option.id
        this.getstatus()
    },
    // 上拉刷新
	onPullDownRefresh() {
        this.statusList = {}
        this.getstatus(this.stausEdit.id)
        uni.stopPullDownRefresh()
	},
    methods:{
        // 通过订单id获取资料
        async getstatus() {
            const res = await this.request({url:'/orderId',data:{id:this.stausEdit.id},method:'get'})
            // console.log(res);
            this.statusList = res.message[0]
        },
        // 点击悬浮按钮功能
        hanleFab(e) {
            if(e.index === 0) {
                // console.log("维修");
                this.stausEdit.staus = 'maintain'
                this.dialogText = '新增维修事务'
                this.$refs.popup.open()
            } else if(e.index === 1) {
                // console.log("换货");
                this.stausEdit.staus = 'exchange'
                this.dialogText = '新增换货事务'
                this.$refs.popup.open()
            } else {
                // console.log("退货");
                this.stausEdit.staus = 'returns'
                this.dialogText = '新增退货事务'
                this.$refs.popup.open()
            }
        },
        // 关闭对话框
        close(done){
            // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
            done()
        },
        // 确认添加事务
        async confirm(done,value){
            // TODO 做一些其他的事情，手动执行 done 才会关闭对话框
            if(value==='') {
                uni.showToast({
                    title: '请输入事务内容',
                    icon: 'none'
                });
                return
            }
            this.stausEdit.stausText = value
            console.log(this.stausEdit);
            const res = await this.request({url:'/orderStaus',data:this.stausEdit,method:'post'})
            if(res.success!==200){
                done()
                uni.showToast({
                    title: '添加事务失败',
                    icon: 'none'
                });
                return
            }
            this.getstatus()
            done()
            uni.showToast({
                title: '添加事务成功',
                icon: 'success'
            });
        },
        // 点击确认退款按钮进行退款弹窗
        handleBox() {
            this.$refs.popupRefund.open()
        },
        // 确认退款
        async confirmRefund(done) {
            const res = await this.request({url:'/orderReimburse',data:{id:this.stausEdit.id},method:'post'})
            if(res.success!==200){
                done()
                uni.showToast({
                    title: '退款失败',
                    icon: 'none'
                });
                return
            }
            this.getstatus()
            done()
            uni.showToast({
                title: '退款成功',
                icon: 'success'
            });
            done()
        }
    },
    components: {
        uniCard,
        uniFab,
        uniTag,
        uniPopup,
        uniPopupDialog
    }
}
</script>

<style lang="scss" scoped>
    .content {
        padding-top: 10rpx;
        background-color: #f7f7f7;
        .content_item {
            height: calc(100vh - 90rpx);
            .content_item_one {
                view {
                    padding: 10rpx 0;
                }
                .item_tag {
                    display: flex;
                    align-items: center;
                    .tag {
                        display: inline-block	;
				        width: 120rpx;
                        padding: 0;
                        text-align: center;
                    }
                }
            }
            .content_item_two {
                view {
                    padding: 10rpx 0;
                }
            }
            .content_item_three {
                display: flex;
                // justify-content: center;
                view:nth-child(1) {
                    flex: 1;
                }
                view:nth-child(2) {
                   flex: 3;
                }
            }
        }
    }
</style>