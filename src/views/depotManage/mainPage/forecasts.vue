<template>
    <div class="forecastsPage" :class="{chartPage:blockShow === 1}">
        <!-- 面包屑 -->
        <div class="breadcrumb" v-show="blockShow === 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>需求预测 - 表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="chartTitle clearfix" v-show="blockShow === 1">
            <span class="title fl">历史物资分析</span>
            <el-button size="small" @click="changeShow(blockShow)" class="fr">需求预测表格</el-button>
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
                                <span @click="clickMaterialItem(-1)"  :class="{actived:materialActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in materialArr" :key="index">
                                <span @click="clickMaterialItem(index,item)"  :class="{actived:materialActive == index}">{{item}}</span>
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
                        <el-table-column prop="actual_demand" label="实际需求量"></el-table-column>
                        <el-table-column prop="forecast_demand" label="需求量预测" class-name ="Cblue"></el-table-column>
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
                <el-row>
                    <el-col :span="24">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">
                                <el-radio-group v-model="chartDepot">
                                    <el-radio  v-for="(item,index) in depotCityArr" :key="index" :label="item" @change="chartChangeDepot(item)">{{item}}</el-radio>
                                </el-radio-group>
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">常备物料：</div>
                                    <div class="fl classify" :class="{moreShow:chartMoreShowMaterial}">
                                        <span @click="chartClickMaterialItem(-1)"  :class="{actived:chartMaterialActive == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem(index,item)"  :class="{actived:chartMaterialActive == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial">更多...</a>
                                    </div>
                                </div>
                                <div class="chartFilterDate">
                                    <div class="fl">请选择日期：</div>
                                    <div class="fl">
                                        <el-date-picker
                                                v-model="chartDateValue"
                                                type="monthrange"
                                                align="right"
                                                unlink-panels
                                                range-separator="至"
                                                start-placeholder="开始月份"
                                                end-placeholder="结束月份"
                                                size="mini"
                                                @change="chartChangeDate"
                                                :picker-options="chartPickerOptions">
                                        </el-date-picker>
                                    </div>
                                </div>
                            </div>
                            <div class="myChart" id="myChart1"></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="mychartBox">
                            <div class="chartFilter clearfix">
                                <div class="chartFilterItem clearfix">
                                    <div class="fl condition">常备物料：</div>
                                    <div class="fl classify" :class="{moreShow:chartMoreShowMaterial2}">
                                        <span @click="chartClickMaterialItem2(-1)"  :class="{actived:chartMaterialActive2 == -1}">全部</span>
                                        <span v-for="(item,index) in materialArr" :key="index" @click="chartClickMaterialItem2(index,item)"  :class="{actived:chartMaterialActive2 == index}">{{item}}</span>
                                        <a class="more" @click="chartClickMoreMaterial2">更多...</a>
                                    </div>
                                </div>
                                <div class="chartFilterDate">
                                    <div class="fl">请选择日期：</div>
                                    <div class="fl">
                                        <el-date-picker
                                                v-model="chartDateValue2"
                                                type="monthrange"
                                                align="right"
                                                unlink-panels
                                                range-separator="至"
                                                start-placeholder="开始月份"
                                                end-placeholder="结束月份"
                                                size="mini"
                                                @change="chartChangeDate2"
                                                :picker-options="chartPickerOptions2">
                                        </el-date-picker>
                                    </div>
                                </div>
                            </div>
                            <div class="title" style="text-align: center;font-size: 16px;color: #50699a;">物资在5个仓库的趋势对比分析以及占比分析（随着时间联动）</div>
                            <div class="myChart" id="myChart2"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <!-- 切换按钮 -->
            <div class="basiciTableBtn fr" v-show="blockShow === 0">
                <a @click="changeShow(blockShow)">
                    <span>需求预测图表</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    var echarts = require('echarts')
    import {_getForecastsList,_getForecastsChartData,_getForecastsChartData2} from '../../../api/api.js';
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
                countNum:0,

                //图表相关
                chartDepot:'宁波',
                chartYearmin:'',
                chartMonthmin:'',
                chartYearmax:'',
                chartMonthmax:'',
                chartYearmin2:'',
                chartMonthmin2:'',
                chartYearmax2:'',
                chartMonthmax2:'',
                chartMaterial:'',
                chartMaterial2:'',

                chartMaterialActive:'-1',
                chartMaterialActive2:'-1',
                chartMoreShowMaterial:false,
                chartMoreShowMaterial2:false,

                chartData:{}, //图表1数据
                chartData2:{}, //图表2数据

                /*时间控件数据*/
                chartPickerOptions: {
                    shortcuts: [{
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 6);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                chartPickerOptions2: {
                    shortcuts: [{
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 6);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                chartDateValue: '',
                chartDateValue2: ''
            }
        },
        methods:{
            /* 获取数据 */
            //通用数据
            getList(params){
                _getForecastsList(params).then(res => {
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
            changeShow(v){
                    this.blockShow = v === 0 ? 1 : 0;
            },

            //图表1相关
            getChartData(){
                let params = {
                    depot:this.chartDepot,
                    year_min:this.chartYearmin,
                    month_min:this.chartMonthmin,
                    year_max:this.chartYearmax,
                    month_max:this.chartMonthmax,
                    material:this.chartMaterial
                };
                let _this = this;
                _getForecastsChartData(params).then(res => {
                    _this.chartData = res.data.results[0];
                    _this.renderCharts1();
                }).catch(() => {})
            },
            //绘制图表1
            renderCharts1(){
                var myChart = echarts.init(document.getElementById('myChart1'));
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '物资需求预测趋势分析',
                        textStyle:{
                            color:'#2b426e',
                            fontWeight:'normal',
                    　　　　 fontSize:16
                        }
                    },
                    tooltip: {},
                    legend: {
                        data:['预测值','实际值'],
                        x:'right',
                        y:3
                    },
                    grid: {
                        left: '0',
                        right: '0',
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: {
                        splitLine: {
                            show: false
                        },
                        data: this.chartData.dates
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                    },
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2018-1',
                        height: 4,
                        bottom: 19,
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
                    series: [{
                        name: '预测值',
                        type: 'line',
                        smooth: true,
                        data: this.chartData.forecast_values,
                        symbolSize:8,
                        itemStyle:{
                            normal:{
                                color:'#a6c059'
                            }
                        },
                    },{
                        name: '实际值',
                        type: 'line',
                        smooth: true,
                        data: this.chartData.actual_values,
                        symbolSize:8,
                        itemStyle:{
                            normal:{
                                color:'#f5a200'
                            }
                        },
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize
            },

            //图表2相关
            getChartData2(){
                let params = {
                    year_min:this.chartYearmin2,
                    month_min:this.chartMonthmin2,
                    year_max:this.chartYearmax2,
                    month_max:this.chartMonthmax2,
                    material:this.chartMaterial2
                };
                let _this = this;
                _getForecastsChartData2(params).then(res => {
                    _this.chartData2 = res.data.results[0];
                    _this.renderCharts2();
                }).catch(() => {})
            },
            //绘制图表1
            renderCharts2(){
                var myChart = echarts.init(document.getElementById('myChart2'));

                var chartDataArr = [];
                var arr1 = ['product'];
                chartDataArr[0] = arr1.concat(this.chartData2.dates);
                var mydepots = this.chartData2.depots;
                for(var i=0;i<mydepots.length;i++){
                    var arr = [mydepots[i].depot_name];
                    chartDataArr[i+1] = arr.concat(mydepots[i].actual_values);
                }

                // 指定图表的配置项和数据
                var option = {
                    legend: {},
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                    },
                    dataset: {
                        source: chartDataArr
                    },
                    xAxis: {
                        type: 'category',
                        splitLine: {
                        show: false
                    },},
                    yAxis: {gridIndex: 0,
                        splitLine: {
                            show: false
                        },},
                    grid: {top: '55%'},
                    series: [
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: '30%',
                            center: ['47%', '28%'],
                            label: {
                                formatter: '{b}: {@2018-1} ({d}%)'
                            },
                            encode: {
                                itemName: 'product',
                                value: '2018-1',
                                tooltip: '2018-1'
                            }
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2018-1',
                        height: 4,
                        bottom: 24,
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
                myChart.on('updateAxisPointer', function (event) {
                    var xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        var dimension = xAxisInfo.value + 1;
                        myChart.setOption({
                            series: {
                                id: 'pie',
                                label: {
                                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                                },
                                encode: {
                                    value: dimension,
                                    tooltip: dimension
                                }
                            }
                        });
                    }
                });
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            /* 页面固定宽度 */
            widthCof(){
                $('#myChart1').width($(window).width()-380).height(($(window).height() - 150) / 2 - 180);
                $('#myChart2').width($(window).width()-380).height(($(window).height() - 150) / 2 - 100);
            },
            /*选择仓库*/
            chartChangeDepot(val){
                this.chartDepot = val;
                this.getChartData();
            },
            /* 选择物料 */
            chartClickMaterialItem(index,value){
                this.chartMaterialActive = index;
                if(index != -1){
                    this.chartMaterial = value
                }else{
                    this.chartMaterial = ''
                }
                this.getChartData();
            },
            chartClickMaterialItem2(index,value){
                this.chartMaterialActive2 = index;
                if(index != -1){
                    this.chartMaterial2 = value
                }else{
                    this.chartMaterial2 = ''
                }
                this.getChartData2();
            },
            chartClickMoreMaterial(){
                this.chartMoreShowMaterial = !this.chartMoreShowMaterial
            },
            chartClickMoreMaterial2(){
                this.chartMoreShowMaterial2 = !this.chartMoreShowMaterial2
            },
            /*选择日期*/
            chartChangeDate(dateVal){
                if(dateVal){
                    let startDate = dateVal[0],
                        endDate = dateVal[1];
                    this.chartYearmin = startDate.getFullYear();
                    this.chartYearmax = endDate.getFullYear();
                    this.chartMonthmin = startDate.getMonth()+1;
                    this.chartMonthmax = endDate.getMonth()+1;
                    this.getChartData();
                }else{
                    this.chartYearmin = '';
                    this.chartYearmax = '';
                    this.chartMonthmin = '';
                    this.chartMonthmax = '';
                    this.getChartData();
                }
            },
            chartChangeDate2(dateVal){
                if(dateVal){
                    let startDate = dateVal[0],
                        endDate = dateVal[1];
                    this.chartYearmin2 = startDate.getFullYear();
                    this.chartYearmax2 = endDate.getFullYear();
                    this.chartMonthmin2 = startDate.getMonth()+1;
                    this.chartMonthmax2 = endDate.getMonth()+1;
                    this.getChartData2();
                }else{
                    this.chartYearmin2 = '';
                    this.chartYearmax2 = '';
                    this.chartMonthmin2 = '';
                    this.chartMonthmax2 = '';
                    this.getChartData2();
                }
            }
        },
        mounted(){
            this.widthCof();
            this.getChartData();
            this.getChartData2();
        },
        created(){
            this.getFilterData();//获取筛选用到的枚举数据
            this.getData();//获取结果数据用于渲染table
        }
    }
</script>
<style lang="scss" scoped>
    .chartFilter{
        padding-right: 500px;
        .chartFilterDate{
            position: absolute;
            top:0;
            right:0;
        }
        .chartFilterItem{
        }
    }
</style>