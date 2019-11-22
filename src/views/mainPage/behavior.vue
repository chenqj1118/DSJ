<template>
    <div class="behavior">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>行为水平</el-breadcrumb-item>
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
                        <!-- 报价水平 -->
                        <div class="items clearfix">
                            <div class="fl condition">报价水平(万):</div>
                            <div class="fl classify nature">
                                <div>
                                    <span @click="clickN(-1)"  :class="{n_active:nActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in dataN" :key="index">
                                    <span @click="clickN(index,item)"  :class="{n_active:nActive == index}">{{item}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 风险控制 -->
                        <div class="items clearfix">
                            <div class="fl condition">风险控制:</div>
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
                            <el-table-column prop="bidding_count" label="投标次数"></el-table-column>
                            <el-table-column prop="winning_count" label="中标次数"></el-table-column>
                            <el-table-column prop="win_rate" label="中标率"></el-table-column>
                            <el-table-column prop="bid_amount" label="报价合同标的额"></el-table-column>
                            <el-table-column prop="bid_amount_level" label="报价水平"></el-table-column>
                            <el-table-column prop="risk_control_level" label="风险控制能力"></el-table-column>
                            <el-table-column prop="delivery_score" label="交货是否正常"></el-table-column>
                            <el-table-column prop="supplier.score" label="行为水平得分"></el-table-column>
                            <el-table-column label="行为水平状态">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.behavior_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.behavior_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.behavior_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.behavior_status === '红色预警'">红色预警</span>
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
            <el-row :gutter="16">
                <!-- 投标情况 -->
                <el-col :span="10">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="tenderSsituation"></div>
                    </el-card>
                </el-col>
                <!-- 中标率 -->
                <el-col :span="14">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="WinRate"></div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="16">
                <!-- 报价水平供应商比例 -->
                <el-col :span="12">
                    <el-card shadow="hover" >
                        <div class="chartsBox" id="proportionSuppliers"></div>
                    </el-card>
                </el-col>
                <!--  报价合同标的额 -->
                <el-col :span="12">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="quotationSituation"></div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="16">
                <!-- 风险运营控制情况 -->
                <el-col :span="16">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="riskOperation"></div>
                    </el-card>
                </el-col>
                <!-- 供应商分布 --> 
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div class="chartsBox" id="distributionSuppliers"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 水平按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 0">行为水平图表</span>
                <span v-show="blockShow === 1">行为水平表格</span>
            </a>
        </div>
    </div>  
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {fieldStr} from '../../js/common.js'
import {suppliersBehavior,chartsBehavior} from '../../api/api.js'
export default {
    name:'behavior',
    data(){
        return{
            blockShow:parseInt(localStorage.getItem('blockState')),//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//报价
            eActive:-1,//级别
            /* 选中的字段 */
            selectPro:'上海市',
            selectCity:'黄浦区',
            selectP:'',
            selectC:'',
            selectNS:'',
            selectNE:'',
            selectE:'',
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            moreShowP:false,
            moreShowC:false,
            dataN:['小于50','50-150','150-250','250-500','500-800','大于800'],
            dataE:['按时','提前','延期'],
            tableData:[],

            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,
            tenderSsituationData:[],//抽检次数
            winRateData:[],//中标率
            proportionSuppliers:[],//供应商比例
            quotationSituationData:[],//报价合同标的额
            riskOperationData:[],//风险运营控制情况
            distributionSuppliersData:[],//供应商分布
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
        /* 选择报价水平 */
        clickN(index,value){
            this.nActive = index
            let Data = []
            Data = fieldStr(value,index,this.selectNS,this.selectNE,this.dataN)
            this.selectNS = Data[0]
            this.selectNE = Data[1]
            console.log(Data)
            this.pageNum = 0
            this.searchData()
        },
        /* 选择风险控制 */
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
            suppliersBehavior(params).then(res => {
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
                startBid:this.selectNS,
                endBid:this.selectNE,
                riskLevel:this.selectE
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
            /* this.getTenderSsituationData()
            this.getWinRateData()
            this.getProportionSuppliersData()
            this.getQuotationSituationData()
            this.getRiskOperationData()
            this.getDistributionSuppliersData() */
        },
        /* 选择市 */
        selectCityData(value){
            this.selectProvince(value)
        },
        changeCityData(value){
            this.selectCity = value
            this.getTenderSsituationData()
            this.getProportionSuppliersData()
            this.getQuotationSituationData()
            this.getRiskOperationData()
            this.getDistributionSuppliersData()
        },
        /* 绘制投标情况 */
        getTenderSsituation(){
            let spot = $('#tenderSsituation')
            spot.css({"width":$("#tenderSsituation").width((window.innerWidth-360)*5/12+'px')});
            let tenderSsituation = echarts.init(document.getElementById('tenderSsituation'));
            let option = {
                title : {
                    text:'供应商的投标次数和中标次数对比',
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
                    data:['投标次数','中标次数'],
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
                        data : this.tenderSsituationData[0].names
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
                        bottom:'12%',
                        end: 20,
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
                        name:'投标次数',
                        type:'bar',
                        data:this.tenderSsituationData[0].bidding_counts,
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                    },
                    {
                        name:'中标次数',
                        type:'bar',
                        data:this.tenderSsituationData[0].winning_counts,
                        itemStyle:{
                            normal:{
                                color:'#a5bf5a'
                            }
                        },
                    }
                ]
            }
            tenderSsituation.setOption(option);
            window.onresize = tenderSsituation.resize
        },
        /* 绘制中标率 */
        getWinRate(){
            let spot = $('#WinRate')
            spot.css({"width":$("#WinRate").width((window.innerWidth-360)*7/12+'px')});
            let WinRate = echarts.init(document.getElementById('WinRate'));
            let option = {
                title : {
                    text:'供应商在不同区间中标率分布',
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
                dataZoom:[{
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
                }],
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
                    data: this.winRateData[0].cities
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
                        data: this.winRateData[0].ec_a
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
                        data: this.winRateData[0].ec_b
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
                        data: this.winRateData[0].ec_c
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
                        data: this.winRateData[0].ec_d
                    },
                ]
            }
            WinRate.setOption(option);
            window.onresize = WinRate.resize
        },
        /* 绘制报价水平供应商比例 */
        getProportionSuppliers(){
            let spot = $('#proportionSuppliers')
            spot.css({"width":$("#proportionSuppliers").width((window.innerWidth-360)/2+'px')});
            let proportionSuppliers = echarts.init(document.getElementById('proportionSuppliers'));
            let option = {
                title : {
                    text:'绘制报价水平供应商比例',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}%",
                    axisPointer : {        
                        type : 'shadow'  
                    }
                },
                legend: {
                    data: ['高','较高','中','较低','低'],
                    right: 'right',
                },
                calculable: true,
                color: ['#d34d49', '#6ba2c8', '#91c7ae', '#eec577', '#99bacf', ],
                series: [
                    {
                        name:'供应商比例',
                        type:'funnel',
                        left: '5%',
                        top: 90,
                        bottom: 60,
                        width: '80%',
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'descending',
                        gap: 2,
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        labelLine: {
                            length: 10,
                            lineStyle: {
                                width: 1,
                                type: 'solid'
                            }
                        },
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        emphasis: {
                            label: {
                                fontSize: 20
                            }
                        },
                        data: this.proportionSuppliersData
                    }
                ]
            }
            proportionSuppliers.setOption(option);
            window.onresize = proportionSuppliers.resize
        },
        /* 报价合同标的额 */
        getQuotationSituation(){
            let spot = $('#quotationSituation')
            spot.css({"width":$("#quotationSituation").width((window.innerWidth-360)/2+'px')});
            let quotationSituation = echarts.init(document.getElementById('quotationSituation')); 
            let option = {
                title: {
                    text:'报价合同标的额',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '15%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: {
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                    data: this.quotationSituationData[0].names
                },
                yAxis: {
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
               dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        bottom:'4.5%',
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
                visualMap: {
                    top: 10,
                    right:10,
                    pieces: [{
                        gt: 0,
                        lte: 500,
                        color: '#a5bf5a'
                    }, {
                        gt: 500,
                        lte: 1000,
                        color: '#2abec8'
                    }, {
                        gt: 1000,
                        lte: 1500,
                        color: '#c89e64'
                    }, {
                        gt: 1500,
                        lte: 2000,
                        color: '#ff5331'
                    }, {
                        gt: 2000,
                        lte: 2500,
                        color: '#dc0000'
                    }],
                    outOfRange: {
                        color: '#f90'
                    }
                },
                series: {
                    name: '报价额度',
                    type: 'line',
                    data: this.quotationSituationData[0].bid_amounts
                }
            }
            quotationSituation.setOption(option);
            window.onresize = quotationSituation.resize()
        },
        /* 风险运营控制情况 */
        getRiskOperation(){
            let spot = $('#riskOperation')
            spot.css({"width":$("#riskOperation").width((window.innerWidth-360)*3/4+'px')});
            let riskOperation = echarts.init(document.getElementById('riskOperation')); 
            var labelRight = {
                normal: {
                    position: 'right'
                }
            };
            let option = {
                title: {
                    text:'供应商历史平均交货情况分析（-表示提前，+表示延期）',
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
                        return params[0].name + "(天数)" + "<br>" +params[0].marker+ params[0].seriesName + "：" + params[0].data + "天"
                    }
                },
                grid: {
                    top: 80,
                    bottom: 30,
                },
                 dataZoom:[{
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
                }],
                xAxis: {
                    type : 'value',
                    position: 'top',
                    splitLine: {lineStyle:{type:'dashed'}},
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                },
                yAxis: {
                    type : 'category',
                    axisLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    data : this.riskOperationData[0].names
                },
                series : [
                    {
                        name:'风险运营控制情况',
                        type:'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}'
                            }
                        },
                        data:this.riskOperationData[0].scores,
                        itemStyle:{
                            normal:{
                                color:'#2abec8'
                            }
                        },
                    }
                ]
            }
            riskOperation.setOption(option);
            window.onresize = riskOperation.resize
        },
        /* 供应商分布 */
        getDistributionSuppliers(){
            let spot = $('#distributionSuppliers')
            spot.css({"width":$("#distributionSuppliers").width((window.innerWidth-360)*0.25+'px')});
            let distributionSuppliers = echarts.init(document.getElementById('distributionSuppliers'));
            let option = {
                title: {
                    text:'供应商交货情况分布',
                    textStyle:{
                        color:'#2b426e',
                        fontWeight:'normal',
                　　　　 fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    data: ['延期','提前','按时'],
                    right: 'right',
                },
                calculable: true,
                color: ['#f5a101', '#a5bf5a', '#2abec8'],
                series : [
                    {
                        name:'供应商分布',
                        type:'pie',
                        radius : '55%',
                        center : ['50%', '50%'],
                        data:this.distributionSuppliersData.sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            }
            distributionSuppliers.setOption(option);
            window.onresize = distributionSuppliers.resize

        },
        /* 获取图表数据 */
        getTenderSsituationData(){
            chartsBehavior({
                province:this.selectPro,
                city:this.selectCity,
                condition:'a'
            }).then(res => {
                this.tenderSsituationData = res.data.data
                this.getTenderSsituation()
            }).catch(() => {})
        },
        getWinRateData(){
            chartsBehavior({
                province:this.selectPro,
                city:'',
                condition:'b'
            }).then(res => {
                //console.log(res.data)
                this.winRateData = res.data.data
                this.getWinRate()
            }).catch(() => {})
        },
        getProportionSuppliersData(){
            chartsBehavior({
                province:this.selectPro,
                city:this.selectCity,
                condition:'c'
            }).then(res => {
                for (var i = 0; i <  res.data.data.length; i++) {
                    var item =  res.data.data[i];
                    var v = parseInt(item.value)
                    item.value = v
                }
                this.proportionSuppliersData = res.data.data
                this.getProportionSuppliers()
            }).catch(() => {})
        },
        getQuotationSituationData(){
            chartsBehavior({
                province:this.selectPro,
                city:this.selectCity,
                condition:'d'
            }).then(res => {
                this.quotationSituationData = res.data.data
                //console.log(this.quotationSituationData)
                this.getQuotationSituation()
            }).catch(() => {})
        },
        getRiskOperationData(){
            chartsBehavior({
                province:this.selectPro,
                city:this.selectCity,
                condition:'e'
            }).then(res => {
                this.riskOperationData = res.data.data
                //console.log(this.riskOperationData)
                this.getRiskOperation()
            }).catch(() => {})
        },
        getDistributionSuppliersData(){
           chartsBehavior({
                province:this.selectPro,
                city:this.selectCity,
                condition:'f'
            }).then(res => {
                for (var i = 0; i <  res.data.data.length; i++) {
                    var item =  res.data.data[i];
                    var v = parseInt(item.value)
                    item.value = v
                }
                this.distributionSuppliersData = res.data.data
                //console.log(this.distributionSuppliersData)
                this.getDistributionSuppliers()
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
        this.getTenderSsituationData()
        this.getWinRateData()
        this.getProportionSuppliersData()
        this.getQuotationSituationData()
        this.getRiskOperationData()
        this.getDistributionSuppliersData()
    },
}
</script>
<style lang="scss" scoped>
#tenderSsituation,#WinRate,
#proportionSuppliers,#quotationSituation,
#riskOperation,#distributionSuppliers{
    width: 100%;
    height: 400px;
}
</style>

