<template>
    <div class="quality">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>质量水平</el-breadcrumb-item>
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
                        <div class="items clearfix" v-if="cityShow">
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
                    </div>
                    <!-- 表格 -->
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
                            <el-table-column prop="inspection_count" label="抽检次数"></el-table-column>
                            <el-table-column prop="qualification_count" label="合格次数"></el-table-column>
                            <el-table-column prop="pass_rate" label="抽检合格率"></el-table-column>
                            <el-table-column prop="inspection_lot" label="检验批次"></el-table-column>
                            <el-table-column prop="qualification_lot" label="达标批次"></el-table-column>
                            <el-table-column prop="compliance_rate" label="达标批次率"></el-table-column>
                            <el-table-column prop="quality_score" label="质量水平得分"></el-table-column>
                            <el-table-column label="质量水平状态">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.quality_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.quality_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.quality_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.quality_status === '红色预警'">红色预警</span>
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
        <div class="blockChart" v-show="blockShow == 1">
            <el-row :gutter="20">
                <!-- 抽检次数 -->
                <el-col :span="12">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="spotChecks"></div>
                    </el-card>
                </el-col>
                <!-- 抽检批次数 -->
                <el-col :span="12">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="spotCheckBatch"></div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-card shadow="hover">
                        <!-- 合格率和达标批次率 -->
                        <div class="tabCharts">
                            <div class="tabTop" style="margin-bottom: 15px;">
                                <a @click="changeSpan(0)"><span :class="{spanActive:spanActive === 0}">合格率</span></a>
                                <a @click="changeSpan(1)"><span :class="{spanActive:spanActive === 1}">达标批次率</span></a>
                            </div>
                            <div class="chartsBox" id="passRate" v-show="spanActive === 0"></div>
                            <div class="chartsBox" id="batchRate" v-show="spanActive === 1"></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 水平按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 0">质量水平图表</span>
                <span v-show="blockShow === 1">质量水平表格</span>
            </a>
        </div>
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {suppliersQuality,chartsQuality} from '../../api/api.js'
export default {
    name:'quality',
    data(){
        return{
            blockShow:parseInt(localStorage.getItem('blockState')),//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            /* 选中的字段 */
            selectPro:'上海市',
            selectCity:'黄浦区',
            selectP:'',
            selectC:'',
            moreShowP:false,
            moreShowC:false,
            tableData:[],
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            spanActive:0,//切换合格率和达标批次的tab状态
            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,

            /* 图标数据 */
            spotCheckData:[],//抽检次数
            spotCheckBatchData:[],//抽检批次数
            passRateData:[],//合格率
            batchRateData:[],//达标批次率
        }
    },
    methods:{
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
        clickMoreP(){
            this.moreShowP = !this.moreShowP
        },
        clickMoreC(){
            this.moreShowC = !this.moreShowC
        },
        /* 筛选 */
        //绘制抽检次数
        getSpotChecks(){
            let spot = $('#spotChecks')
            spot.css({"width":$("#spotChecks").width((window.innerWidth-360)/2+'px')});
            let spotChecks = echarts.init(document.getElementById('spotChecks'));
            let option = {
                title : {
                    text:'供应商的抽检次数和不合格次数对比分析',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['抽检次数','不合格次数'],
                    x:'right',
                    y:3
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                        data : this.spotCheckData[0].names
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                    }
                ],
                dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        bottom:'11%',
                        end: 10,
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
                series : [
                    {
                        name:'抽检次数',
                        type:'bar',
                        data:this.spotCheckData[0].inspection_counts,
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                    },
                    {
                        name:'不合格次数',
                        type:'bar',
                        data:this.spotCheckData[0].qualification_counts,
                        itemStyle:{
                            normal:{
                                color:'#a5bf5a'
                            }
                        },
                    }
                ]
            }
            spotChecks.setOption(option);
            window.onresize = spotChecks.resize
        },
        //抽检批次数
        getSpotCheckBatch(){
            let spot = $('#spotCheckBatch')
            spot.css({"width":$("#spotCheckBatch").width((window.innerWidth-360)/2+'px')});
            let spotCheckBatch = echarts.init(document.getElementById('spotCheckBatch'));
            let option = {
                title : {
                    text:'供应商的抽检批次数和达标批次数对比分析',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {        
                        type : 'shadow'  
                    }
                },
                legend: {
                    data:['抽检批次数','达标批次数'],
                    x:'right',
                    y:3
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                        data : this.spotCheckBatchData[0].names
                    }
                ],
                yAxis : [
                    {
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                        type : 'value'
                    }
                ],
                dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        end: 10,
                        bottom:'11%',
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
                series : [
                    {
                        name:'抽检批次数',
                        type:'bar',
                        data:this.spotCheckBatchData[0].inspection_lot,
                        itemStyle:{
                            normal:{
                                color:'#c89e64'
                            }
                        },
                    },
                    {
                        name:'达标批次数',
                        type:'bar',
                        data:this.spotCheckBatchData[0].qualification_lot,
                        itemStyle:{
                            normal:{
                                color:'#f5a101'
                            }
                        },
                    }
                ]
            }
            spotCheckBatch.setOption(option);
            window.onresize = spotCheckBatch.resize
        },
        //合格率
        getPassRate(){
            let spot = $('#passRate')
            spot.css({"width":$("#passRate").width(window.innerWidth-360+'px')});
            let passRate = echarts.init(document.getElementById('passRate'));
            let option = {
                title : {
                    text:'供应商在不同区间合格率分布',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                        return params[0].name + "(供应商个数)" + "<br>" +params[0].marker+ params[0].seriesName + "：" + params[0].data + "个" +
                                "<br>" +params[1].marker+ params[1].seriesName + "：" + params[1].data + "个" +
                                "<br>" +params[2].marker+ params[2].seriesName + "：" + params[2].data + "个" +
                                "<br>" +params[3].marker+ params[3].seriesName + "：" + params[3].data + "个" 
                    }
                },
                legend: {
                    data: ['小于90%', '90%-95%','95%-98%','大于98%'],
                    x: 'right',
                    y:3
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis:  {
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                },
                dataZoom:[
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        left: '2%',
                        start: 0,
                        end: 50,
                        width:8,
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
                    },
                ],
                yAxis: {
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
                    data: this.passRateData[0].cities
                },
                series: [
                    {
                        name: '小于90%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#4ad2ff'
                            }
                        },
                        data: this.passRateData[0].ec_a
                    },
                    {
                        name: '90%-95%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                        data: this.passRateData[0].ec_b
                    },
                    {
                        name: '95%-98%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#c89e64'
                            }
                        },
                        data: this.passRateData[0].ec_c
                    },
                    {
                        name: '大于98%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#f5a101'
                            }
                        },
                        data: this.passRateData[0].ec_d
                    },
                ]
            }
            passRate.setOption(option);
            window.onresize = passRate.resize
        },
        //达标批次率
        getBatchRate(){
            let spot = $('#batchRate')
            spot.css({"width":$("#batchRate").width(window.innerWidth-360+'px')});
            let batchRate = echarts.init(document.getElementById('batchRate'));
            let option = {
                title : {
                    text:'供应商在不同区间达标批次率分布',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                        return params[0].name + "(供应商个数)" + "<br>" +params[0].marker+ params[0].seriesName + "：" + params[0].data + "个" +
                                "<br>" +params[1].marker+ params[1].seriesName + "：" + params[1].data + "个" +
                                "<br>" +params[2].marker+ params[2].seriesName + "：" + params[2].data + "个" +
                                "<br>" +params[3].marker+ params[3].seriesName + "：" + params[3].data + "个" 
                    }
                },
                legend: {
                    data: ['小于90%', '90%-95%','95%-98%','大于98%'],
                    x: 'right',
                    y:3
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom:[
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        left: '2%',
                        start: 0,
                        end: 50,
                        width:8,
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
                    },
                ],
                xAxis:  {
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                },
                yAxis: {
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
                    data: this.batchRateData[0].cities
                },
                series: [
                    {
                        name: '小于90%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#4ad2ff'
                            }
                        },
                        data: this.batchRateData[0].ec_a
                    },
                    {
                        name: '90%-95%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                        data: this.batchRateData[0].ec_b
                    },
                    {
                        name: '95%-98%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#c89e64'
                            }
                        },
                        data: this.batchRateData[0].ec_c
                    },
                    {
                        name: '大于98%',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#f5a101'
                            }
                        },
                        data: this.batchRateData[0].ec_d
                    },
                ]
            }
            batchRate.setOption(option);
            window.onresize = batchRate.resize
        },
        /* 切换TAB */
        changeSpan(index){
            this.spanActive = index
            console.log(index)
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
        /* 获取数据 */
        //通用数据
        getList(params){
            suppliersQuality(params).then(res => {
                console.log(res.data)
                /* let Data = []
                res.data.data.forEach(v => {
                    Data.push(v.supplier)
                })
                this.tableData = Data */
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
                city:this.selectC
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
            /* this.getSpotChecksData()
            this.getSpotCheckBatchData() */
            this.getPassRateData()
            this.getBatchRateData()
        },
        /* 选择市 */
        selectCityData(value){
            this.selectProvince(value)
        },
        changeCityData(value){
            this.selectCity = value
            this.getSpotChecksData()
            this.getSpotCheckBatchData()
        },
        /* 通用数据 */
        /* getChartsData(params,fn){
            chartsQuality(params).then(res => {
                Data = res.data.data
            }).catch(() => {})
        }, */
        /* 获取抽检次数数据 */
        getSpotChecksData(){
            let params = {
                province:this.selectPro,
                city:this.selectCity,
                condition:'count'
            }
            chartsQuality(params).then(res => {
                this.spotCheckData = res.data.data
                this.getSpotChecks()
            }).catch(() => {})
        },
        /* 抽检批次数 */
        getSpotCheckBatchData(){
            let params = {
                province:this.selectPro,
                city:this.selectCity,
                condition:'lot'
            }
            chartsQuality(params).then(res => {
                this.spotCheckBatchData = res.data.data
                this.getSpotCheckBatch()
            }).catch(() => {})

        },
        /* 合格率 */
        getPassRateData(){
            let params = {
                province:this.selectPro,
                city:'',
                condition:'count_rate'
            }
            chartsQuality(params).then(res => {
                this.passRateData = res.data.data
                this.getPassRate()
            }).catch(() => {})
            
        },
        /* 达标批次率 */
        getBatchRateData(){
            let params = {
                province:this.selectPro,
                city:'',
                condition:'lot_rate'
            }
            chartsQuality(params).then(res => {
                this.batchRateData = res.data.data
                console.log(this.batchRateData)
                this.getBatchRate()
            }).catch(() => {})
        },
        /* 页面固定宽度 */
        widthCof(){
            $('.boxCard').css({"width":$(window).width()-310+'px'});
        }
    },
    created(){
        this.changeShow(this.blockShow)
    },
    mounted(){
        this.provinceData = CTAData
        this.getData()
        this.widthCof()
        this.getSpotChecksData()
        this.getSpotCheckBatchData()
        this.getPassRateData()
        this.getBatchRateData()
    }
}
</script>
<style lang="scss" scoped>
#spotChecks,#spotCheckBatch{
    height: 450px;
    width: 90%;
}

#passRate,#batchRate{
    width: 100%;
    height: 400px;
}
.tabCharts{
    margin-bottom: 25px;
    & .tabTop{
        a{
            display: inline-block;
            &:last-child{
                margin-left: -4px;
            }
            span{
                display: inline-block;
                width: 100px;
                padding: 5px 0;
                text-align: center;
                background: #eeeeee;
                color: #435e93;
            }
        }
        & .spanActive{
            background: #435e93;
            color: #eee;
        }
    }
}
</style>
