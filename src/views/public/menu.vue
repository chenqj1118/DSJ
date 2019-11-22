<template>
    <div class="menuBox">
        <el-menu
        :default-active="$route.path" 
        background-color="#435e93"
        text-color="#fff"
        active-text-color="#fff"
        router>
        <el-menu-item index="/homeIndex">
            <i class="icon1"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/basic">
            <i class="icon2"></i>
            <span slot="title">基本水平</span>
        </el-menu-item>
        <el-menu-item index="/quality">
            <i class="icon3"></i>
            <span slot="title">质量水平</span>
        </el-menu-item>
        <el-menu-item index="/behavior">
            <i class="icon4"></i>
            <span slot="title">行为水平</span>
        </el-menu-item>
        <el-menu-item index="/credit">
            <i class="icon5"></i>
            <span slot="title">信用水平</span>
        </el-menu-item>
        <el-menu-item index="/service">
            <i class="icon6"></i>
            <span slot="title">服务水平</span>
        </el-menu-item>
        <el-menu-item index="/cooperation">
            <i class="icon7"></i>
            <span slot="title">合作水平</span>
        </el-menu-item>
        <el-menu-item index="/evaluate">
            <i class="icon8"></i>
            <span slot="title">综合评价水平</span>
        </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    name:'menuBox'
}
</script>
<style lang="scss" scoped>
.menuBox{
    width: 240px;
    background: #435e93;
    height: 100%;
    position: fixed;
    i{
        display: inline-block;
        width: 27px;
        height: 27px;
        margin: 0 10px 0 20px;
        background-size: 100% !important;
    }
    & .icon1{
        background: url('../../assets/images/icon-home.png') center;
    }
    & .icon2{
        background: url('../../assets/images/icon-basicLevel.png') center;
    }
    & .icon3{
        background: url('../../assets/images/icon-qualityLevel.png') center;
    }
    & .icon4{
        background: url('../../assets/images/icon-behavior.png') center;
    }
    & .icon5{
        background: url('../../assets/images/icon-credit.png') center;
    }
    & .icon6{
        background: url('../../assets/images/icon-service.png') center;
    }
    & .icon7{
        background: url('../../assets/images/icon-cooperate.png') center;
    }
    & .icon8{
        background: url('../../assets/images/icon-overall.png') center;
    }
}
</style>
