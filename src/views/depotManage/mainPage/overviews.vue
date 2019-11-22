<template>
    <div class="overviewsPage" :class="{chartPage:blockShow === 1}">
        <!-- 面包屑 -->
        <div class="breadcrumb" v-show="blockShow === 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>库存概况-表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tools2" v-show="blockShow === 1">
            <a @click="changeShow(blockShow)">
                <span>库存概况表格</span>
            </a>
        </div>
        <div class="contentRightInner">

            <div class="blockTable" v-show="blockShow === 0">
                <div class="tools">
                    <el-button size="small"><router-link to="/depotManage/details"><span>物资明细</span></router-link></el-button>
                </div>
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
                        <el-table-column prop="unit_price" label="单价(元)" class-name ="Cyellow"></el-table-column>
                        <el-table-column prop="purchase_quantity" label="采购量"></el-table-column>
                        <el-table-column prop="purchase_amount" label="采购金额(元)"></el-table-column>
                        <el-table-column prop="used_quantity" label="实际使用量" class-name ="Cblue"></el-table-column>
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
                <div class="taberTools" v-show="tabActiveName=='first'">
                    <!-- 仓库 -->
                    <el-radio-group v-model="tab1Chart1Depot">
                        <el-radio v-for="(item,index) in depotCityArr" :key="index" :label="item" @change="chartChangeDepotTab1(item)">{{item}}</el-radio>
                    </el-radio-group>
                </div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabHandleClick">
                        <el-tab-pane label="历史物资分析" name="first">
                            <div class="tab1_content">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <div class="mychartBox">
                                            <h5>历史物资趋势分析</h5>
                                                <el-radio-group size="mini" v-model="tab1_chart1_tab">
                                                    <el-radio-button label="1" @click="changeTab(1)">实际使用量趋势分析</el-radio-button>
                                                    <el-radio-button label="2" @click="changeTab(2)">采购金额趋势分析</el-radio-button>
                                                </el-radio-group>

                                            <div v-show="tab1_chart1_tab==1">
                                                <div class="myChart" id="myChart1_a"></div>
                                            </div>
                                            <div v-show="tab1_chart1_tab==2">
                                                <div class="myChart" id="myChart1_b"></div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="mychartBox">
                                            <h5>历史物资占比分析</h5>
                                            <div class="myChart" id="myChart2"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <div class="mychartBox mychartBox3">
                                            <h5>历史物资采购与实际使用对比分析</h5>
                                            <div class="chartFilter clearfix">
                                                <!-- 年份 -->
                                                <div class="chartFilterItem clearfix">
                                                    <div class="fl condition">年份:</div>
                                                    <div class="fl classify">
                                                        <span @click="tab1Chart3ClickYearItem(-1)" :class="{actived:tab1Chart3YearActive == -1}">全部</span>
                                                        <span v-for="(item,index) in yearArr" :key="index" @click="tab1Chart3ClickYearItem(index,item)" :class="{actived:tab1Chart3YearActive == index}">{{item}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="myChart" id="myChart3"></div>
                                         </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="mychartBox">
                                            <h5>历史物资同比分析</h5>
                                            <div class="myChart" id="myChart4"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="历史仓库分析" name="second">
                            <el-row>
                                <el-col :span="24">
                                    <div class="mychartBox mychartBox2">
                                        <h5>物资在同一时间下的5个仓库的占比分析（随着时间联动</h5>
                                        <div class="chartFilter clearfix">
                                            <!-- 物料 -->
                                            <div class="chartFilterItem clearfix">
                                                <div class="fl condition">物 料：</div>
                                                <div class="fl classify" :class="{moreShow:tab2Chart1MoreShowMaterial}">
                                                    <span @click="tab2Chart1ClickMaterialItem(-1)" :class="{actived:tab2Chart1MaterialActive == -1}">全部</span>
                                                    <span v-for="(item,index) in tab2Chart1MaterialArr" :key="index" @click="tab2Chart1ClickMaterialItem(index,item)" :class="{actived:tab2Chart1MaterialActive == index}">{{item }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="myChart" id="myChart5"></div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
            <!-- 切换按钮 -->
            <div class="basiciTableBtn fr" v-show="blockShow === 0">
                <a @click="changeShow(blockShow)">
                    <span>库存概况图表</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    var echarts = require('echarts')
    import {_getOverviewList,_getOverviewTab2ChartData1,_getOverviewTab1ChartData1A,_getOverviewTab1ChartData1B,_getOverviewTab1ChartData2,_getOverviewTab1ChartData3,_getOverviewTab1ChartData4} from '../../../api/api.js';
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
                tabActiveName: 'first',
                tab1Chart1Depot:'',
                tab1Chart1DepotActive:'-1',

                tab2Chart1Material:'',
                tab2Chart1MaterialActive:'-1',

                tab1Chart3Year:'',
                tab1Chart3YearActive:'-1',
                tab1Chart3Percent_min :'',
                tab1Chart3Percent_max :'',

                tab1Chart4Year_a:'2017',
                tab1Chart4Year_b:'2018',

                tab1Chart4Material:'光缆',
                //tab1Chart4MaterialActive:'-1',

                tab1Chart1DataA:{},
                tab1Chart1DataB:{},
                tab1Chart2Data:{},
                tab1Chart3Data:{},
                tab1Chart4Data:{},
                tab2Chart1Data:{},
                tab2Chart1MaterialArr:[], //tab2里排名前10的物料

                tab2Chart1MoreShowMaterial:false,
                tab1_chart1_tab:1,

                chartDataArr:[]
            }
        },
        methods:{
            changeTab(v){
                this.tab1_chart1_tab = v;
            },
            changeShow(v){
                this.blockShow = v === 0 ? 1 : 0;
            },
            /* 获取数据 */
            //通用数据
            getList(params){
                _getOverviewList(params).then(res => {
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
            /*图表相关*/
            widthCof(){
                $('#myChart1_a,#myChart1_b,#myChart3,#myChart4').width(($(window).width() - 310) / 2 - 25).height(($(window).height() - 150) / 2);
                $('#myChart2').width(($(window).width() - 310) / 2 - 25).height((($(window).height() - 150) / 2)+28);
                //$('#myChart3').width($(window).width() - 380).height(($(window).height() - 150) / 2 + 200);
                $('#myChart5').width($(window).width() - 380).height($(window).height() - 250);
            },
            tabHandleClick(tab, event) {
                console.log(tab, event);
            },
            /*选择仓库*/
            chartChangeDepotTab1(val){
                this.tab1Chart1Depot = val;
                this.getTab1ChartData1();
            },
            getTab1ChartData1(){},
            getTab1ChartData1A(){
                let params = {};
                let _this = this;
                _getOverviewTab1ChartData1A(params).then(res =>{
                    _this.tab1Chart1DataA = res.data.results[0];
                    _this.renderTab1Charts1A();
                }).catch(() =>{
                })
            },
            getTab1ChartData1B(){
                let params = {};
                let _this = this;
                _getOverviewTab1ChartData1B(params).then(res =>{
                    _this.tab1Chart1DataB = res.data.results[0];
                    _this.renderTab1Charts1B();
                }).catch(() =>{
                })
            },
            getTab1ChartData2(){
                let params = {};
                let _this = this;
                _getOverviewTab1ChartData2(params).then(res =>{
                    _this.tab1Chart2Data = res.data.results[0];
                    _this.renderTab1Charts2();
                }).catch(() =>{
                })
            },
            getTab1ChartData3(){
                let params = {
                    year:this.tab1Chart3Year,
                    percent_min:this.tab1Chart3Percent_min,
                    percent_max : this.tab1Chart3Percent_max
                };
                let _this = this;
                _getOverviewTab1ChartData3(params).then(res =>{
                    _this.tab1Chart3Data = res.data.results[0];
                    _this.renderTab1Charts3();
                }).catch(() =>{
                })
            },
            getTab1ChartData4(){
                let params = {
                    year_a:this.tab1Chart4Year_a,
                    year_b:this.tab1Chart4Year_b,
                    material: this.tab1Chart4Material
                };
                let _this = this;
                _getOverviewTab1ChartData4(params).then(res =>{
                    _this.tab1Chart4Data = res.data.results[0];
                    _this.renderTab1Charts4();
                }).catch(() =>{
                })
            },
            getTab2ChartData1(){
                let params = {
                    material: this.tab2Chart1Material
                };
                let _this = this;
                _getOverviewTab2ChartData1(params).then(res =>{
                    _this.tab2Chart1Data = res.data.results[0];
                    this.tab2Chart1MaterialArr = _this.tab2Chart1Data.material_names;
                    _this.renderTab2Charts1();
                }).catch(() =>{
                })
            },
            renderTab1Charts1(){},
            renderTab1Charts1A(){
                var myChart = echarts.init(document.getElementById('myChart1_a'));
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        width:'65%',
                        right: 10,
                        top: 20,
                        data: this.tab1Chart1DataA.material_names
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
                        data: this.tab1Chart1DataA.dates[0]
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        type: 'value'
                    },
                    series: [
                        {
                            name: this.tab1Chart1DataA.material_names[0],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[0]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[1],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[1]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[2],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[2]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[3],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[3]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[4],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[4]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[5],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[5]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[6],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[6]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[7],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[7]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[8],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[8]
                        },
                        {
                            name: this.tab1Chart1DataA.material_names[9],
                            type: 'line',
                            data: this.tab1Chart1DataA.used_quantities[9]
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2016-2',
                        height: 4,
                        bottom: 30,
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
            renderTab1Charts1B(){
                var myChart = echarts.init(document.getElementById('myChart1_b'));
                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        width:'80%',
                        right: 10,
                        top: 20,
                        data: this.tab1Chart1DataB.material_names
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
                        data: this.tab1Chart1DataB.dates[0]
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        type: 'value'
                    },
                    series: [
                        {
                            name: this.tab1Chart1DataB.material_names[0],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[0]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[1],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[1]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[2],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[2]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[3],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[3]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[4],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[4]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[5],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[5]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[6],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[6]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[7],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[7]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[8],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[8]
                        },
                        {
                            name: this.tab1Chart1DataB.material_names[9],
                            type: 'line',
                            data: this.tab1Chart1DataB.purchase_amounts[9]
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2016-2',
                        height: 4,
                        bottom: 30,
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
            getTab1Charts2Data(){
                var Data = [],newData = [];
                var arr1 = ['product'];
                this.tab1Chart2Data.years[0].forEach(value => {
                    newData.push(value.toString())
                })
                console.log(newData)
                Data[0] = arr1.concat(newData);
                var material_names = this.tab1Chart2Data.material_names;

                for(var i=0;i<material_names.length;i++){
                    var arr = [material_names[i]];
                    Data[i+1] = arr.concat(this.tab1Chart2Data.used_quantities[i]);
                }
                this.chartDataArr = Data
            },
            renderTab1Charts2(){
                this.getTab1Charts2Data()
                var myChart = echarts.init(document.getElementById('myChart2'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    legend: {
                        width:'65%',
                        right: 10,
                        top: 20,
                    },
                    dataset: {
                        source: this.chartDataArr
                    },
                    xAxis: {
                        type: 'category',},
                    yAxis: {gridIndex: 0},
                    grid: {right: '40%'},
                    series: [
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: [10, 50],
                            center: ['80%', '55%'],
                            roseType : 'radius',
                            label: {
                                formatter: '{b}: {@2016} ({d}%)'
                            },
                            encode: {
                                itemName: 'product',
                                value: '2016',
                                tooltip: '2016'
                            }
                        }
                    ],
                };

                /* var option = {
                    legend: {},
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    dataset: {
                        source: [
                            ["product",'2016','2017','2018'],
                            ["钢绞线",2597934,8943187,6790353],
                            ["光缆",3711228,4616072,1978413],
                            ["WLAN天线",724172,2680789,2190164],
                            ["测距仪",402651,1090196,1102681],
                            ["硅芯管",855770,701741,498684],
                            ["光缆终端盒",612877,666447,390386],
                            ["U型抱箍",389971,519786,222579],
                            ["IP专用交换机（IP PBX）",144422,304120,281197],
                            ["光纤配线架",276252,279244,146541],
                            ["负载200W",112762,255135,250041]
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {gridIndex: 0},
                    grid: {top: '55%'},
                    series: [
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: '30%',
                            center: ['50%', '25%'],
                            label: {
                                formatter: '{b}: {@2016} ({d}%)'
                            },
                            encode: {
                                itemName: 'product',
                                value: '2016',
                                tooltip: '2016'
                            }
                        }
                    ]
                }; */
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
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            renderTab1Charts3(){
                var myChart = echarts.init(document.getElementById('myChart3'));
                /*构造数据*/
                var chartDataArr = [];
                chartDataArr[0] = ['product','采购','实际使用'];

                var myMaterialsArr = this.tab1Chart3Data.material_names,
                    myPurchase_quantitieArr = this.tab1Chart3Data.purchase_quantities,
                    myUsed_quantitiesArr = this.tab1Chart3Data.used_quantities;
                for(var i=0;i<myMaterialsArr.length;i++){
                    chartDataArr[i+1] = [myMaterialsArr[i],myPurchase_quantitieArr[i],myUsed_quantitiesArr[i]];
                }
                // 指定图表的配置项和数据
                var option = {
                    legend: {
                        right:20
                    },
                    tooltip: {},
                    dataset: {
                        source: chartDataArr
                    },
                    xAxis: {type: 'category'},
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        {type: 'bar'}
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: 'IT零星配件',
                        endValue: '硅芯管',
                        height: 4,
                        bottom: 60,
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
            renderTab1Charts4(){
                var myChart = echarts.init(document.getElementById('myChart4'));
                var colors = ['#a6c058', '#f5a200', '#666'];
                // 指定图表的配置项和数据
                var option = {
                    color: colors,
                    tooltip: {
                        trigger: 'none',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    legend: {
                        data:[this.tab1Chart4Year_a+"年", this.tab1Chart4Year_b+"年"]
                    },
                    grid: {
                        top: 70,
                        bottom: 50
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            data: this.tab1Chart4Data.dates_b
                        },
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            data: this.tab1Chart4Data.dates_a
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name:this.tab1Chart4Year_a+"年",
                            type:'line',
                            xAxisIndex: 1,
                            smooth: true,
                            data: this.tab1Chart4Data.percents_a
                        },
                        {
                            name:this.tab1Chart4Year_b+"年",
                            type:'line',
                            smooth: true,
                            data: this.tab1Chart4Data.percents_b
                        }
                    ]
                };
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            renderTab2Charts1(){
                var myChart = echarts.init(document.getElementById('myChart5'));

                var chartDataArr = [];
                var arr1 = ['product'];
                chartDataArr[0] = arr1.concat(this.tab2Chart1Data.dates);
                var mydepots = this.depotCityArr;
                for(var i=0;i<mydepots.length;i++){
                    var arr = [mydepots[i]];
                    chartDataArr[i+1] = arr.concat(this.tab2Chart1Data['depot_'+(i+1)]);
                }
                // 指定图表的配置项和数据
                var option = {
                    legend: {},
                    tooltip: {
                        trigger: 'axis',
                        showContent: false
                    },
                    legend: {
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
                    grid: {right: '40%'},
                    series: [
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {type: 'line', seriesLayoutBy: 'row'},
                        {
                            type: 'pie',
                            id: 'pie',
                            radius: [20, 110],
                            center: ['80%', '55%'],
                            roseType : 'radius',
                            label: {
                                formatter: '{b}: {@2018-1} ({d}%)'
                            },
                            encode: {
                                itemName: 'product',
                                value: '2018-1',
                                tooltip: '2018-1'
                            },
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'none',
                        startValue: '2016-1',
                        height: 4,
                        bottom: 62,
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
                myChart.setOption(option);
                window.onresize = myChart.resize
            },
            /* 选择物料   */
            tab2Chart1ClickMaterialItem(index, value){
                this.tab2Chart1MaterialActive = index;
                if(index != -1){
                    this.tab2Chart1Material = value
                } else{
                    this.tab2Chart1Material = ''
                }
                this.getTab2ChartData1();
            },
            tab2Chart1ClickMoreMaterial(){
                this.tab2Chart1MoreShowMaterial = !this.tab2Chart1MoreShowMaterial
            },
            /* 选择年份 */
            tab1Chart3ClickYearItem(index, value){
                this.tab1Chart3YearActive = index;
                if(index != -1){
                    this.tab1Chart3Year = value
                } else{
                    this.tab1Chart3Year = ''
                }
                this.getTab1ChartData3()
            },
            /* 选择物料   */
            tab1Chart4ClickMaterialItem(index, value){
                this.tab1Chart4MaterialActive = index;
                if(index != -1){
                    this.tab1Chart4Material = value
                } else{
                    this.tab1Chart4Material = ''
                }
                this.getTab1ChartData4();
            },
            tab2Chart1ClickMoreMaterial(){
                this.tab2Chart1MoreShowMaterial = !this.tab2Chart1MoreShowMaterial
            },
        },
        mounted(){
            this.widthCof();
            this.getTab1ChartData1A();
            this.getTab1ChartData1B();
            this.getTab1ChartData2();
            this.getTab1ChartData3();
            this.getTab1ChartData4();
            this.getTab2ChartData1();
        },
        created(){
            this.getFilterData();//获取筛选用到的枚举数据
            this.getData();//获取结果数据用于渲染table
        }
    }
</script>
<style lang="scss" scoped>
    h5{
        color:#2b3f6e;
        margin-bottom:15px;
        font-size: 16px;
        font-weight:500;
    }
    .mychartBox2{
        padding:20px;
        .chartFilter{
            position: static;
        }

    }
    .tools2{
        position: absolute;
        right: 20px;
        top: 15px;
        z-index: 2;
        padding: 5px 15px;
        font-size: 12px;
        border-radius: 3px;
        background: #FFF;
        border: 1px solid #739cb9;
        color: #606266;
    }
    .tools2:hover{
        border: 1px solid #409EFF;
        color:#409EFF;
    }

.blockChart{
    position: relative;
    .taberTools{
        position: absolute;
        right: 150px;
        top: 8px;
        z-index: 2;
    }
    .tab1_content .mychartBox{
        padding-top:10px;
    }
    .tab1_content .mychartBox3 .myChart{
        margin-top:20px;
    }
    .tab1_content .chartFilter{
        top:40px;
    }
}
</style>