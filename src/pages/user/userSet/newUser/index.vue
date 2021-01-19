<template>
    <view>
        <uni-card class="content_item">
            <view class="content_item_one">
                <text>姓名：</text>
                <input type="text" placeholder="请输入姓名" v-model="editUserList.employeeName"/>
            </view>
            <view class="content_item_two">
                <text>性别：</text>
                <picker @change="bindPickerChange($event,0)" :value="sexIndexs" :range="sexArray">
                    <view class="uni-input">{{sexArray[sexIndexs]}}</view>
                </picker>
            </view>
            <view class="content_item_one">
                <text>住址：</text>
                <input type="text" v-model="editUserList.address" placeholder="请输入住址"/>
            </view>
            <view class="content_item_three">
                <text>出生日期：</text>
                <picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
                    <picker-view-column>
                        <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
                    </picker-view-column>
                </picker-view>
            </view>
            <view class="content_item_two">
                <text>部门：</text>
                <picker @change="bindPickerChange($event,1)" :value="departmentIndexs" :range="departmentArray">
                    <view class="uni-input">{{departmentArray[departmentIndexs]}}</view>
                </picker>
            </view>
            <view class="content_item_two">
                <text>岗位：</text>
                <picker @change="bindPickerChange($event,2)" :value="jobIndexs" :range="jobArray">
                    <view class="uni-input">{{jobArray[jobIndexs]}}</view>
                </picker>
            </view>
            <view class="content_item_one">
                <text>员工编号：</text>
                <input type="text" v-model="editUserList.employeeID" placeholder="请输入员工编号"/>
            </view>
            <view class="content_item_one">
                <text>账号：</text>
                <input type="text" v-model="editUserList.username"  placeholder="请输入账号"/>
            </view>
            <view class="content_item_one">
                <text>密码：</text>
                <input type="password" v-model="editUserList.password" placeholder="请输入姓名"/>
            </view>
            <view class="content_item_two">
                <text>类型：</text>
                <picker @change="bindPickerChange($event,3)" :value="typeIndexs" :range="typeArray">
                    <view class="uni-input">{{typeArray[typeIndexs]}}</view>
                </picker>
            </view>
        </uni-card>
        <view class="content_button">
            <button type="primary" @click="handleitemYes">确认</button>
            <navigator open-type="navigateBack"><button type="warn">取消</button></navigator>
        </view>
    </view>
</template>

