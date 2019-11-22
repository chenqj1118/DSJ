<template>
    <div class="guideBox">
        <div class="contianer">
            <div class="header">
                <div class="logo">
                    <img src="../assets/images/logo.png"/>
                    <span>智慧物流供应链</span>
                </div>
            </div>
            <div class="contentBox">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <div class="grid-content grid-content1" title="供应商画像">
                            <router-link to="index"><img src="../assets/images/guide/icon-guide-photo.png"/><span>供应商画像</span></router-link>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" style="background:#25c0ca">
                            <router-link to=""><img src="../assets/images/guide/icon-guide-timer.png"/><span></span></router-link>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content" style="background:#546fb7">
                            <router-link to=""><img src="../assets/images/guide/icon-guide-cart.png"/><span></span></router-link>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" style="background:#80c369">
                            <router-link to=""><img src="../assets/images/guide/icon-guide-globe.png"/><span></span></router-link>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" style="background:#3082bf">
                            <router-link to="/depotManage/home"><img src="../assets/images/guide/icon-guide-box.png"/><span>库存管理</span></router-link>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'guide',
        methods: {},
    }
</script>
<style lang="scss" scoped>
    .guideBox {
        width: 100%;
        height: 100%;
        background: url(../assets/images/guide-bg.jpg) center center #050e38;
        overflow:hidden;
        position:absolute;
        .contianer {
            width: 1000px;
            margin: 0 auto;
            padding:20px 0;
            .logo{
                span{
                    color:#fff;
                    font-size: 24px;
                    margin-left:40px;
                    position: relative;
                    top:-6px;
                    &:before{
                         content: '';
                         position: absolute;
                         top: 12px;
                         left: -23px;
                         width: 7px;
                         height: 7px;
                         border-radius: 50%;
                         background: #fff;
                     }
                }
            }
            .contentBox{
                width:600px;
                position:absolute;
                left:50%;
                top:50%;
                margin-left:-300px;
                margin-top:-180px;
                .grid-content{
                    height: 170px;
                    border:2px solid transparent;
                    -webkit-filter:brightness(0.9);
                    -o-filter:brightness(0.9);
                    -moz-filter:brightness(0.9);
                    filter:brightness(0.9);
                    a{
                        display: block;
                        width:100%;
                        height:100%;
                        text-align: center;
                        position:relative;
                        img{
                            margin-top:50px;
                        }
                        span{
                            position: absolute;
                            left:20px;
                            bottom:10px;
                            color:#fff;
                            font-size:18px;
                        }
                    }
                    &:hover{
                         border-color: #fff;
                         -webkit-filter:brightness(1);
                         -o-filter:brightness(1);
                         -moz-filter:brightness(1);
                         filter:brightness(1);
                     }
                }
                .grid-content1{
                    &:hover{
                         border-color: transparent;
                        img,span{
                            display: none;
                        }
                    }
                }
            }

        }
    }

    @keyframes myfirst
    {
        from {background:#3082bf}
        to {
            background: url(../assets/images/guide/guide-img.png);
            background-size:contain;
        }
    }

    @-moz-keyframes myfirst /* Firefox */
    {
        from {background: #3082bf;}
        to {
            background: url(../assets/images/guide/guide-img.png);
            background-size:contain;
        }
    }

    @-webkit-keyframes myfirst /* Safari 和 Chrome */
    {
        from {
            background: #3082bf;
        }
        to {
            background: url(../assets/images/guide/guide-img.png);
            background-size:contain;
        }
    }

    @-o-keyframes myfirst /* Opera */
    {
        from {background: #3082bf;}
        to {
            background: url(../assets/images/guide/guide-img.png);
            background-size:contain;
        }
    }

    .grid-content1
    {
        animation: myfirst 5s;
        -moz-animation: myfirst 5s;	/* Firefox */
        -webkit-animation: myfirst 5s;	/* Safari 和 Chrome */
        -o-animation: myfirst 5s;	/* Opera */
        background:#3082bf
    }
    .grid-content1:hover
    {
        background: url(../assets/images/guide/guide-img.png);
        background-size:contain;
    }
</style>
