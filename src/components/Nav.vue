<template>
    <view>
        <!-- 导航、搜索栏 -->
        <uni-nav-bar fixed="true" background-color="#fb824e" color="#fff" @clickLeft="handleClickLeft" @clickRight="handleClickRight">
            <view slot="left" class="iconfont icon-bianji"></view>
            <view class="nav_content">
                <view class="nav_seek_option">
                    <picker mode="selector"  :value="pickerIndex" :range="pickerArray" class="select" @change="bindPickerChange">
                        <view class="select_text">{{pickerArray[pickerIndex]}}</view>
                        <view class="select_icon"></view>
                    </picker>
                </view>
            <view class="nav_seek">
                <view class="iconfont icon-sousuo"></view>
                <!--  keydown.enter是键盘回车键监听 confirm才是手机端回车确认键   -->
                <input placeholder-style="color:#fff" v-model="seekInput" placeholder="输入搜索关键字" @confirm="handleEnterClick">
            </view>
            </view>
            <view slot="right" class="iconfont icon-tianjia"></view>
        </uni-nav-bar>
        <!-- 分段器 -->
        <view class="title_inner" v-if="items.length>1">
            <scroll-view scroll-x="true" scroll-y="false"  class="title_scroll_view">
                <text  v-for="item in items" :class="{title_inner_text:'title_inner_text',acter:item.id===current?'acter':''}" :key="item.id" @click="onClickItem(item.id)">{{item.title}}</text>
            </scroll-view>
        </view>
    </view>
</template>
<script>
import {uniNavBar,uniSegmentedControl} from '@dcloudio/uni-ui'
export default {
    data() {
        return {
            // 搜索输入框
            seekInput: ""
        }
    },
    props: {
        // 下拉滚动选择器 列表
        pickerArray: Array,
        // 下拉滚动选择器 索引
        pickerIndex: Number,
        // 选项卡列表
        items: Array,
        // 顶部选项卡索引
        current: Number
    },
    methods: {
        // 点击编辑按钮
        handleClickLeft() {
            this.$emit("handleClickLeft",true)
        },
        // 选择按钮状态发生改变
        bindPickerChange(event) {
            const index = event.detail.value
            this.$emit("bindPickerChange",index)
            // this.pickerIndex = event.detail.value
        },
        // 按下回车键进行搜索
        handleEnterClick () {
            this.$emit("handleEnterClick",this.seekInput)
        },
        // 点击添加按钮
        handleClickRight() {
            this.$emit("handleClickRight",true)
        },
        // 切换顶部滚动选项卡
        onClickItem(index) {
            this.$emit("onClickItem",index)
            // this.current = index
        }
    },
    components: {uniNavBar,uniSegmentedControl}
}
</script>

<style lang="scss" scoped>
    .icon-bianji {
        padding-left: 25rpx;
    }
    .iconfont {
    font-size: 40rpx;
    }
    .nav_content {
        margin: 0 auto;
        display: flex;
        justify-items: center;
        align-items: center;
        .select {
            position: relative;
        .select_text {
            background-color: #fd9c72;
            height: 45rpx;
            margin-right: 20rpx;
            padding-left: 15rpx;
            text-align: center;
            line-height: 45rpx;
            margin-left: -40rpx;
            width: 120rpx;
             overflow: hidden;
            font-size: large;
            white-space: nowrap;
            text-overflow: ellipsis;
            border-radius: 5rpx;
            font-size: 26rpx;
        }
        .select_icon {
                width: 30rpx;
                height: 30rpx;
                border: 5rpx solid #fdc2a9;
                position: absolute;
                right: 20rpx;
                bottom: 0rpx;
                border-top: none;
                border-left: none;
                background-color: rgba($color: #ff6f32, $alpha: .0);
            }
    }
    .nav_seek {
        color: #fff;
        background-color: #fd9c72;
        border-radius: 30rpx ;
        height: 56rpx;
        position: relative;
        display: flex;
        align-items: center;
        .iconfont {
            position: absolute;
            z-index: 100;
            color: #fff;
            left: 10rpx;
            font-size: 32rpx;
            padding-left: 10rpx;
            margin-top: 5rpx;
        }
        input {
            margin-left: 60rpx;
            color: #fff;   
            font-size: 27rpx;
            padding-right: 20rpx;
        }
    }
    }
    .title_inner {
        // border-bottom: 1rpx solid #9c9c9c;
        margin-bottom: 10rpx;
        height: 65rpx;
        background-color: #fff;
        .title_scroll_view {
            width: 100%;
	        height: 65rpx;
            overflow: hidden;
            padding: 0 20rpx;
 	        white-space: nowrap;
            .title_inner_text {
            padding: 0 20rpx;
            line-height: 58rpx;
            display: inline-block;
            }
        }
    }
    .acter {
        color: #fb824e;
        font-weight: 550;
        font-size: 30rpx;
    }
</style>