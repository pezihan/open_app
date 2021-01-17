<template>
    <view class="content">
        <uni-card class="content_item">
            <view class="content_item_one">
                <text><h4>产品名称：</h4></text>
                <input type="text" placeholder="请输入产品名称" v-model="editCommodity.commodity">
            </view>
            <view class="content_item_one">
                <text><h4>产品编号：</h4></text>
                <input type="text" placeholder="请输入产品编号" v-model="editCommodity.product">
            </view>
            <view class="content_item_one">
                <text><h4>产品单价：</h4></text>
                <input type="number" placeholder="请输入产品单价" v-model="editCommodity.univalence">
            </view>
            <view class="content_item_one">
                <text><h4>产品库存：</h4></text>
                <input type="number" placeholder="请输入产品库存" v-model="editCommodity.repertory">
            </view>
        </uni-card>
        <view class="content_button">
            <button type="primary" @click="hanleorder">确认</button>
            <button type="warn" @click="hanleno">取消</button>
        </view>
    </view>
</template>

<script>
import {uniCard } from '@dcloudio/uni-ui'
export default {
    data() {
        return {
            // 添加与修改面板的数据
            editCommodity: {
                id: null,
                product: '',
                univalence: null,
                commodity: '',
                repertory: null,
                operator: uni.getStorageSync('userinfo').employeeName
            }
        }
    },
    async onLoad(option) {
        if(!option.id) {
            return
        }
        const res = await this.request({url:'/editCommodId',data:option,method:'post'})
        if (res.success !== 200) {
            uni.showToast({
                title: '获取产品数据失败',
                duration: 2000
            });
            // 返回上一页
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
            return
        }
        this.editCommodity.id = res.message.id
        this.editCommodity.product = res.message.product
        this.editCommodity.univalence = res.message.univalence
        this.editCommodity.commodity = res.message.commodity
        this.editCommodity.repertory = res.message.repertory
    },
    methods:{
        // 确认提交
        async hanleorder() {
            if(this.editCommodity.product == '' || this.editCommodity.univalence == null || this.editCommodity.commodity == '' || this.editCommodity.repertory == null) {
                uni.showToast({
                    title: '请填写完整产品信息',
                    duration: 2000
                });
                return
            }
            const res = await this.request({url:'/editCommodity',data:this.editCommodity,method:'post'})
            if (res.success !== 200) {
                uni.showToast({
                    title: '提交失败，请重试',
                    duration: 2000
                });
                return
            }
            uni.showToast({
                    title: '提交成功',
                    duration: 2000
            });
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
        },
        // 取消提交
        hanleno() {
            // 返回上一页
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
        }
    },
    components:{
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
                justify-content: center;
                align-items: center;
                padding: 20rpx 0;
                text {
                    width: 200rpx;
                }
                input {
                    width: 100%;
                    height: 60rpx;
                    border: 1rpx solid rgb(228, 228, 228);
                }
            }
        }
        .content_button {
            padding: 30rpx;
            button {
                margin: 50rpx 0;
                border-radius: 50rpx;
            }
        }
    }
</style>