<script>
import {uniCard } from '@dcloudio/uni-ui'
export default {
    data() {
        // 时间选择器 时间变量
        const date = new Date()
            const years = []
            const year = date.getFullYear()
            const months = []
            const month = date.getMonth() + 1
            const days = []
            const day = date.getDate()
            for (let i = 1990; i <= date.getFullYear(); i++) {
                years.push(i)
            }
            for (let i = 1; i <= 12; i++) {
                months.push(i)
            }
            for (let i = 1; i <= 31; i++) {
                days.push(i)
            }
        return {
            // 添加用户数据（提交到服务器）
            editUserList: {
                id: null,
                employeeName: '',
                sex: '请选择',
                address: '',
                birthday: null,
                department: '请选择',
                job: '请选择',
                employeeID: '',
                username: '',
                password: '',
                type: 1,
                openr: uni.getStorageSync('userinfo').employeeName
            },
            // 性别：
            sexArray: ['请选择','男','女'],
            // 选择框索引
            sexIndexs:0,
            // 部门
            departmentArray: ['请选择','人力资源部', '行政部', '设计部', '市场部', '财务部', '客服部', '售后部'],
            // 选择框索引
            departmentIndexs:0,
            // 岗位
            jobArray:['请选择','仓管员', '财务', '客服', '设计师', '秘书', '文员', '行政', '经理', '店长', '助理', '采购员'],
            // 选择框索引
            jobIndexs:0,
            // 账号类型
            typeArray: ['管理员','普通账户'],
            // 选择框索引
            typeIndexs:1,
            // 时间选择器参数
            title: 'picker-view',
                years,
                year,
                months,
                month,
                days,
                day,
                value: [9999, month - 1, day - 1],
                visible: true,
                indicatorStyle: `height: 80rpx;`
        }
    },
    async onLoad(option) {
        if(!option.id) {
            uni.setNavigationBarTitle({
            title: '添加用户'
             });
            return
        }
        uni.setNavigationBarTitle({
            title: '编辑用户'
        });
         const res = await this.request({url:'/userId',data:option,method:'get'})
        if (res.success !== 200) {
            uni.showToast({
                title: '获取用户数据失败',
                duration: 2000
            });
            // 返回上一页
            uni.navigateBack({
                animationType: 'slide-out-right',
    			animationDuration: 300
            })
            return
        }
        this.editUserList.id = res.message.id
        this.editUserList.employeeName = res.message.employeeName
        this.editUserList.sex = res.message.sex
        this.editUserList.address = res.message.address
        this.editUserList.birthday = res.message.birthday
        this.editUserList.department = res.message.department
        this.editUserList.job = res.message.job
        this.editUserList.employeeID = res.message.employeeID
        this.editUserList.username = res.message.username
        this.editUserList.password = res.message.password
        this.editUserList.type = res.message.type
        
        this.sexIndexs = this.editUserList.sex + 1
        this.typeIndexs = this.editUserList.type
        this.departmentIndexs = this.departmentArray.findIndex(v =>  v === res.message.department)
        this.jobIndexs = this.jobArray.findIndex(v =>  v === res.message.job )

        // 处理时间
        const dt = new Date(res.message.birthday * 1000)
        this.year = dt.getFullYear() // 年
        this.month= (dt.getMonth() + 1 + '').padStart(2, '0') // 月
        this.day = (dt.getDate() + '').padStart(2, '0') // 日
        this.value = [this.year-1990,this.month-1,this.day-1]
        console.log(this.value);
        console.log(this.years);
        console.log(this.year);
    },
    methods: {
        // 时间选择器函数
        bindChange: function (e) {
            const val = e.detail.value
            this.year = this.years[val[0]]
            this.month = this.months[val[1]]
            this.day = this.days[val[2]]
            // 将时间转换成时间戳
            this.editUserList.birthday = Number(new Date(this.year, this.month, this.day)) / 1000
        },
        // 普通选择器
        bindPickerChange(e,index) {
            // console.log(e.target.value,index);
            if(index === 0) {
                this.sexIndexs = e.target.value
                this.editUserList.sex = e.target.value === 0 ? '请选择' : e.target.value - 1
            } else if(index === 1) {
                this.departmentIndexs = e.target.value
                this.editUserList.department = this.departmentArray[e.target.value]
            } else if(index === 2) {
                this.jobIndexs = e.target.value
                this.editUserList.job = this.jobArray[e.target.value]
            } else if(index === 3) {
                this.typeIndexs = e.target.value
                this.editUserList.type = e.target.value
            }
        },
        // 提交数据
        async handleitemYes() {
            if (this.editUserList.employeeName === '' || this.editUserList.sex === '请选择' || this.editUserList.address === '' || this.editUserList.birthday === null || this.editUserList.department === '请选择' || this.editUserList.job === '请选择' || this.editUserList.employeeID === '' || this.editUserList.username === '' || this.editUserList.password === '') {
                uni.showToast({
                    title: '请填写完整表单信息',
                    icon: 'none'
                });
                return 
            }
            const res = await this.request({url:'/useredit',data:this.editUserList,method:'post'})
            if (res.success !== 200) {
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                });
                return
            }
            uni.showToast({
                title: '提交成功',
                icon: 'success'
            });
            uni.navigateBack({
                 delta: 1
            });
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
    .picker-view {
        width: 500rpx;
        height: 60rpx;
        margin-top: 20rpx;
        border: 1rpx solid #999;
        line-height: 60rpx;
    }
    .item {
        height: 80rpx;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .content_item {
        .content_item_one {
            display: flex;
            align-items: center;
            margin: 20rpx 0;
            input {
                border: 1rpx solid rgb(226, 226, 226);
                height: 60rpx;
                padding: 0 10rpx;
            }
        }
        .content_item_two {
            display: flex;
            align-items: center;
            margin: 20rpx 0;
            picker {
                border: 1rpx solid rgb(226, 226, 226);
                height: 60rpx;
                padding: 0 10rpx;
                line-height: 60rpx;
            }
        }
        .content_item_three {
            display: flex;
            align-items: center;
            margin: 20rpx 0;
            picker-view {
                padding: 0;
                margin-top: -5rpx;
                border: 1rpx solid rgb(226, 226, 226);
            }
        }
    }

    .content_button {
        padding: 30rpx;
        :nth-child(1) {
            border-radius: 50rpx;
            // margin-bottom: 20rpx;
        }   
        :nth-child(2) {
            border-radius: 50rpx;
            margin: 40rpx 0;
        }
        ::after {
            border: none;
        }
    }
</style>