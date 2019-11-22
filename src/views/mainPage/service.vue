<template>
    <div class="service">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>服务水平</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- 筛选 -->
            <div class="fr" v-show="blockShow == 1">
                <div class="selectBox">
                    <span>请选择:</span>
                    <el-select v-model="selectPro" filterable placeholder="省" @change="selectProvince(selectPro)">
                        <el-option
                        v-for="item in provinceData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectCity" placeholder="市" @change="changeCityData(selectCity)">
                        <el-option
                        v-for="item in cityData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <!-- 切换为数据表格 -->
        <div class="blockTable" v-show="blockShow == 0">
            <el-card class="box-card">
                <div class="boxCard">
                    <!-- 筛选条件 -->
                    <div class="screenBox">
                        <!-- 省 -->
                        <div class="items clearfix">
                            <div class="fl condition">省份:</div>
                            <div class="fl classify province" :class="{moreShow:moreShowP}">
                                <div>
                                    <span @click="clickP(-1)"  :class="{p_active:pActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in provinceData" :key="index">
                                    <span @click="clickP(index,item)"  :class="{p_active:pActive == index}">{{item.name}}</span>
                                </div>
                                <a class="more" @click="clickMoreP">更多...</a>
                            </div>
                        </div>
                        <!-- 市 -->
                        <div class="items clearfix" v-show="cityShow">
                            <div class="fl condition">城市:</div>
                            <div class="fl classify city" :class="{moreShow:moreShowC}">
                                <div>
                                    <span @click="clickC(-1)"  :class="{c_active:cActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in cityData" :key="index">
                                    <span @click="clickC(index,item)"  :class="{c_active:cActive == index}">{{item.name}}</span>
                                </div>
                                <a class="more" @click="clickMoreC">更多...</a>
                            </div>
                        </div>
                        <!-- 服务能力 -->
                        <div class="items clearfix">
                            <div class="fl condition">服务能力:</div>
                            <div class="fl classify nature">
                                <div>
                                    <span @click="clickN(-1)"  :class="{n_active:nActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in dataN" :key="index">
                                    <span @click="clickN(index,item)"  :class="{n_active:nActive == index}">{{item}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 服务水平 -->
                        <div class="items clearfix">
                            <div class="fl condition">服务水平:</div>
                            <div class="fl classify earlyWarning">
                                <div>
                                    <span @click="clickE(-1)"  :class="{e_active:eActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in dataE" :key="index">
                                    <span @click="clickE(index,item)"  :class="{e_active:eActive == index}">{{item}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 表格数据 -->
                    <div class="tableBox ordinaryTable">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column label="供应商编码">
                                <template slot-scope="scope">
                                    <span style="color:#6595f3">{{scope.row.supplier.code}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="supplier.name" label="供应商"></el-table-column>
                            <el-table-column prop="supplier.province" label="省"></el-table-column>
                            <el-table-column prop="supplier.city" label="市"></el-table-column>
                            <el-table-column prop="service_score" label="服务水平得分"></el-table-column>
                            <!-- 投诉严重级别 -->
                            <template v-if="showBoxTable == -1 || showBoxTable == 0">
                                <el-table-column :render-header="renderLVFn" prop="complaint_count" label="投诉次数"></el-table-column>
                                <el-table-column :render-header="renderLVFn" prop="complaint_item_count" label="投诉物料种类数" :width="150"></el-table-column>
                                <el-table-column :render-header="renderLVFn" prop="complaint_severity" label="投诉严重级别"></el-table-column>
                            </template>
                            <!-- 补货数量 -->
                            <template v-if="showBoxTable == -1 || showBoxTable == 1">
                                <el-table-column :render-header="renderNumFn" prop="replenishment_amount" label="补货数量"></el-table-column>
                                <el-table-column :render-header="renderNumFn" prop="replenishment_count" label="补货次数"></el-table-column>
                                <el-table-column :render-header="renderNumFn" prop="replenishment_ability" label="补货能力"></el-table-column>
                            </template>
                            <!-- 投诉响应能力 -->
                            <template v-if="showBoxTable == -1 || showBoxTable == 2">
                                <el-table-column :render-header="renderNLFn" prop="complaint_response_time" label="投诉响应时长(天)" :width="150"></el-table-column>
                                <el-table-column :render-header="renderNLFn" prop="complaint_response_ability" label="投诉响应能力"></el-table-column>
                            </template>
                            <el-table-column prop="service_status" label="服务水平状态">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.service_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.service_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.service_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.service_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="pageBox">
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page= pageNum
                        :page-size= pageSize
                        prev-text = "上一页"
                        next-text = "下一页"
                        layout="prev, pager, next, jumper"
                        :total= total>
                        </el-pagination>
                    </div>  
                </div>
            </el-card>
        </div>
        <!-- 切换为图形 -->
        <div class="blockTable" v-show="blockShow === 1">
            <el-row>
                <!-- 信用水平得分 -->
                <el-col :span="24">
                    <el-card shadow="hover" >
                        <div class="chartsBox" id="serviceLevel"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 水平按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 0">服务水平图表</span>
                <span v-show="blockShow === 1">服务水平表格</span>
            </a>
        </div>
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {suppliersService,chartsService} from '../../api/api.js'
export default {
    name:'service',
    data(){
        return{
            blockShow:parseInt(localStorage.getItem('blockState')),//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//能力
            eActive:-1,//水平
            /* 选中的字段 */
            selectPro:'上海市',
            selectCity:'黄浦区',
            selectP:'',
            selectC:'',
            selectN:'',
            selectE:'',
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            moreShowP:false,
            moreShowC:false,
            dataN:['投诉严重级别','补货能力','投诉响应能力'],
            dataE:['正常','黄色预警','红色预警','优秀'],
            tableData:[],
            showBoxTable:-1,//选择不同的区块

            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,
            serviceLevelData:[],//服务水平图表数据
        }
    },
    methods:{
        renderLVFn(h,{column}){
            return h(
            'span',{
                    'class':{renderLV:true},
                },column.label
            );
        },
        renderNumFn(h,{column}){
            return h(
            'span',{
                    'class':{renderNum:true},
                },column.label
            );
        },
        renderNLFn(h,{column}){
            return h(
            'span',{
                    'class':{renderNL:true},
                },column.label
            );
        },
        /* 选择省 */
        clickP(index,value){
            if(index != -1){
                this.cityShow = true
                this.selectP = value.name
                /* 选择完省份之后，带出相对应的市区数据 */
                if(value.city.length === 1){
                    let Data = [],newArr = []
                    value.city.forEach(item => {
                        if (item.name === this.selectP){
                           Data = item.area
                        }
                    })
                    Data.map((value,index) => {
                        newArr.push({
                            name:value
                        })
                    })
                    this.cityData = newArr
                }else{
                    this.cityData = value.city
                }
            }else{
                this.cityShow = false
                this.selectP = ''
            }
            this.pActive = index
            this.selectC = ''
            this.cActive = -1
            this.pageNum = 0
            this.searchData()
        },
        /* 选择市 */
        clickC(index,value){
            this.cActive = index
            if(index != -1){
                this.selectC = value.name
            }else{
                this.selectC = ''
            }
            this.pageNum = 0
            this.searchData()
        },
        /* 选择服务能力 */
        clickN(index,value){
            this.nActive = index
            this.showBoxTable = index
            if(index != -1){
                this.selectN = value
            }else{
                this.selectN = ''
            }
            this.pageNum = 0
            this.changeBg(index)
            this.searchData()
        },
        /* 选择服务水平 */
        clickE(index,value){
            this.eActive = index
            if(index != -1){
                this.selectE = value
            }else{
                this.selectE = ''
            }
            this.pageNum = 0
            this.searchData()
        },
        clickMoreP(){
            this.moreShowP = !this.moreShowP
        },
        clickMoreC(){
            this.moreShowC = !this.moreShowC
        },
        /* 获取数据 */
        //通用数据
        getList(params){
            suppliersService(params).then(res => {
                console.log(res.data)
                this.tableData = res.data.data
                this.total = res.data.count
            }).catch(() => {})
        },
        //列表数据
        getData(){
            let params = {
                limit:this.pageSize,
                offset:this.pageNum-1
            }
            this.getList(params)
        },
        /* 筛选 */
        searchData(){
            let params = {
                limit:this.pageSize,
                offset:this.pageNum,
                province:this.selectP,
                city:this.selectC,
                capability:this.selectN,
                serviceStatus:this.selectE
            }
            this.getList(params)
        },
        /* 分页 */
        handleSizeChange(val) {
            this.pageSize = val
            this.searchData()
        },
        handleCurrentChange(val) {
            this.pageNum = val-1
            this.searchData()
        },
        /* 切换图表 */
        changeShow(v){
            if(this.countNum === 0){
                this.blockShow = v
            }else{
                if(v === 0){
                    this.blockShow = 1
                }else{
                    this.blockShow = 0
                }
            }
            this.countNum +=1
        },
        /* changeBg(index){
            $(function(){
                    if(index === 0){
                        $('span.renderLV').parent().parent().removeClass('changeColor1')
                        $('span.renderNum').parent().parent().removeClass('changeColor2')
                        $('span.renderNL').parent().parent().removeClass('changeColor3')
                    }else if(index === 1){
                        $('span.renderLV').parent().parent().removeClass('changeColor1')
                        $('span.renderNum').parent().parent().removeClass('changeColor2')
                        $('span.renderNL').parent().parent().removeClass('changeColor3')
                    }else if(index === 2){
                        $('span.renderLV').parent().parent().removeClass('changeColor1')
                        $('span.renderNum').parent().parent().removeClass('changeColor2')
                        $('span.renderNL').parent().parent().removeClass('changeColor3')
                    }else if(index === -1){
                        $('span.renderLV').parent().parent().addClass('changeColor1')
                        $('span.renderNum').parent().parent().addClass('changeColor2')
                        $('span.renderNL').parent().parent().addClass('changeColor3')
                    }
                });
        }, */
        /* 图表FN */
        /* 选择省 */
        selectProvince(value){
            this.selectPro = value
            this.selectCity =''
            let DataD =  this.provinceData.filter(city => {
                return city.name === this.selectPro
            })
            if(DataD[0].city.length === 1){
                let Data = [],newArr = []
                DataD[0].city.forEach(item => {
                    if (item.name === this.selectPro){
                        Data = item.area
                    }
                })
                Data.map((value,index) => {
                    newArr.push({
                        name:value
                    })
                })
                this.cityData = newArr
            }else{
                this.cityData = DataD[0].city
            }
            this.getServiceLevelData()
        },
        /* 选择市 */
        selectCityData(value){
            this.selectProvince(value)
        },
        changeCityData(value){
            this.selectCity = value
            this.getServiceLevelData()
        },
        /* 绘制图表 */
        getServiceLevel(){
            let spot = $('#serviceLevel')
            spot.css({"width":$("#serviceLevel").width((window.innerWidth-360)+'px')});
            let serviceLevel = echarts.init(document.getElementById('serviceLevel'));
            let option = {
                title: {
                    text:'供应商投诉次数，补货次数以及投诉影响时长对比分析',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['投诉次数', '补货次数', '投诉影响时长'],
                    x: 'right',
                    y:3
                },
                calculable: true,
                dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        bottom:'8%',
                        end: 40,
                        height:8,
                        borderColor: '#ddd',
                        backgroundColor: '#fff',
                        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                        handleSize: 20,
                        handleStyle: {
                            shadowBlur: 6,
                            shadowOffsetX: 1,
                            shadowOffsetY: 2,
                            shadowColor: '#ddd'
                        }
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                        data: this.serviceLevelData[0].names
                    }
                ],
                yAxis: [
                    {
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '投诉次数',//complaint_count
                        type: 'bar',
                        barGap: 0,
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                        data: this.serviceLevelData[0].complaintData
                    },
                    {
                        name: '补货次数',//replenishment_count
                        type: 'bar',
                        itemStyle:{
                            normal:{
                                color:'#5fced6'
                            }
                        },
                        data: this.serviceLevelData[0].replenishmentData
                    },
                    {
                        name: '投诉影响时长',//complaint_response_time
                        type: 'bar',
                        itemStyle:{
                            normal:{
                                color:'#94dee3'
                            }
                        },
                        data: this.serviceLevelData[0].complaintResData
                    }
                ]
            }
            serviceLevel.setOption(option);
            window.onresize = serviceLevel.resize
        },
        /* 获取图表数据 */
        getServiceLevelData(){
            chartsService({province:this.selectPro,city:this.selectCity}).then(res => {
                //console.log(res.data.data)
                let replenishmentData = [],complaintData = [],complaintResData = []
                res.data.data[0].infos.forEach(item => {
                    replenishmentData.push(item.replenishment_count)
                    complaintData.push(item.complaint_count)
                    complaintResData.push(item.complaint_response_time)
                })
                res.data.data.map(item => {
                    item.replenishmentData = replenishmentData
                    item.complaintData = complaintData
                    item.complaintResData = complaintResData
                })
                this.serviceLevelData = res.data.data
                this.getServiceLevel()
            }).catch(() => {})
        },
        /* 页面固定宽度 */
        widthCof(){
            $('.boxCard').css({"width":$(window).width()-310+'px'});
        }
    },
    mounted(){
        this.widthCof()
    },
    created(){
        this.changeShow(this.blockShow)
        this.provinceData = CTAData
        this.getData()
        //this.changeBg(-1)
        this.getServiceLevelData()
    },
}
</script>
<style lang="scss" scoped>
#serviceLevel{
    width: 100%;
    height: 700px;
}
</style>

