<template>
    <div class="safetyStockPage" :class="{chartPage:blockShow === 1}">
        <!-- 面包屑 -->
        <div class="breadcrumb" v-show="blockShow === 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>安全库存-表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="chartTitle clearfix" v-show="blockShow === 1">
            <span class="title fl">安全库存</span>
            <el-button size="small" @click="changeShow(blockShow)" class="fr">安全库存表格</el-button>
        </div>
        <div class="contentRightInner">
            <div class="blockTable" v-show="blockShow === 0">
                <!-- 筛选条件 -->
                <div class="screenBox">
                    <!-- 仓库 -->
                    <div class="items clearfix">
                        <div class="fl condition">仓库:</div>
                        <div class="fl classify">
                            <div>
                                <span @click="clickDepotItem(-1)"  :class="{actived:depotActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in depotCityArr" :key="index">
                                <span @click="clickDepotItem(index,item)"  :class="{actived:depotActive == index}">{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 年份 -->
                    <div class="items clearfix">
                        <div class="fl condition">年份:</div>
                        <div class="fl classify">
                            <div>
                                <span @click="clickYearItem(-1)"  :class="{actived:yearActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in yearArr" :key="index">
                                <span @click="clickYearItem(index,item)"  :class="{actived:yearActive == index}">{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 月份 -->
                    <div class="items clearfix">
                        <div class="fl condition">月份:</div>
                        <div class="fl classify">
                            <div>
                                <span @click="clickMonthItem(-1)"  :class="{actived:monthActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in monthArr" :key="index">
                                <span @click="clickMonthItem(index,item)"  :class="{actived:monthActive == index}">{{item}}月</span>
                            </div>
                        </div>
                    </div>
                    <!-- 常备物料 -->
                    <div class="items clearfix">
                        <div class="fl condition">常备物料:</div>
                        <div class="fl classify material" :class="{moreShow:moreShowMaterial}">
                            <div>
                                <span @click="clickMaterialItem(-1)"  :class="{c_active:materialActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in materialArr" :key="index">
                                <span @click="clickMaterialItem(index,item)"  :class="{c_active:materialActive == index}">{{item}}</span>
                            </div>
                            <a class="more" @click="clickMoreMaterial">更多...</a>
                        </div>
                    </div>
                </div>
                <!-- 表格数据 -->
                <div class="tableBox ordinaryTable">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="depot.name" label="仓库" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="material.code" label="物料编号" class-name ="Cblue"></el-table-column>
                        <el-table-column prop="material.name" label="物料名称"></el-table-column>
                        <el-table-column label="年份">
                            <template slot-scope="scope">
                                <span>{{scope.row.year}}年</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="月份">
                            <template slot-scope="scope">
                                <span>{{scope.row.month}}月</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="actual_demand" label="实际需求量" class-name ="Cyellow"></el-table-column>
                        <el-table-column prop="current_stock" label="当前库存" class-name ="Cblue"></el-table-column>
                        <el-table-column prop="in_transit_stock" label="在途库存(计划当月到库)"></el-table-column>
                        <el-table-column prop="ordered_stock" label="已预定库存"></el-table-column>
                        <el-table-column prop="safe_stock" label="安全库存" class-name ="Cgreen"></el-table-column>
                        <el-table-column label="计划当月剩余库存(正值剩余库存，负值需要备货)" min-width="130">
                            <template slot-scope="scope">
                                <span v-show="scope.row.planned_stock>0" class="Cblue">{{scope.row.planned_stock}}</span>
                                <span v-show="scope.row.planned_stock<=0" class="Cyellow">{{scope.row.planned_stock}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="alert_level" label="安全库存预警级别"></el-table-column>
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
                            layout="prev, pager, next,jumper"
                            :total= total>
                    </el-pagination>
                </div>
            </div>
            <div class="blockChart" v-show="blockShow === 1">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">
                                <!-- 年份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">年份:</div>
                                    <div class="fl classify">
                                        <span @click="clickYearItem1(-1)" :class="{actived:yearActive1 == -1}">全部</span>
                                        <span v-for="(item,index) in yearArr" :key="index" @click="clickYearItem1(index,item)" :class="{actived:yearActive1 == index}">{{item}}</span>
                                    </div>
                                </div>
                                <!-- 物料 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">物料：</div>
                                    <div class="fl classify" :class="{moreShow:moreShowMaterial1}">
                                        <span @click="chartClickMaterialItem1(-1)" :class="{actived:materialActive1 == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem1(index,item)" :class="{actived:materialActive1 == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial1">更多...</a>
                                    </div>
                                </div>
                            </div>
                            <div class="myChart" id="myChart1"></div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">
                                <!-- 年份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">年份:</div>
                                    <div class="fl classify">
                                        <span @click="clickYearItem2(-1)" :class="{actived:yearActive2 == -1}">全部</span>
                                        <span v-for="(item,index) in yearArr" :key="index" @click="clickYearItem2(index,item)" :class="{actived:yearActive2 == index}">{{item}}</span>
                                    </div>
                                </div>
                                <!-- 月份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">月份:</div>
                                    <div class="fl classify">
                                        <span @click="clickMonthItem2(-1)" :class="{actived:monthActive2 == -1}">全部</span>
                                        <span v-for="(item,index) in monthArr" :key="index" @click="clickMonthItem2(index,item)" :class="{actived:monthActive2 == index}">{{item}}月</span>
                                    </div>
                                </div>
                                <!-- 物料 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">物料：</div>
                                    <div class="fl classify" :class="{moreShow:moreShowMaterial2}">
                                        <span @click="chartClickMaterialItem2(-1)" :class="{actived:materialActive2 == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem2(index,item)" :class="{actived:materialActive2 == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial2">更多...</a>
                                    </div>
                                </div>
                            </div>
                            <div class="myChart" id="myChart2"></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">

                                <!-- 仓库 -->
                                <el-radio-group v-model="depot3">
                                    <el-radio v-for="(item,index) in depotCityArr" :key="index" :label="item" @change="chartChangeDepot3(item)">{{item}}</el-radio>
                                </el-radio-group>
                                <!-- 年份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">年份:</div>
                                    <div class="fl classify">
                                        <span @click="clickYearItem3(-1)" :class="{actived:yearActive3 == -1}">全部</span>
                                        <span v-for="(item,index) in yearArr" :key="index" @click="clickYearItem3(index,item)" :class="{actived:yearActive3 == index}">{{item}}</span>
                                    </div>
                                </div>
                                <!-- 物料 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">物料：</div>
                                    <div class="fl classify" :class="{moreShow:moreShowMaterial3}">
                                        <span @click="chartClickMaterialItem3(-1)" :class="{actived:materialActive3 == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem3(index,item)" :class="{actived:materialActive3 == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial3">更多...</a>
                                    </div>
                                </div>
                            </div>
                            <div class="myChart" id="myChart3"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 切换按钮 -->
            <div class="basiciTableBtn fr" v-show="blockShow === 0">
                <a @click="changeShow(blockShow)">
                    <span>基础水平图表</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    var echarts = require('echarts')
    import {_getSafetyStocksList,_getSafetyStocksChartData1,_getSafetyStocksChartData2,_getSafetyStocksChartData3} from '../../../api/api.js';
    import {getYearArr,getMonthArr,getDepotCityArr,getMaterialArr} from '../../../js/common.js';
    export default {
        name:'overviews',
        data(){
            return{
                blockShow: parseInt(localStorage.getItem('blockState'))||0,//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
                depotCityArr:[],
                yearArr:[],
                monthArr:[],
                materialArr:[],
                tableData:[],//表格数据

                pageNum:1,
                pageSize:10,
                total:100,

                depot:'',
                year:'',
                month:'',
                material:'',
                search:'',
                ordering:'',
                /* 筛选默认'全选'*/
                depotActive:'-1',
                yearActive:'-1',
                monthActive:'-1',
                materialActive:'-1',

                moreShowMaterial:false,

                /*图表相关*/
                year1: '',
                material1: '',
                yearActive1: '-1',
                materialActive1: '-1',
                moreShowMaterial1: false,

                year2: '',
                month2: '',
                material2: '',
                yearActive2: '-1',
                monthActive2: '-1',
                materialActive2: '-1',
                moreShowMaterial2: false,

                depot3: '',
                year3: '',
                material3: '',
                depotActive3: '-1',
                yearActive3: '-1',
                materialActive3: '-1',
                moreShowMaterial3: false,

                chartData1: {}, //图表1数据
                chartData2: {}, //图表2数据
                chartData3: {} //图表2数据


            }
        },
        methods:{
            changeShow(v){
                this.blockShow = v === 0 ? 1 : 0;
            },
            /* 获取数据 */
            //通用数据
            getList(params){
                _getSafetyStocksList(params).then(res => {
                    this.tableData = res.data.results
                    this.total = res.data.count
                }).catch(() => {})
            },
            //列表数据
            getData(){
                let params = {
                    limit:this.pageSize,
                    offset:this.pageNum-1,
                    depot:this.depot,
                    year:this.year,
                    month:this.month,
                    material:this.material,
                    search:this.search,
                    ordering:this.ordering,
                }
                this.getList(params)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.pageNum = val-1;
                this.getData();
            },
            getFilterData(){
                this.depotCityArr = getDepotCityArr();
                this.yearArr = getYearArr(5);//获取最近的5个年份
                this.monthArr = getMonthArr();
                this.materialArr = getMaterialArr();
            },
            /* 选择仓库 */
            clickDepotItem(index,value){
                this.depotActive = index;
                if(index != -1){
                    this.depot = value
                }else{
                    this.depot = ''
                }
                this.getData()
            },
            /* 选择年份 */
            clickYearItem(index,value){
                this.yearActive = index;
                if(index != -1){
                    this.year = value
                }else{
                    this.year = ''
                }
                this.getData()
            },
            /* 选择月份 */
            clickMonthItem(index,value){
                this.monthActive = index;
                if(index != -1){
                    this.month = value
                }else{
                    this.month = ''
                }
                this.getData()
            },
            /* 选择物料 */
            clickMaterialItem(index,value){
                this.materialActive = index;
                if(index != -1){
                    this.material = value
                }else{
                    this.material = ''
                }
                this.getData()
            },
            clickMoreMaterial(){
                this.moreShowMaterial = !this.moreShowMaterial
            },

            /*图表相关*/
            widthCof(){
                $('#myChart1,#myChart2').width(($(window).width() - 310) / 2 - 60).height(($(window).height() - 150) / 2 -140 );
                $('#myChart3').width($(window).width() - 380).height(($(window).height() - 150) / 2 -140);
            },
            getChartData1(){
                let params = {
                    year: this.year1,
                    material: this.material1
                };
                let _this = this;
                _getSafetyStocksChartData1(params).then(res =>{
                    _this.chartData1 = res.data.results[0];
                    _this.renderCharts1();
                }).catch(() =>{
                })
            },
            getChartData2(){
                let params = {
                    year: this.year2,
                    month: this.month2,
                    material: this.material2
                };
                let _this = this;
                _getSafetyStocksChartData2(params).then(res =>{
                    _this.chartData2 = res.data.results[0];
                    _this.renderCharts2();
                }).catch(() =>{
                })
            },
            getChartData3(){
                let params = {
                    depot: this.depot3,
                    year: this.year3,
                    material: this.material3
                };
                let _this = this;
                _getSafetyStocksChartData3(params).then(res =>{
                    _this.chartData3 = res.data.results[0];
                    _this.renderCharts3();
                }).catch(() =>{
                })
            },
            //绘制图表1
            renderCharts1(){
                //console.log(this.chartData1);
                var myChart = echarts.init(document.getElementById('myChart1'));
                var option = {
                    title: {
                        text: '物资在五个仓库的安全库存趋势分析',
                        textStyle:{
                            color:'#2b426e',
                            fontWeight:'normal',
                    　　　　 fontSize:16
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: this.depotCityArr
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: this.chartData1.dates
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        type: 'value'
                    },
                    series: [
                        {
                            name: this.chartData1.depots[0].depot_name,
                            type: 'line',
                            data: this.chartData1.depots[0].safety_stock_counts
                        },
                        {
                            name: this.chartData1.depots[1].depot_name,
                            type: 'line',
                            data: this.chartData1.depots[1].safety_stock_counts
                        },
                        {
                            name: this.chartData1.depots[2].depot_name,
                            type: 'line',
                            data: this.chartData1.depots[2].safety_stock_counts
                        },
                        {
                            name: this.chartData1.depots[3].depot_name,
                            type: 'line',
                            data: this.chartData1.depots[3].safety_stock_counts
                        },
                        {
                            name: this.chartData1.depots[4].depot_name,
                            type: 'line',
                            data: this.chartData1.depots[4].safety_stock_counts
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2016-1',
                        height: 4,
                        bottom: 25,
                        borderColor: '#ddd',
                        backgroundColor: '#fff',
                        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                        handleSize: 10,
                        show: true,
                        handleStyle: {
                            shadowBlur: 6,
                            shadowOffsetX: 1,
                            shadowOffsetY: 2,
                            shadowColor: '#aaa'
                        }
                    }],
                };
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            renderCharts2(){
                var myChart = echarts.init(document.getElementById('myChart2'));
                var categoryCount = this.chartData2.material_names.length;
                var customData = [];
                var legendData = [];
                var dataList = [];

                //legendData.push('trend');
                var encodeY = [];
                for (var i = 0; i < this.depotCityArr.length; i++) {
                    legendData.push(this.depotCityArr[i]);
                    dataList.push([]);
                    encodeY.push(1 + i);
                }
                for (var i = 0; i < categoryCount; i++) {
                    var customVal = [i];
                    customData.push(customVal);

                    var data = dataList[0];
                    for (var j = 0; j < dataList.length; j++) {
                        var value = this.chartData2.depots[j].safe_stock_sums[i];
                        dataList[j].push(value);
                        customVal.push(value);
                    }
                }
                function renderItem(params, api) {
                    var xValue = api.value(0);
                    var currentSeriesIndices = api.currentSeriesIndices();
                    var barLayout = api.barLayout({
                        barGap: '30%', barCategoryGap: '20%', count: currentSeriesIndices.length - 1
                    });

                    var points = [];
                    for (var i = 0; i < currentSeriesIndices.length; i++) {
                        var seriesIndex = currentSeriesIndices[i];
                        if (seriesIndex !== params.seriesIndex) {
                            var point = api.coord([xValue, api.value(seriesIndex)]);
                            point[0] += barLayout[i - 1].offsetCenter;
                            point[1] -= 70;
                            points.push(point);
                        }
                    }
                   //
                    var style = api.style({
                        stroke: api.visual('color'),
                        fill: null
                    });

                    return {
                        type: 'polyline',
                        shape: {
                            points: points
                        },
                        style: style
                    };
                }
                var option = {
                    title: {
                        text: '同一时间下物资在五个仓库的安全库存对比分析',
                        textStyle:{
                            color:'#2b426e',
                            fontWeight:'normal',
                    　　　　 fontSize:16
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        data: legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'empty',
                        startValue: 'IT零星配件',
                        endValue: '测距仪',
                        height: 4,
                        bottom: 26,
                        borderColor: '#ddd',
                        backgroundColor: '#fff',
                        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                        handleSize: 10,
                        show: true,
                        handleStyle: {
                            shadowBlur: 6,
                            shadowOffsetX: 1,
                            shadowOffsetY: 2,
                            shadowColor: '#aaa'
                        }
                    }],
                    xAxis: {
                        splitLine: {
                            show: false
                        },
                        boundaryGap: true,
                        data: this.chartData2.material_names
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                    },
                    series: [{
                        type: 'custom',
                        name: 'trend',
                        renderItem: renderItem,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        encode: {
                            x: 0,
                            y: encodeY
                        },
                        data: customData,
                        z: 100
                    }].concat(echarts.util.map(this.chartData2.depots, function (data, index) {
                        return {
                            type: 'bar',
                            animation: false,
                            name: data.name,
                            itemStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            },
                            data: data.safe_stock_sums
                        }
                    }))
                };
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            renderCharts3(){
                //console.log(this.chartData3);
                var myChart = echarts.init(document.getElementById('myChart3'));
                var option = {
                    title: {
                        text: '同一仓库物资的安全库存和计划当月剩余库存对比分析',
                        textStyle:{
                            color:'#2b426e',
                            fontWeight:'normal',
                    　　　　 fontSize:16
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        data:['计划当月剩余库存', '安全库存']
                    },
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2016-1',
                        height: 4,
                        bottom: 26,
                        borderColor: '#ddd',
                        backgroundColor: '#fff',
                        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                        handleSize: 10,
                        show: true,
                        handleStyle: {
                            shadowBlur: 6,
                            shadowOffsetX: 1,
                            shadowOffsetY: 2,
                            shadowColor: '#aaa'
                        }
                    }],
                    xAxis: {
                        type: 'category',
                        splitLine: {
                            show: false
                        },
                        boundaryGap: true,
                        data: this.chartData3.dates
                    },
                    yAxis:
                    {
                        splitLine: {
                            show: false
                        },
                        type: 'value',
                    },
                    series: [
                        {
                            name:'安全库存',
                            type:'bar',
                            itemStyle:{
                                normal:{
                                    color:'#a7c15e'
                                }
                            },
                            data:this.chartData3.safe_stock_counts
                        },
                        {
                            name:'计划当月剩余库存',
                            type:'line',
                            itemStyle:{
                                normal:{
                                    color:'#55c0b5'
                                }
                            },
                            data:this.chartData3.planned_stocks
                        }
                    ]
                };
                myChart.setOption(option);
                window.onresize = myChart.resize
            },

            /* 选择物料 */
            chartClickMaterialItem1(index, value){
                this.materialActive1 = index;
                if(index != -1){
                    this.material1 = value
                } else{
                    this.material1 = ''
                }
                this.getChartData1();
            },
            chartClickMaterialItem2(index, value){
                this.materialActive2 = index;
                if(index != -1){
                    this.material2 = value
                } else{
                    this.material2 = ''
                }
                this.getChartData2();
            },
            chartClickMaterialItem3(index, value){
                this.materialActive3 = index;
                if(index != -1){
                    this.material3 = value
                } else{
                    this.material3 = ''
                }
                this.getChartData3();
            },
            chartClickMoreMaterial1(){
                this.moreShowMaterial1 = !this.moreShowMaterial1
            },
            chartClickMoreMaterial2(){
                this.moreShowMaterial2 = !this.moreShowMaterial2
            },
            chartClickMoreMaterial3(){
                this.moreShowMaterial3 = !this.moreShowMaterial3
            },

            /* 选择年份 */
            clickYearItem1(index, value){
                this.yearActive1 = index;
                if(index != -1){
                    this.year1 = value
                } else{
                    this.year1 = ''
                }
                this.getChartData1()
            },
            clickYearItem2(index, value){
                this.yearActive2 = index;
                if(index != -1){
                    this.year2 = value
                } else{
                    this.year2 = ''
                }
                this.getChartData2()
            },
            clickYearItem3(index, value){
                this.yearActive3 = index;
                if(index != -1){
                    this.year3 = value
                } else{
                    this.year3 = ''
                }
                this.getChartData3()
            },
            /*选择仓库*/
            chartChangeDepot3(val){
                this.depot3 = val;
                this.getChartData3();
            },
            /* 选择月份 */
            clickMonthItem2(index, value){
                this.monthActive2 = index;
                if(index != -1){
                    this.month2 = value
                } else{
                    this.month2 = ''
                }
                this.getChartData2()
            },
        },
        mounted(){
            this.widthCof();
            this.getChartData1();
            this.getChartData2();
            this.getChartData3();
        },
        created(){
            this.getFilterData();//获取筛选用到的枚举数据
            this.getData();//获取结果数据用于渲染table
        }
    }
</script>