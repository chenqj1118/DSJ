<template>
    <div class="cooperation">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>合作水平</el-breadcrumb-item>
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
                        <!-- 合同额 -->
                        <div class="items clearfix">
                            <div class="fl condition">合同额(万):</div>
                            <div class="fl classify nature">
                                <div>
                                    <span @click="clickN(-1)"  :class="{n_active:nActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in dataN" :key="index">
                                    <span @click="clickN(index,item)"  :class="{n_active:nActive == index}">{{item}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 供货量 -->
                        <div class="items clearfix">
                            <div class="fl condition">供货量(万):</div>
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
                            <el-table-column prop="partner_count" label="合作移动伙伴数"></el-table-column>
                            <el-table-column prop="total_contract_amount" label="合作移动客户合同额"></el-table-column>
                            <el-table-column prop="total_supply" label="合作移动客户供货总量"></el-table-column>
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
                <!-- 合作水平得分 -->
                <el-col :span="24">
                    <el-card shadow="hover" >
                        <div class="chartsBox" id="cooperationLevel"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 水平按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 0">合作水平图表</span>
                <span v-show="blockShow === 1">合作水平表格</span>
            </a>
        </div>
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {fieldStr} from '../../js/common.js'
import {suppliersCooperation,chartsCooperation} from '../../api/api.js'
export default {
    name:'cooperation',
    data(){
        return{
            blockShow:parseInt(localStorage.getItem('blockState')),//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//合同额
            eActive:-1,//供货量
            /* 选中的字段 */
            selectPro:'上海市',
            selectCity:'黄浦区',
            selectP:'',
            selectC:'',
            selectNS:'',
            selectNE:'',
            selectES:'',
            selectEE:'',

            data:['上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东','上海','北京','广东'],
            moreShowP:false,
            moreShowC:false,
            dataN:['小于50','50-200','200-400','400-700','大于700'],
            dataE:['小于50','50-100','100-200','200-400','大于400'],
            tableData:[],
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,
            cooperationData:[]
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
        clickN(index,value){
            this.nActive = index
            let Data = []
            Data = fieldStr(value,index,this.selectNS,this.selectNE,this.dataN)
            this.selectNS = Data[0]
            this.selectNE = Data[1]
            this.pageNum = 0
            this.searchData()
        },
        clickE(index,value){
            this.eActive = index
            let Data = []
            Data = fieldStr(value,index,this.selectES,this.selectEE,this.dataE)
            this.selectES = Data[0]
            this.selectEE = Data[1]
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
            suppliersCooperation(params).then(res => {
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
                startContract:this.selectNS,
                endContract:this.selectNE,
                startSupply:this.selectES,
                endSupply:this.selectEE
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
            this.getCooperationLevelData()
        },
        /* 选择市 */
        selectCityData(value){
            this.selectProvince(value)
        },
        changeCityData(value){
            this.selectCity = value
            this.getCooperationLevelData()
        },
        getCooperationLevel(){
            let spot = $('#cooperationLevel')
            spot.css({"width":$("#cooperationLevel").width((window.innerWidth-360)+'px')});
            let cooperationLevel = echarts.init(document.getElementById('cooperationLevel'));
            let option = {
                title: {
                    text:'供应商的供货额和供货量的趋势分析',
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
                grid: [{
                    left: 50,
                    right: 50,
                    height: '35%'
                }, {
                    left: 50,
                    right: 50,
                    top: '55%',
                    height: '35%'
                }],
                axisPointer: {
                    link: {xAxisIndex: 'all'}
                },
                dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        bottom:'50%',
                        end: 50,
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
                        },
                        xAxisIndex: [0, 1]
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 30,
                        end: 70,
                        xAxisIndex: [0, 1]
                    }
                ],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data: this.cooperationData[0].names,
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                    },
                    {
                        gridIndex: 1,
                        type : 'category',
                        boundaryGap : false,
                        position: 'top',
                        data: this.cooperationData[0].names,
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                    }
                ],
                yAxis : [
                    {
                        name : '合同额(万)',
                        type : 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                    },
                    {
                        gridIndex: 1,
                        name : '供货量(万)',
                        type : 'value',
                        inverse: true,
                        axisLine:{
                            lineStyle:{
                                color:'#435e93'
                            }
                        },
                    }
                ],
                series : [
                    {
                        name:'合同额(万)',
                        type:'line',
                        symbolSize: 8,
                        hoverAnimation: false,
                        data:this.cooperationData[0].total_contract_amounts,
                        itemStyle: {
                            normal: {
                                color: "#42d0d6",
                                lineStyle: {
                                    color: "#42d0d6"
                                }
                            }
                        },
                    },
                    {
                        name:'供货量(万)',
                        type:'line',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: 8,
                        hoverAnimation: false,
                        data: this.cooperationData[0].total_supplies,
                        itemStyle: {
                            normal: {
                                color: "#f5a50d",
                                lineStyle: {
                                    color: "#f5a50d"
                                }
                            }
                        },
                    }
                ]
            }
            cooperationLevel.setOption(option);
            window.onresize = cooperationLevel.resize
        },
        getCooperationLevelData(){
            chartsCooperation({province:this.selectPro,city:this.selectCity}).then(res => {
                console.log(res.data.data)
                this.cooperationData = res.data.data
                this.getCooperationLevel()
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
        this.getCooperationLevelData()
    },
}
</script>
<style lang="scss" scoped>
#cooperationLevel{
    width: 100%;
    height: 700px;
}
</style>

