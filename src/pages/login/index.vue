<template>
    <view class="content">
        <image class="background" src="../../static/login.jpg"></image>
        <view class="content_item">
            <image class="logo" src="../../static/logo.png" mode="widthFix"></image>
            <view class="user"><input placeholder-style="color:#fff" type="text" v-model="useerList.username" placeholder="请输入账号"/></view>
            <view class="password"><input placeholder-style="color:#fff" type="password" v-model="useerList.password" placeholder="请输入密码"/></view>
            <view class="login" @click="handleLogin"><button type="primary">登录</button></view>
        </view>
        <navigator url="/pages/set/index" open-type="navigate"  class="set">
            <button type="warn">接口设置</button>
        </navigator>
    </view>
</template>

<script>
export default {
    data() {
        return {
            useerList: {
                username: 'admin',
                password: 'admin'
            }
        }
    },
    mounted() {

    },
    methods:{
        // 登录
        async handleLogin () {
            if (this.useerList.username === '') {
                uni.showToast({
                    title: '请输入账号',
                    icon: "none"
                });
                return 
            } else if (this.useerList.password === '') {
                uni.showToast({
                    title: '请输入密码',
                    icon: "none"
                });
                return 
            }
            const res = await this.request({url:'/login',data: this.useerList,method:'post'})
            // console.log(res);
            if (res.success !== 200) {
                uni.showToast({
                    title: '密码或账号错误！',
                    icon: "none"
                });
                return
            }
            uni.setStorageSync('userinfo', res.message);
            uni.setStorageSync('token', res.tokenKey);
            uni.switchTab({
                 url: '../order/index'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    page {
        background-color: rgb(243, 172, 141);
    }
    .content {
        width: 100vw;
        height: 100vh;
        position: relative;
        .background {
            width: 100vw;
            height: 100vh;
            margin: 0 auto;
            top: 50%;
            transform: translateY(-50%);
            filter: blur(20rpx);
        }
        .content_item {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            .logo {
                width: 140rpx;
                left: 50%;
                transform: translateX(-50%);
                top: 200rpx;
            }
            .user {
                position: absolute;
                background-color: #fff;
                width: 500rpx;
                left: 50%;
                transform: translateX(-50%);
                top: 500rpx;
                height: 80rpx;
                border-radius: 40rpx;
                background: rgba(0, 0, 0, .2);
                input {
                    height: 80rpx;
                    padding: 0 30rpx;
                    font-size: 32rpx;
                    font-weight: 550;
                    color: #fff;
                }
            }
            .password {
                position: absolute;
                background-color: #fff;
                width: 500rpx;
                left: 50%;
                transform: translateX(-50%);
                top: 700rpx;
                height: 80rpx;
                border-radius: 40rpx;
                background: rgba(0, 0, 0, .2);
                input {
                    height: 100%;
                    padding: 0 30rpx;
                    font-size: 30rpx;
                    color: #fff;
                }
            }
            .login {
                position: absolute;
                background-color: #fff;
                width: 500rpx;
                left: 50%;
                transform: translateX(-50%);
                top: 900rpx;
                height: 80rpx;
                border-radius: 40rpx;
                overflow: hidden;
                button {
                    line-height: 80rpx;
                }
            }
        }
    }
    .set {
        position: absolute;
        top: 1050rpx;
        left: 50%;
        height: 80rpx;
        transform: translateX(-50%);
        border-radius: 40rpx;
        overflow: hidden;
        width: 500rpx;
        button{
            height: 100%;
            line-height: 80rpx;
        }
    }
</style>