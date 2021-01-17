<template>
    <view>
        <uni-card>
            <view class="item">
                <h4>原密码：</h4>
                <input type="password" v-model="password.former" placeholder="请输入原密码" password />
            </view>
            <view class="item">
                <h4>新密码：</h4>
                <input type="password" v-model="password.newPass1" placeholder="请输入新密码" password />
            </view>
            <view class="item">
                <h4>再次输入：</h4>
                <input type="password" v-model="password.newPass2" placeholder="再次输入新密码" password />
            </view>
        </uni-card>
        <view  class="item_button">
            <button type="primary" @click="yespass">确定</button>
            <navigator open-type="navigateBack">
                <button type="warn" >取消</button>
            </navigator>
        </view>
    </view>
</template>

<script>
import {uniCard } from '@dcloudio/uni-ui'
export default {
    data() {
        return{
            // 密码信息
            password: {
                id: null,
                former: '',
                newPass1: '',
                newPass2: ''
            },
        }
    },
    onLoad(option) {
        this.password.id = option.id
    },
    methods: {
        // 修改密码
        async yespass() {
            if (this.password.former === '') {
                uni.showToast({
                    title: '请输入旧密码',
                    icon: 'none'
                });
            } else if (this.password.newPass1 === '') {
                uni.showToast({
                    title: '请输入新密码',
                    icon: 'none'
                });
            } else if (this.password.newPass2 === '') {
                uni.showToast({
                    title: '请再次确认新密码',
                    icon: 'none'
                });
            } else if (this.password.newPass1 !== this.password.newPass2) {
                uni.showToast({
                    title: '两次密码输入不一样',
                    icon: 'none'
                });
            } else {
                const res = await this.request({url:'/passwordId',data: this.password,method:'post'})
                if (res.success !== 200) {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    });
                    return 
                }
                uni.showToast({
                    title: '修改成功',
                    icon: 'success'
                });
                uni.redirectTo({
                     url: '/pages/login/index'
                });
            }
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
    .item {
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        input {
            border: 1rpx solid rgb(224, 224, 224);
            flex: 1;
            height: 60rpx;
        }
    }
    .item_button {
        padding: 30rpx;
        button {
            border-radius: 50rpx;
            margin: 50rpx 0;
        }
    }
</style>