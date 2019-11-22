<template>
    <div class="menuBox">
        <el-menu
        :default-active="$route.path" 
        background-color="#435e93"
        text-color="#fff"
        active-text-color="#fff"
        router>
            <el-menu-item index="/depotManage/overviews">
                <i class="icon1"></i>
                <span slot="title">库存概况</span>
            </el-menu-item>
            <el-menu-item index="/depotManage/forecasts">
                <i class="icon2"></i>
                <span slot="title">需求预测</span>
            </el-menu-item>
            <el-menu-item index="/depotManage/safety_stocks">
                <i class="icon3"></i>
                <span slot="title">安全库存</span>
            </el-menu-item>
            <el-menu-item index="/depotManage/stockings">
                <i class="icon4"></i>
                <span slot="title">备货量</span>
            </el-menu-item>
            <el-menu-item index="/depotManage/suppliers">
                <i class="icon5"></i>
                <span slot="title">智能选商</span>
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
        background-size: 100% !important ;
    }
    & .icon1{
        background: url('../../../assets/images/depot/icon-compare.png') center;
    }
    & .icon2{
        background: url('../../../assets/images/depot/icon-forecasts.png') center;
    }
    & .icon3{
        background: url('../../../assets/images/depot/icon-safe.png') center;
    }
    & .icon4{
        background: url('../../../assets/images/depot/icon-stockings.png') center;
    }
    & .icon5{
        background: url('../../../assets/images/depot/icon-suppliers.png') center;
    }
}
</style>
