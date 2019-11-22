<template>
    <div class="home">
        <app-header class="header"></app-header>
        <div class="contentBox" v-bind:style="{ 'height': appHeight + 'px'}">
            <app-menu></app-menu>
            <div class="contentRight">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import headerPart from './public/header'
import menuPart from './public/menu'
export default {
    name:'home',
    components:{
        'app-header':headerPart,
        'app-menu':menuPart
    },
    data(){
        return{
            appHeight: $(window).height()
        }
    },
    methods:{
        /* resize loyout */
        layoutResize(){
            const that = this;
            $(window).resize(function() {
                that.appHeight = $(window).height()
            });
        }
    },
    mounted(){
        this.layoutResize()
    },
}
</script>
<style lang="scss" scoped>
.contentBox{
    padding-top: 82px;
    box-sizing: border-box;
}
.contentRight{
    margin-left: 240px;
    padding: 10px;
    height: 100%;
    overflow: auto;
    position: relative;
    background: #f7f8fc;
    box-sizing: border-box;
}
</style>
