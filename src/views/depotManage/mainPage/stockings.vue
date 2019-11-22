<template>
    <div class="safetyStockPage" :class="{chartPage:blockShow === 1}">
        <!-- 面包屑 -->
        <div class="breadcrumb" v-show="blockShow === 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>备货量-表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="chartTitle clearfix" v-show="blockShow === 1">
            <span class="title fl">备货量</span>
            <el-button size="small" @click="changeShow(blockShow)" class="fr">备货量表格</el-button>
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
                                <span @click="clickDepotItem(-1)" :class="{actived:depotActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in depotCityArr" :key="index">
                                <span @click="clickDepotItem(index,item)" :class="{actived:depotActive == index}">{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 年份 -->
                    <div class="items clearfix">
                        <div class="fl condition">年份:</div>
                        <div class="fl classify">
                            <div>
                                <span @click="clickYearItem(-1)" :class="{actived:yearActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in yearArr" :key="index">
                                <span @click="clickYearItem(index,item)" :class="{actived:yearActive == index}">{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 月份 -->
                    <div class="items clearfix">
                        <div class="fl condition">月份:</div>
                        <div class="fl classify">
                            <div>
                                <span @click="clickMonthItem(-1)" :class="{actived:monthActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in monthArr" :key="index">
                                <span @click="clickMonthItem(index,item)" :class="{actived:monthActive == index}">{{item}}月</span>
                            </div>
                        </div>
                    </div>
                    <!-- 常备物料 -->
                    <div class="items clearfix">
                        <div class="fl condition">常备物料:</div>
                        <div class="fl classify material" :class="{moreShow:moreShowMaterial}">
                            <div>
                                <span @click="clickMaterialItem(-1)" :class="{c_active:materialActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in materialArr" :key="index">
                                <span @click="clickMaterialItem(index,item)" :class="{c_active:materialActive == index}">{{item}}</span>
                            </div>
                            <a class="more" @click="clickMoreMaterial">更多...</a>
                        </div>
                    </div>
                </div>
                <!-- 表格数据 -->
                <div class="tableBox ordinaryTable">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="depot.name" label="仓库" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="material.code" label="物料编号" class-name="Cblue"></el-table-column>
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
                        <el-table-column prop="actual_demand" label="实际需求量" class-name="Cyellow"></el-table-column>
                        <el-table-column prop="current_stock" label="当前库存" class-name="Cblue"></el-table-column>
                        <el-table-column prop="in_transit_stock" label="在途库存(计划当月到库)" min-width="90"></el-table-column>
                        <el-table-column prop="ordered_stock" label="已预定库存"></el-table-column>
                        <el-table-column prop="safe_stock" label="安全库存" class-name="Cgreen"></el-table-column>
                        <el-table-column label="计划当月剩余库存(正值剩余库存，负值需要备货)" min-width="130">
                            <template slot-scope="scope">
                                <span v-show="scope.row.planned_stock>0" class="Cblue">{{scope.row.planned_stock}}</span>
                                <span v-show="scope.row.planned_stock<=0" class="Cyellow">{{scope.row.planned_stock}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_count" label="备货量"></el-table-column>
                        <el-table-column prop="lower_limit" label="下限" class-name="Cyellow"></el-table-column>
                        <el-table-column prop="upper_limit" label="上限" class-name="Cblue"></el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pageBox">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page=pageNum
                            :page-size=pageSize
                            prev-text="上一页"
                            next-text="下一页"
                            layout="prev, pager, next,jumper"
                            :total=total>
                    </el-pagination>
                </div>
            </div>
            <div class="blockChart" v-show="blockShow === 1">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">
                                <!-- 仓库 -->
                                <el-radio-group v-model="depot1">
                                    <el-radio v-for="(item,index) in depotCityArr" :key="index" :label="item" @change="chartChangeDepot1(item)">{{item}}</el-radio>
                                </el-radio-group>
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
                                <!-- 物料 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">物料：</div>
                                    <div class="fl classify" :class="{moreShow:moreShowMaterial2}">
                                        <span @click="chartClickMaterialItem2(-1)" :class="{actived:materialActive2 == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem2(index,item)" :class="{actived:materialActive2 == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial1">更多...</a>
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
                                <!-- 年份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">年份:</div>
                                    <div class="fl classify">
                                        <span @click="clickYearItem3(-1)" :class="{actived:yearActive3 == -1}">全部</span>
                                        <span v-for="(item,index) in yearArr" :key="index" @click="clickYearItem3(index,item)" :class="{actived:yearActive3 == index}">{{item}}</span>
                                    </div>
                                </div>
                                <!-- 月份 -->
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">月份:</div>
                                    <div class="fl classify">
                                        <span @click="clickMonthItem3(-1)" :class="{actived:monthActive3 == -1}">全部</span>
                                        <span v-for="(item,index) in monthArr" :key="index" @click="clickMonthItem3(index,item)" :class="{actived:monthActive3 == index}">{{item}}月</span>
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
                    <span>备货量图表</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    var echarts = require('echarts')
    import {_getStockingsList, _getStockingsChartData1, _getStockingsChartData2, _getStockingsChartData3} from '../../../api/api.js';
    import {getYearArr, getMonthArr, getDepotCityArr, getMaterialArr} from '../../../js/common.js';
    export default {
        name: 'overviews',
        data(){
            return {
                blockShow: parseInt(localStorage.getItem('blockState'))||0,//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
                depotCityArr: [],
                yearArr: [],
                monthArr: [],
                materialArr: [],
                tableData: [],//表格数据

                pageNum: 1,
                pageSize: 10,
                total: 100,

                depot: '',
                year: '',
                month: '',
                material: '',
                search: '',
                ordering: '',
                /* 筛选默认'全选'*/
                depotActive: '-1',
                yearActive: '-1',
                monthActive: '-1',
                materialActive: '-1',

                moreShowMaterial: false,

                /*图表相关*/
                depot1: '',
                year1: '',
                material1: '',
                depotActive1: '-1',
                yearActive1: '-1',
                materialActive1: '-1',
                moreShowMaterial1: false,

                year2: '',
                material2: '',
                yearActive2: '-1',
                materialActive2: '-1',
                moreShowMaterial2: false,

                year3: '',
                month3: '',
                yearActive3: '-1',
                monthActive3: '-1',

                chartData1: {}, //图表1数据
                chartData2: {}, //图表2数据
                chartData3: {} //图表3数据
            }
        },
        methods: {
            /* 获取数据 */
            //通用数据
            getList(params){
                _getStockingsList(params).then(res =>{
                    this.tableData = res.data.results
                    this.total = res.data.count
                }).catch(() =>{
                })
            },
            //列表数据
            getData(){
                let params = {
                    limit: this.pageSize,
                    offset: this.pageNum - 1,
                    depot: this.depot,
                    year: this.year,
                    month: this.month,
                    material: this.material,
                    search: this.search,
                    ordering: this.ordering,
                }
                this.getList(params)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.pageNum = val - 1;
                this.getData();
            },
            getFilterData(){
                this.depotCityArr = getDepotCityArr();
                this.yearArr = getYearArr(5);//获取最近的5个年份
                this.monthArr = getMonthArr();
                this.materialArr = getMaterialArr();
            },
            /* 选择仓库 */
            clickDepotItem(index, value){
                this.depotActive = index;
                if(index != -1){
                    this.depot = value
                } else{
                    this.depot = ''
                }
                this.getData()
            },
            /* 选择年份 */
            clickYearItem(index, value){
                this.yearActive = index;
                if(index != -1){
                    this.year = value
                } else{
                    this.year = ''
                }
                this.getData()
            },
            /* 选择月份 */
            clickMonthItem(index, value){
                this.monthActive = index;
                if(index != -1){
                    this.month = value
                } else{
                    this.month = ''
                }
                this.getData()
            },
            /* 选择物料 */
            clickMaterialItem(index, value){
                this.materialActive = index;
                if(index != -1){
                    this.material = value
                } else{
                    this.material = ''
                }
                this.getData()
            },
            clickMoreMaterial(){
                this.moreShowMaterial = !this.moreShowMaterial
            },
            changeShow(v){
                this.blockShow = v === 0 ? 1 : 0;
            },

            /*图表相关*/
            widthCof(){
                $('#myChart1,#myChart2').width(($(window).width() - 310) / 2 - 60).height(($(window).height() - 150) / 2 -138);
                $('#myChart3').width($(window).width() - 380).height(($(window).height() - 150) / 2 -138);
            },
            getChartData1(){
                let params = {
                    depot: this.depot1,
                    year: this.year1,
                    material: this.material1
                };
                let _this = this;
                _getStockingsChartData1(params).then(res =>{
                    _this.chartData1 = res.data.results[0];
                    _this.renderCharts1();
                }).catch(() =>{
                })
            },
            getChartData2(){
                let params = {
                    year: this.year2,
                    material: this.material2
                };
                let _this = this;
                _getStockingsChartData2(params).then(res =>{
                    _this.chartData2 = res.data.results[0];
                    _this.renderCharts2();
                }).catch(() =>{
                })
            },
            getChartData3(){
                let params = {
                    year: this.year3,
                    month: this.month3
                };
                let _this = this;
                _getStockingsChartData3(params).then(res =>{
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
                        text: '仓库下物资备货量预测',
                        textStyle:{
                            color:'#2b426e',
                            fontWeight:'normal',
                    　　　　 fontSize:16
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                                backgroundColor: '#ccc',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                textStyle: {
                                    color: '#222'
                                }
                            }
                        },
                        formatter: function (params){
                            return params[2].name + '<br />' + params[2].value;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.chartData1.dates,
                        splitLine: {
                            show: false
                        },
                        boundaryGap: false
                    },
                    yAxis: {
                        splitNumber: 3,
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: 'L',
                        type: 'line',
                        smooth: true,
                        data: this.chartData1.lower_limits,
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        name: 'U',
                        type: 'line',
                        smooth: true,
                        data: this.chartData1.upper_limits,
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#ccc'
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        type: 'line',
                        smooth: true,
                        data: this.chartData1.upper_limits,
                        hoverAnimation: false,
                        symbolSize: 6,
                        itemStyle: {
                            normal: {
                                color: '#c23531'
                            }
                        },
                        showSymbol: false
                    }],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2018-1',
                        height: 4,
                        bottom: 27,
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
                //console.log(this.chartData2);
                var myChart = echarts.init(document.getElementById('myChart2'));
                var option = {
                    title: {
                        text: '物资在5个仓库的备货量趋势对比分析',
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
                        data: this.chartData2.depot_names
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
                        data: this.chartData2.dates
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        type: 'value'
                    },
                    series: [
                        {
                            name: this.chartData2.depots[0].name,
                            type: 'line',
                            data: this.chartData2.depots[0].stock_count
                        },
                        {
                            name: this.chartData2.depots[1].name,
                            type: 'line',
                            data: this.chartData2.depots[1].stock_count
                        },
                        {
                            name: this.chartData2.depots[2].name,
                            type: 'line',
                            data: this.chartData2.depots[2].stock_count
                        },
                        {
                            name: this.chartData2.depots[3].name,
                            type: 'line',
                            data: this.chartData2.depots[3].stock_count
                        },
                        {
                            name: this.chartData2.depots[4].name,
                            type: 'line',
                            data: this.chartData2.depots[4].stock_count
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2018-1',
                        height: 4,
                        bottom: 27,
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
            renderCharts3(){
                //console.log(this.chartData3);
                var myChart = echarts.init(document.getElementById('myChart3'));
                var option = {
                    title: {
                        text: '同一时间下物资在5个仓库的备货量对比分析',
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
                        right: 50,
                        top: 0,
                        data: this.chartData3.depot_names
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        splitLine: {
                            show: false
                        },
                        type: 'value'
                    },
                    yAxis: {
                        /* axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        }, */
                        type: 'category',
                        data: this.chartData3.material_names
                    },
                    series: [
                        {
                            name: this.chartData3.depots[0].name,
                            type: 'bar',
                            stack: '总量',
                            data: this.chartData3.depots[0].stock_count
                        },
                        {
                            name: this.chartData3.depots[1].name,
                            type: 'bar',
                            stack: '总量',
                            data: this.chartData3.depots[1].stock_count
                        },
                        {
                            name: this.chartData3.depots[2].name,
                            type: 'bar',
                            stack: '总量',
                            data: this.chartData3.depots[2].stock_count
                        },
                        {
                            name: this.chartData3.depots[3].name,
                            type: 'bar',
                            stack: '总量',
                            /* label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            }, */
                            data: this.chartData3.depots[3].stock_count
                        },
                        {
                            name: this.chartData3.depots[4].name,
                            type: 'bar',
                            stack: '总量',
                            data: this.chartData3.depots[4].stock_count
                        }
                    ],
                    dataZoom: [
                        {
                            id: 'dataZoomX',
                            type: 'slider',
                            xAxisIndex: 0,
                            start: 0,
                            end: 50,
                            bottom:26,
                            height: 4,
                            borderColor: '#ddd',
                            backgroundColor: '#fff',
                            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                            handleSize: 10,
                            show: true,
                            handleStyle: {
                                shadowBlur: 6,
                                shadowOffsetX: 1,
                                shadowOffsetY: 2,
                                shadowColor: '#ddd'
                            }
                        },
                        {
                            id: 'dataZoomY',
                            type: 'slider',
                            width:15,
                            right:0,
                            yAxisIndex: [0],
                            startValue: '光缆',
                            endValue: '光纤配线架',
                            filterMode: 'empty'
                        }
                    ]
                };
                myChart.setOption(option);
                window.onresize = myChart.resize
            },

            /*选择仓库*/
            chartChangeDepot1(val){
                this.depot1 = val;
                this.getChartData1();
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
            chartClickMoreMaterial1(){
                this.moreShowMaterial1 = !this.moreShowMaterial1
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
            chartClickMoreMaterial2(){
                this.moreShowMaterial2 = !this.moreShowMaterial2
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
            /* 选择月份 */
            clickMonthItem3(index, value){
                this.monthActive3 = index;
                if(index != -1){
                    this.month3 = value
                } else{
                    this.month3 = ''
                }
                this.getChartData3()
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