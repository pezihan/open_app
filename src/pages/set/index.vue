<template>
    <view class="content">
        <view class="content_item_input"><input class="uni-input" v-model="userUrl" placeholder="请输入数据接口地址" /></view>
        <view class="content_item_fault"><button type="primary" @click="hanleDefault">恢复默认</button></view>
        <view class="content_item_set"><button type="warn" @click="handleUserSet">确认修改</button></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userUrl: ''
        }
    },
    onLoad() {
        let userUrl = uni.getStorageSync('userUrl')
        if(!userUrl) {
            // 如果没有自定义的接口地址  退出此函数
            return
        }
        this.userUrl = userUrl
    },
    methods:{
        // 默认地址
        hanleDefault() {
            uni.setStorageSync('userUrl', '')
            uni.showToast({
                title: '已恢复默认',
                icon: 'success'
            })
        },
        // 自定义
        handleUserSet() {
            if(!this.userUrl) {
                uni.showToast({
                    title: '请输入接口地址',
                    icon: 'none'
                });
                return
            }
            uni.setStorageSync('userUrl', this.userUrl)
            uni.showToast({
                title: '已完成修改',
                icon: 'success'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    page{
        background-color: #f7f7f7;
    }
    .content {
        position: relative;
        .content_item_input {
            background-color: #fff;
            width: 100vw;
            height: 200rpx;
            border: 20rpx solid #f7f7f7;
            position: absolute;
            top: 200rpx;
            .uni-input {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                border: 1rpx solid rgb(212, 212, 212);
                border-left: none;
                border-right: none;
                height: 70rpx;
                width: 100%;
                padding: 0 20rpx;
                font-weight: 550;
            }
        }

        .content_item_fault {
            position: absolute;
            width: 80%;
            top: 760rpx;
            left: 50%;
            transform: translateX(-50%);
            button {
                width: 100%;
            }
        }

        .content_item_set {
            position: absolute;
            width: 80%;
            top: 900rpx;
            left: 50%;
            transform: translateX(-50%);
            button {
                width: 100%;
            }
        }
    }
</style>