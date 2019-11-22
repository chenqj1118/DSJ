<template>
    <div class="headerBox clearfix">
        <!-- logo -->
        <div class="logo fl">
            <router-link to="/home">
                <img src="../../assets/images/logo.png"/>
                <span>博科资讯股份有限公司</span>
            </router-link>
        </div>
        <!-- 信息部分 -->
        <div class="infoBox fr">
            <div class="userInfo">
                <p>欢迎用户：admin </p>
                <span>上次登录时间：2019-02-19 14:28:46</span>
            </div>
            <div class="item">
                <img src="../../assets/images/user.png" alt="">
            </div>
            <div class="item">
                <img src="../../assets/images/information.png" alt="">
            </div>
            <div class="item">
                <router-link to="/" class="logout">退出</router-link>
            </div>
        </div>
        <!-- 下方阴影部分 -->
        <div class="bottomBox"></div>
    </div>
</template>
<script>
export default {
    name:'headerPart'
}
</script>
<style lang="scss" scoped>
.headerBox{
    background-color: #fff;
    height: 82px;
    width: 100%;
    left: 0;
    top: 0;
    position: fixed;
    z-index: 1;
    & .logo{
        width: 240px;
        background: #435e93;
        padding: 10px 0;
        img{
            width: 118px;
            height: 34px;
            display: block;
            margin: 0 auto;
        }
        span{
            text-align: center;
            color: #fff;
            display: block;
            margin-top: 7px;
        }
    }
}
.bottomBox{
    height: 10px;
    background: url("../../assets/images/hearder-box-show.png") repeat-x;
    width: 100%;
    position: absolute;
    top: 82px;
    z-index: 10;
}
.infoBox{
    line-height: 82px;
    margin-right: 20px;
    & .item{
        display: inline-block;
        padding-left: 25px;
        vertical-align: middle;
        img{
            display: block;
            cursor: pointer;
        }
        & .logout{
            color: #50699a;
        }
    }
    & .userInfo{
        display: inline-block;
        line-height: 20px;
        vertical-align: middle;
        p{
            color: #666;
            text-align: right;
        }
        span{
            color: #999;
        }
    }
}

</style>
