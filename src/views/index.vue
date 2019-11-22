<template>
    <div class="indexBox">
        <div class="header clearfix">
            <div class="boxTop">
                <div class="fl logo">
                    <img src="../assets/images/logo.png"/>
                    <span>博科资讯股份有限公司</span>
                </div>
                <div class="fr search">
                    <div class="inputBox">
                        <input type="text">
                        <button><i class="el-icon-search"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="contentBox">
            <div class="btnBox">
                <span class="line1"></span> 
                <span class="line2"></span> 
                <span class="line3"></span> 
                <span class="line4"></span>
                <a class="btn" @click="showBlock(0)">供应商全貌</a>
            </div>
            <div class="btnBox">
                <span class="line1"></span> 
                <span class="line2"></span> 
                <span class="line3"></span> 
                <span class="line4"></span>
                <a class="btn" @click="showBlock(1)">大数据挖掘</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'index',
    methods:{
        showBlock(v){
            if(v === 1){
                this.$router.push({
                    path:'/basic'
                })
            }else{
               this.$router.push({
                    path:'/home'
                }) 
            }
            localStorage.setItem('blockState',v)
            this.$store.commit('changeState',v)
        }
    },
}
</script>
<style lang="scss" scoped>
.indexBox{
    width: 100%;
    height: 100%;
    position: absolute;
    background: url('../assets/images/index-bg.jpg') center;
    z-index: 0;
}
.header{
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    padding: 25px 0;
    z-index: 1;
}
.boxTop{
    width: 1280px;
    margin: 0 auto;
    color: #fff;
    & .logo{
        margin-left: 20px;
        img{
            display: inline-block;
            width: 118px;
            height: 34px;
            margin-right: 15px;
        }
    }
    & .search{
        margin-right: 20px;
    }
    & .inputBox{
        input{
            display: inline-block;
            width: 370px;
            height: 34px;
            line-height: 34px;/* 
            background: rgba(255, 255, 255, 0.5); */
            border: none;
            padding: 0 10px;
        }
        button{
            display: inline-block;
            margin-left: -4px;
            font-size: 18px;
            color: #fff;
            background: #435e93;
            height: 34px;
            line-height: 34px;
            vertical-align: bottom;
            padding: 0 20px;
            cursor: pointer;
            &:hover{
                opacity: 0.8;
            }
        }
    }
}
.contentBox{
    width: 800px;
    height: 200px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -400px;
    margin-top: -40px;
    & .btnBox{
        display: inline-block;
        width: 300px;
        height: 80px;
        position: relative;
        &:first-child{
            margin-right: 190px;
        }
        a{
            display: inline-block;
            text-align: center;
            width: 100%;
            line-height: 80px;
            font-size: 30px;
            color: #fff;
        }
        span{
            position: absolute;
            background-color: #fff;
            display: block;
            transition: all 200ms;
        }
    }
    
}
.btnBox .line1,
.btnBox .line3 {
  height: 2px;
  width: 20px;
}
.btnBox .line2,
.btnBox .line4 {
  height: 20px;
  width: 2px;
}
.btnBox .line1,
.btnBox .line2 {
  top: 0;
  right: 0;
}
.btnBox .line3,
.btnBox .line4 {
  bottom: 0;
  left: 0;
}
.btnBox.reverse .line1,
.btnBox.reverse .line3 {
  width: 100%;
}
.btnBox.reverse .line2,
.btnBox.reverse .line4 {
  height: 100%;
}
.btnBox:hover,
.btnBox:active {
  background-color: transparent;
  color: #fff;
}
.btnBox:hover .line1,
.btnBox:active .line1,
.btnBox:hover .line3,
.btnBox:active .line3 {
  width: 100%;
}
.btnBox:hover .line2,
.btnBox:active .line2,
.btnBox:hover .line4,
.btnBox:active .line4 {
  height: 100%;
}
.btnBox:hover.reverse .line1,
.btnBox:active.reverse .line1,
.btnBox:hover.reverse .line3,
.btnBox:active.reverse .line3 {
  width: 20px;
}
.btnBox:hover.reverse .line2,
.btnBox:active.reverse .line2,
.btnBox:hover.reverse .line4,
.btnBox:active.reverse .line4 {
  height: 20px;
}
/* .btn, .btn::before, .btn::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}  */
/* .btn {
    box-shadow: inset 0 0 0 1px #fff;
}
.btn::before, .btn::after {
    content: '';
    z-index: -1;
    margin: -5%;
    box-shadow: inset 0 0 0 2px;
    animation: clipMe 6s linear infinite;
} */
/* .btn::before {
    animation-delay: -3s;
} */
/*     
@keyframes clipMe {
    0%{
    clip: rect(0px, 340.0px, 2px, 0px);
    }
    25% {
    clip: rect(0px, 2px, 110.0px, 0px);
    }
    50% {
    clip: rect(108.0px, 340.0px, 120.0px, 0px);
    }
    75% {
    clip: rect(0px, 340.0px, 340.0px, 328.0px);
    }
    100% {
       clip: rect(0px, 340.0px, 2px, 0px); 
    }
}   */
</style>
