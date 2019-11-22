<template>
    <div class="basicChart">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>基本水平</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="tools" v-show="blockShow === 1">
                <el-radio v-model="radio" label="region" @change="getSectorData">区域分布</el-radio>
                <el-radio v-model="radio" label="scale" @change="getSectorData">规模分布</el-radio>
            </div>
        </div>
        <el-card class="box-card">
        <!-- 切换为图形 -->
        <div class="blockTable" v-show="blockShow === 1">
            <el-button @click="btnReturn" class="returnBtn" type="text" v-show="mapBtn"><<返回全国地图</el-button>
            <div class="basicBox">
                <!-- 地图 -->
                <div id="chinaMap" class="mapBox"></div>
                <!-- 筛选 -->
                <div class="screenBoxDiv">
                    <!-- <div class="screen" v-show="radio == 'region'">
                        <ul>
                            <li>
                                <i style="background:#1f9b56"></i>
                                <span>优秀</span>
                                <button>查  看</button>
                            </li>
                            <li>
                                <i style="background:#435e93"></i>
                                <span>正常</span>
                                <button>查  看</button>
                            </li>
                            <li>
                                <i style="background:#ecc800"></i>
                                <span>黄色预警</span>
                                <button>查  看</button>
                            </li>
                            <li>
                                <i style="background:#f41e01"></i>
                                <span>红色预警</span>
                                <button>查  看</button>
                            </li>
                        </ul>
                    </div> -->
                    <!-- 扇形表格 -->
                    <div class="sectorBox" v-show="radio == 'scale'">
                        <div id="sectorBox"></div>
                        <!-- 详细数据 -->
                        <div class="infoData">
                            <div class="items" v-for="(item,index) in infoData" :key="index">
                                <ul>
                                    <li>总数：{{item.num}}个</li>
                                    <li>优秀：<span style="color:#1f9b56">{{item.excellent}}</span>个</li>
                                    <li>正常：<span style="color:#556c9b">{{item.normal}}</span>个</li>
                                    <li>黄色预警：<span style="color:#ecc800">{{item.yellow}}</span>个</li>
                                    <li>红色预警：<span style="color:#f00">{{item.red}}</span>个</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 切换为数据表格 -->
        <div class="blockChart" v-show="blockShow === 0">
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
                <!-- 公司性质 -->
                <div class="items clearfix">
                    <div class="fl condition">公司性质:</div>
                    <div class="fl classify nature">
                        <div>
                            <span @click="clickN(-1)"  :class="{n_active:nActive == -1}">全部</span>
                        </div>
                        <div v-for="(item,index) in dataN" :key="index">
                            <span @click="clickN(index,item)"  :class="{n_active:nActive == index}">{{item}}</span>
                        </div>
                    </div>
                </div>
                <!-- 注册时间 -->
                <div class="items clearfix">
                    <div class="fl condition">注册时间:</div>
                    <div class="fl classify time">
                        <div>
                            <span @click="clickT(-1)"  :class="{t_active:tActive == -1}">全部</span>
                        </div>
                        <div v-for="(item,index) in dataT" :key="index">
                            <span @click="clickT(index,item)"  :class="{t_active:tActive == index}">{{item}}</span>
                        </div>
                    </div>
                </div>
                <!-- 注册资本(万) -->
                <div class="items clearfix">
                    <div class="fl condition">注册资本(万):</div>
                    <div class="fl classify capital">
                        <div>
                            <span @click="clickCa(-1)"  :class="{ca_active:caActive == -1}">全部</span>
                        </div>
                        <div v-for="(item,index) in dataCa" :key="index">
                            <span @click="clickCa(index,item)"  :class="{ca_active:caActive == index}">{{item}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 表格数据 -->
            <div class="tableBox ordinaryTable">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="供应商编码">
                        <template slot-scope="scope">
                            <span style="color:#6595f3">{{scope.row.code}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="供应商"></el-table-column>
                    <el-table-column prop="province" label="省"></el-table-column>
                    <el-table-column prop="city" label="市"></el-table-column>
                    <el-table-column prop="business_address" :show-overflow-tooltip="true" label="经营地"></el-table-column>
                    <el-table-column prop="registered_address" :show-overflow-tooltip="true" label="注册地"></el-table-column>
                    <el-table-column prop="registration_year" label="注册时间"></el-table-column>
                    <el-table-column label="公司规模">
                         <template slot-scope="scope">
                            <span v-show="scope.row.company_size==='中'" :class="scope.row.company_size==='中'? 'color1':'' ">{{scope.row.company_size}}</span>
                            <span v-show="scope.row.company_size==='较小'" :class="scope.row.company_size==='较小'? 'color2':'' ">{{scope.row.company_size}}</span>
                            <span v-show="scope.row.company_size==='较大'" :class="scope.row.company_size==='较大'? 'color3':'' ">{{scope.row.company_size}}</span>
                            <span v-show="scope.row.company_size==='小'" :class="scope.row.company_size==='小'? 'color4':'' ">{{scope.row.company_size}}</span>
                            <span v-show="scope.row.company_size==='大'" :class="scope.row.company_size==='大'? 'color5':'' ">{{scope.row.company_size}}</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="registered_capital" label="注册资本"></el-table-column>
                    <el-table-column prop="company_type" label="公司性质"></el-table-column>
                    <el-table-column label="经营主业务是否单一">
                        <template slot-scope="scope">
                            <span v-show="scope.row.is_single_business == false" style="color:#f00">否</span>
                            <span v-show="scope.row.is_single_business == true" style="color:#109df7">是</span>
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
        <!-- 切换按钮 -->
        <div class="basiciTableBtn fr">
            <a @click="changeShow(blockShow)">
                <span v-show="blockShow === 1">基础水平表格</span>
                <span v-show="blockShow === 0">基础水平图表</span>
            </a>
        </div>
        </el-card>
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {removeChinese,fieldStr} from '../../js/common.js'
import {suppliersList,chartsBaseAttr, FetchGet, mapsData} from '../../api/api.js'
require('echarts/map/js/china.js')
export default {
    name:'basicChart',
    data(){
        return{
            blockShow: parseInt(localStorage.getItem('blockState')),//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
            radio:'region',
            infoData:[],
            cityShow:false,
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//性质
            tActive:-1,//时间
            caActive:-1,//资本
            /* 选中的字段 */
            selectP:'',
            selectC:'',
            selectN:'',
            selectTS:'',//成立开始时间
            selectTE:'',//成立结束时间
            selectCaS:'',//资本最小值
            selectCaE:'',//资本最大值
            mapBtn:false,

            moreShowP:false,
            moreShowC:false,
            dataN:['集体企业','私有企业','国有企业','合伙企业'],
            dataT:['小于1998','1998-2005','2005-2010','2010-2015','大于2015'],
            dataCa:['小于20','20-200','200-400','400-700','700-1500','大于1500'],
            tableData:[],//表格数据
            provinceData:[],//省份数据
            cityData:[],//城市数据
            pageNum:1,
            pageSize:10,
            total:100,
            countNum:0,
            chinaMapData:[]
        }
    },
    methods:{
        /* 获取城市数据 */
        getprovinceData(){
            this.provinceData = CTAData
        },
        /* 绘制中国地图 */
        chinaConfigure() {
            let _this = this
            let myChart = echarts.init(document.getElementById('chinaMap')) //这里是为了获得容器所在位置

            let option = {
                tooltip :{
                    backgroundColor: '#6f798b7d',
                    formatter: function (params) {
                    //console.log(params)
                        if(params.data){
                            return `
                            <div class="toolDiv">
                                <p>${params.data.name} <span>${params.data.value}</span></p>
                                <div class="items">
                                    <h4>预警级别</h4>
                                    <div class="item yjLv">
                                        <ul class = "clearfix">
                                            <li><span>${params.data.red}</span><span>(红色预警})</span></li>
                                            <li><span>${params.data.yellow}</span><span>(黄色预警)</span></li>
                                            <li><span>${params.data.normal}</span><span>(正常)</span></li>
                                            <li><span>${params.data.excellent}</span><span>(优秀)</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>`
                        }
                    },
                },
                dataRange: {
                    x: 'left',
                    y: 'bottom',
                    splitList: [
                        {start: 500},
                        {start: 400, end: 500},
                        {start: 300, end: 400},
                        {start: 200, end: 300},
                        {start: 100, end: 200},
                        {start: 10, end: 100},
                        {end: 10}
                    ],
                    color: ['#7aa5c7', '#b9cee1']
                },
                series: [{
                    name: '总数',
                    type: 'map',
                    mapType: 'china',
                    center:'center',
                    roam: true,
                    selectedMode: 'single',
                    showLegendSymbol:false,
                    label: {
                        normal: {
                            show: true,//显示省份标签
                            textStyle:{color:"#666"}//省份标签字体颜色
                        },
                        emphasis: {//对应的鼠标悬浮效果
                            show: true,
                            textStyle:{color:"#d7e3ef"}
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1,//区域边框宽度
                            borderColor: '#fff',//区域边框颜色
                            areaColor:"#c2d3e3",//区域颜色

                        },
                        emphasis: {
                            borderWidth: 1,
                            borderColor: '#fff',
                            areaColor:"#7aa5c7",
                        }
                    },
                    data: this.chinaMapData
                }],
                animation: false
            };
            myChart.setOption(option, true);
            var provinces = require('../../../static/provinces').provinces;
            setTimeout(delay, 500);

            function delay() {
                myChart.on("click", async function (param) {
                    let mapDatas = await mapsData({province:param.name}).then(res => {
                        return res.data.data.map(item => {
                            item.name = item.city_name
                            let sum = 0
                            item.status.forEach(items => {
                                sum += items.value
                            })
                            item.value = sum
                            return item
                        });
                    }).catch(() => {})
                    setTimeout(()=>{
                        _this.mapBtn = true
                    },100)
                    var selectedProvince = param.name;
                    if (!provinces[selectedProvince]) {
                        option.series.splice(1);
                        option.legend = null;
                        option.visualMap = null;
                        myChart.setOption(option, true);
                        return;
                    }
                    FetchGet(provinces[selectedProvince]).then(res => {
                        echarts.registerMap(selectedProvince, res.data);
                        option.series[0] = {
                            name: '总数',
                            type: 'map',
                            mapType: selectedProvince,
                            roam: true,
                            selectedMode: 'single',
                            label: {
                                normal: {
                                    show: true,//显示省份标签
                                    textStyle:{color:"#333"}//省份标签字体颜色
                                },
                                emphasis: {//对应的鼠标悬浮效果
                                    show: true,
                                    textStyle:{color:"#d7e3ef"}
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,//区域边框宽度
                                    borderColor: '#fff',//区域边框颜色
                                    areaColor:"#c2d3e3",//区域颜色

                                },
                                emphasis: {
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    areaColor:"#7aa5c7",
                                }
                            },
                            data: mapDatas
                            /* data : [
                                {
                                    name:'南京市',
                                    value:'123',
                                    city_name:'南京市',
                                    scales: []
                                }
                            ] */
                        };
                        option.tooltip = {
                            backgroundColor: '#6f798b7d',
                            formatter: function (params) {
                                //console.log(params)
                                if(params.data){
                                    console.log(params)
                                    return `
                                    <div class="toolDiv">
                                        <p>${params.data.name} <span>${params.data.value}</span></p>
                                        <div class="items">
                                            <h4>供应商规模</h4>
                                            <div class="item">
                                                <ul class = "clearfix">
                                                    <li><span>${params.data.scales[0].value}</span><span>(${params.data.scales[0].name})</span></li>
                                                    <li><span>${params.data.scales[1].value}</span><span>(${params.data.scales[1].name})</span></li>
                                                    <li><span>${params.data.scales[2].value}</span><span>(${params.data.scales[2].name})</span></li>
                                                    <li><span>${params.data.scales[3].value}</span><span>(${params.data.scales[3].name})</span></li>
                                                    <li><span>${params.data.scales[4].value}</span><span>(${params.data.scales[4].name})</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="items">
                                            <h4>预警级别</h4>
                                            <div class="item yjLv">
                                                <ul class = "clearfix">
                                                    <li><span>${params.data.status[0].value}</span><span>(${params.data.status[0].name})</span></li>
                                                    <li><span>${params.data.status[1].value}</span><span>(${params.data.status[1].name})</span></li>
                                                    <li><span>${params.data.status[2].value}</span><span>(${params.data.status[2].name})</span></li>
                                                    <li><span>${params.data.status[3].value}</span><span>(${params.data.status[3].name})</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`
                                }
                            },
                        }
                        myChart.setOption(option, true);
                    });
                });
            };
        }, 
        /* 返回中国地图 */
        btnReturn(){
            this.mapBtn = false
            this.chinaConfigure()
        },
        /* 绘制图形 */
        getSector(){
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('sectorBox'));
            // 绘制图表
            myChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : [30, 110],
                        roseType : 'area',
                        itemStyle:{
                            normal:{
                                color: function(params) {//柱子颜色
                                    var colorList = ['#1f9b56' ,'#00c8cf' ,'#435e93' ,'#da6100' ,'#ec9b00'];
                                    return colorList[params.dataIndex]
                                },
                            },
                        },
                        data:this.infoData
                    }
                ]
            });
            window.onresize = myChart.resize;
        },
        /* 切换图形和表格 */
        changeShow(v){
            // console.log("刚进入："+this.countNum)
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
            /* console.log("计数器："+this.countNum)
            console.log("状态："+this.blockShow) */
        },
        /* 选取省份 */
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
        /* 选择城市 */
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
        /* 选择公司性质 */
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
        /* 选择成立时间 */
        clickT(index,value){
            this.tActive = index
            let Data = []
            Data = fieldStr(value,index,this.selectTS,this.selectTE,this.dataT)
            this.selectTS = Data[0]
            this.selectTE = Data[1]
            this.pageNum = 0
            this.searchData()
        },
        /* 选择注册资本 */
        clickCa(index,value){
            this.caActive = index
            let Data = []
            Data = fieldStr(value,index,this.selectCaS,this.selectCaE,this.dataCa)
            this.selectCaS = Data[0]
            this.selectCaE = Data[1]
            this.pageNum = 0
            this.searchData()
        },
        clickMoreP(){
            this.moreShowP = !this.moreShowP
        },
        clickMoreC(){
            this.moreShowC = !this.moreShowC
        },
        /* 数据 */
        getSectorData(){
            chartsBaseAttr({condition:this.radio}).then(res => {
                if(this.radio === 'scale'){
                    this.infoData = res.data.data
                    this.infoData.map((item,index) => {
                        item.value = item.num
                    })
                    this.getSector()
                }else{
                    let Data = res.data.data
                    Data.map((item,index) => {
                        item.value = item.num
                    })
                    Data.forEach(item => {
                        if(item.name === '内蒙古自治区' || item.name === '黑龙江省'){
                            item.name = item.name.substring(0,3)
                        }else{
                            item.name = item.name.substring(0,2)
                        }
                    })
                    this.chinaMapData = Data
                    this.chinaConfigure()
                }
            }).catch(() => {})
        },
        /* 获取数据 */
        //通用数据
        getList(params){
            suppliersList(params).then(res => {
                //console.log(res.data)
                let Data = []
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
                companyType:this.selectN,
                startYear:this.selectTS,
                endYear:this.selectTE,
                startCapital:this.selectCaS,
                endCapital:this.selectCaE
            }
            this.getList(params)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.searchData()
        },
        handleCurrentChange(val) {
            this.pageNum = val-1
            this.searchData()
        },
        /* 页面固定宽度 */
        widthCof(){
            $('.mapBox').css({"width":$(window).width()-460+'px'});
            $('.mapBox').css({"height":$(document).height()-180+'px'});
            $('.blockChart').css({"width":$(window).width()-310+'px'});
        }
    },
    mounted(){
        this.widthCof()
        this.getSectorData()
        this.chinaConfigure();
    },
    created(){
        this.changeShow(this.blockShow)
        this.getData()
        this.getprovinceData()
    }
}
</script>
<style lang="scss" scoped>
.color1{
    color: #435e93;
}
.color2{
    color: #eea93f;
}
.color3{
    color: #3fcfd5;
}
.color4{
    color: #df7b3f;
}
.color5{
    color: #4ea973;
}
.basicBox{
    width: 100%;
    position: relative;
}
.tools{
    position: absolute;
    top: 12px;
    right: 59px;
}
.mapBox{
    margin: 0 auto;
}
#cityMap{
    width: 100%;
    height: 300px;
}
.screen{
    width: 200px;
    li{
        margin-top: 30px;
    }
    i{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        vertical-align:middle;
    }
    span{
        display: inline-block;
        width: 80px;
        margin: 0 15px;
    }
    button{
        display: inline-block;
        padding: 2px 10px;
        cursor: pointer;
        color: #fff;
        background: #0d82f6;
        border-radius: 3px;
        &:hover{
            opacity: 0.8;
        }
    }
}
.screenBoxDiv{
    position: absolute;
    top: -15px;
    right: 50px;
}
.sectorBox,#sectorBox{
    width: 350px;
    height: 300px;
}
.sectorBox{
    position: absolute;
    right: 20px;
}
.infoData{
    & .items{
        color: #666;
        position: absolute;
        &:first-child{
            top: 25px;
            right: -45px;
        }
        &:nth-child(2){
            top: 195px;
            right: -50px;
        }
        &:nth-child(3){
            top: 10px;
            left: -25px;
        }
        &:nth-child(4){
            bottom: -5px;
            left: 17px;
        }
        &:last-child{
            bottom: -90px;
            left: 200px;
        }
        
    }
}
.blockTable{
    position: relative;
    .returnBtn{
        position: absolute;
        top: 0;
        left: 0;
        padding:5px;
        z-index: 100;
    }
}

</style>
