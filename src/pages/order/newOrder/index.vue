<template>
    <view class="content">
        <uni-card class="content_item">
            <view class="content_item_one">
                <text>订单编号：</text>
                <input type="text" v-model="editList.employeeID">
            </view>
            <view class="content_item_one">
                <text>姓名：</text>
                <input type="text" v-model="editList.employeeName">
            </view>
            <view class="content_item_one">
                <text>电话：</text>
                <input type="number" v-model="editList.phone">
            </view>
            <view class="content_item_one">
                <text>地址：</text>
                <input type="text" v-model="editList.address">
            </view>
            <view class="content_item_one">
                <text>商品：</text>
                <picker @change="bindPickerChange" :value="index" :range="commodityArrty" class="content_item_pickey">
                    <view class="uni-input">{{commodityArrty[index]}}</view>
                </picker>
            </view>
            <view class="content_item_two">
                <text>单价：</text>
                <input type="number" v-model="editList.univalence" class="content_item_input" @change="handleInputNumber"/>
            </view>
            <view class="content_item_one">
                <text>数量：</text>
                <uni-number-box :min="1" @change="bindChange" class="content_item_number" v-model="editList.amount"></uni-number-box>
            </view>
            <view class="content_item_one">
                <text>合计：</text>
                <view class="content_item_text">{{editList.sum}}</view>
            </view>
        </uni-card>
        <view class="content_button">
            <button type="primary" @click="hanleorder">确认</button>
            <button type="warn" @click="hanleno">取消</button>
        </view>
    </view>
</template>

<script>
import {uniNumberBox,uniCard } from '@dcloudio/uni-ui'
export default {
    data() {
        return{
            // 商品数据
            commodity:[],
            //滚动选择器内容
            commodityArrty:['请选择'],
            // 滚动选择器索引
            index:0,
            // 新建与修改订单数据
            editList: {
                id: null,
                employeeID: '',
                employeeName: '',
                phone: null,
                address: '',
                commodity: '请选择',
                commodityId: null,
                amount: 1,
                univalence: null,
                sum: 0,
                operator: uni.getStorageSync('userinfo').employeeName
            },
        }
    },
    async onLoad(option) {
        // 获取商品列表
        const res1 = await this.request({url:'/commodity',method:'get'})
        if (res1.success !== 200) {
            uni.showToast({
                title: '商品列表获取失败',
                icon: 'none'
            });
            // 返回上一页
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
            return
        }
        this.commodity = res1.message
        this.commodity.forEach(v => {
            this.commodityArrty.push(v.commodity)
        })
        if(!option.id){
            // 新建订单
            uni.setNavigationBarTitle({
                title: '新键订单'
            });
            return
        }
         // 修改订单
        uni.setNavigationBarTitle({
                title: '修改订单'
        });
        // 获取订单数据
        const res2 = await this.request({url:'/orderId',data:option,method:'get'})
        if (res2.success !== 200) {
            uni.showToast({
                title: '订单数据获取失败',
                icon: 'none'
            });
            // 返回上一页
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
            return
        }
        this.editList.id = res2.message[0].id
        this.editList.employeeID = res2.message[0].employeeID
        this.editList.employeeName = res2.message[0].employeeName
        this.editList.phone = res2.message[0].phone
        this.editList.address = res2.message[0].address
        this.editList.commodity = res2.message[0].commodity
        this.editList.commodityId = res2.message[0].commodityId
        const index = this.commodityArrty.findIndex(v => v === res2.message[0].commodity)
        this.index = index
        this.editList.amount = res2.message[0].amount
        this.editList.sum = res2.message[0].sum
        this.editList.univalence = res2.message[0].sum / res2.message[0].amount
    },
    methods:{
        // 商品数量发生变化
        bindChange(value) {
            this.editList.amount = value
            this.editList.sum = this.editList.amount * this.editList.univalence
            console.log("商品数量",value);
        },
        // 商品下拉选择框
        bindPickerChange (e) {
            this.index = e.target.value
            const index = e.detail.value - 1
            console.log((this.commodity[index]).commodity);
            this.editList.commodity = this.commodity[index].commodity
            this.editList.univalence = this.commodity[index].univalence
            this.editList.commodityId = this.commodity[index].id
            this.editList.sum = this.editList.amount * this.editList.univalence
        },
        // 单价发生变化时
        handleInputNumber() {
            this.editList.sum = this.editList.univalence * this.editList.amount
        },
        // 确认
        async hanleorder() {
            console.log(this.editList);
            if(this.editList.employeeID == '' || this.editList.employeeName == '' || this.editList.phone == null || this.editList.address == '' || this.editList.commodity == '请选择') {
                uni.showToast({
                    title: '请正确填写订单信息',
                    icon: 'none'
                });
                return
            }
            const res = await this.request({url:'/editOrder',data:this.editList,method:'post'})
            if (res.success !== 200) {
                uni.showToast({
                    title: '订单数据提交失败，请重试',
                    icon:'none'
                });
                return
            }
            uni.showToast({
                title: '订单提交成功',
                icon: 'success'
            });
            uni.navigateBack({
                 delta: 1,
                 animationType: 'slide-out-right',
                animationDuration: 200
            });
        },
        // 取消
        hanleno () {
            uni.navigateBack({
                 delta: 1,
                 animationType: 'slide-out-right',
                animationDuration: 200
            });
        }
    },
    components:{
        uniNumberBox,
        uniCard 
    }
}
</script>

<style lang="scss" scoped>
    page {
        background-color: #f7f7f7;
    }
    .content {
        .content_item {
            .content_item_one {
                display: flex;
                align-content: center;
                align-items: center;
                padding: 20rpx 0rpx;
                text {
                    font-weight: 550;
                }
                input {
                    flex: 1;
                    border: 1rpx solid rgb(206, 206, 206);
                    padding: 0 10rpx;
                    height: 60rpx;
                }
                .content_item_pickey {
                    border: 1rpx solid rgb(206, 206, 206);
                    height: 60rpx;
                    line-height: 60rpx;
                    padding: 0 10rpx;
                }
                .content_item_number {
                    // height: 0rpx;
                }
            }
            .content_item_two {
                padding: 20rpx 0rpx;
                display: inline-block;
                text {
                    font-weight: 550;
                }
                .content_item_input {
                    display: inline-block;
                    border: 1rpx solid rgb(206, 206, 206);
                    width: 120rpx;
                    height: 60rpx;
                    vertical-align: middle;
                    padding: 0 10rpx;
                }
            }
        }
        .content_item_text {
            font-size: 40rpx;
            color: red;
            font-weight: 550;
        }
        .content_button {
            padding: 30rpx;
            border-radius: 20rpx;
            button {
                margin-bottom: 40rpx;
                border-radius: 50rpx;
            }
        }
    }
</style>