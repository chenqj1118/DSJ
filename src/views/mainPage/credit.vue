<template>
    <div class="credit">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>信用水平</el-breadcrumb-item>
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
                        <!-- 信用状态 -->
                        <div class="items clearfix">
                            <div class="fl condition">信用状态:</div>
                            <div class="fl classify nature">
                                <div>
                                    <span @click="clickN(-1)"  :class="{n_active:nActive == -1}">全部</span>
                                </div>
                                <div v-for="(item,index) in dataN" :key="index">
                                    <span @click="clickN(index,item)"  :class="{n_active:nActive == index}">{{item}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 表格数据 -->
                    <div class="tableBox ordinaryTable ">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column label="供应商编码" :width="120">
                                <template slot-scope="scope">
                                    <span style="color:#6595f3">{{scope.row.supplier.code}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="credit_score" label="信用水平得分" :width="120"></el-table-column>
                            <el-table-column prop="supplier.name" label="供应商"></el-table-column>
                            <el-table-column prop="supplier.province" label="省"></el-table-column>
                            <el-table-column prop="supplier.city" label="市"></el-table-column>
                            <el-table-column label="信用状态">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.credit_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.credit_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.credit_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.credit_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                            <!-- 经营能力 -->
                            <el-table-column prop="inventory_turnover" label="存货周转率" :width="120"></el-table-column>
                            <el-table-column prop="accounts_receivable_turnover" label="应收账款周转率" :width="120"></el-table-column>
                            <el-table-column prop="current_asset_turnover" label="流动资产周转率" :width="120"></el-table-column>
                            <el-table-column prop="total_asset_turnover" label="总资产周转率" :width="120"></el-table-column>
                            <el-table-column prop="management_capacity" label="经营能力"></el-table-column>
                            <!-- 偿债能力 -->
                            <el-table-column prop="current_ratio" label="流动比率"></el-table-column>
                            <el-table-column prop="quick_ratio" label="速动比率"></el-table-column>
                            <el-table-column prop="cash_current_debt_ratio" label="现金流动负债比率" :width="150"></el-table-column>
                            <el-table-column prop="solvency" label="偿债能力"></el-table-column>
                            <!-- 盈利能力 -->
                            <el-table-column prop="operating_profit" label="营业利润率" :width="100"></el-table-column>
                            <el-table-column prop="cost_profit" label="成本费用利润率" :width="150"></el-table-column>
                            <el-table-column prop="roa" label="总资产报酬率" :width="120"></el-table-column>
                            <el-table-column prop="roe" label="净资产收益率" :width="120"></el-table-column>
                            <el-table-column prop="roc" label="资本收益率" :width="100"></el-table-column>
                            <el-table-column prop="profitability" label="盈利能力"></el-table-column>
                            <!-- 资金流能力 -->
                            <el-table-column prop="fixed_asset_investment" label="固定资产投资" :width="120"></el-table-column>
                            <el-table-column prop="liquid_asset_investment" label="流动资产投资" :width="120"></el-table-column>
                            <el-table-column prop="operating_income" label="营业收入"></el-table-column>
                            <el-table-column prop="residual_income" label="残值收入或变价收入" :width="150"></el-table-column>
                            <el-table-column prop="recovered_liquid_asset" label="收回的流动资产" :width="140"></el-table-column>
                            <el-table-column prop="capital_flow_capability" label="资金流能力" :width="100"></el-table-column>
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
                        <div class="chartsBox" id="creditLevel"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 水平按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 0">信用水平图表</span>
                <span v-show="blockShow === 1">信用水平表格</span>
            </a>
        </div>
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {suppliersCredit,chartsCredit} from '../../api/api.js'
export default {
    name:'credit',
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
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            moreShowP:false,
            moreShowC:false,
            dataN:['正常','黄色预警','红色预警','优秀'],
            tableData:[],

            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,

            creditLevelData:[],//信用水平图表数据
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
        /* 选择风险控制 */
        clickN(index,value){
            this.nActive = index
            if(index != -1){
                this.selectN = value
            }else{
                this.selectN = ''
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
            suppliersCredit(params).then(res => {
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
                creditStatus:this.selectN
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
            this.getCreditLevelData()
        },
        /* 选择市 */
        selectCityData(value){
            this.selectProvince(value)
        },
        changeCityData(value){
            this.selectCity = value
            this.getCreditLevelData()
        },
        /* 绘制图表 */
        getCreditLevel(){
            let spot = $('#creditLevel')
            spot.css({"width":$("#creditLevel").width((window.innerWidth-360)+'px')});
            let creditLevel = echarts.init(document.getElementById('creditLevel'));
            let option = {
                title : {
                    text:'信用水平得分',
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
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: {
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
                    data : this.creditLevelData[0].names
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#435e93'
                        }
                    },
                },
                dataZoom:[
                    {
                        show: true,
                        type: 'slider',
                        start: 0,
                        bottom:'7%',
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
                        }
                    }
                ],
                series: [{
                    name:'信用水平',
                    data: this.creditLevelData[0].scoreData,
                    type: 'bar',
                    itemStyle:{
                        normal:{
                            color:'#2abec8'
                        }
                    },
                }]
            }
            creditLevel.setOption(option);
            window.onresize = creditLevel.resize
        },
        /* 图表数据 */
        getCreditLevelData(){
            chartsCredit({province:this.selectPro,city:this.selectCity}).then(res => {
                //console.log(res.data.data[0].infos)
                
                let scoreData = []
                res.data.data[0].infos.forEach(item => {
                    scoreData.push(item.score)
                })
                res.data.data.map(item => {
                    //console.log(item)
                    item.scoreData = scoreData
                })
                this.creditLevelData = res.data.data
                this.getCreditLevel()
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
        this.getCreditLevelData()
    },
}
</script>
<style lang="scss" scoped>
.tbeleHeader{
    span{
        display: table-cell;
    }
}
#creditLevel{
    height: 700px;
    width: 100%;
}
</style>

