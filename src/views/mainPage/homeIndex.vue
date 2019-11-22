<template>
    <div class="homeIndex">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>图表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <!-- 筛选条件 -->
        <el-card class="box-card">
            <div class="boxCard">
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
                    <!-- 预警级别 -->
                    <div class="items clearfix">
                        <div class="fl condition">预警级别:</div>
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
                <div class="tableBox">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column label="供应商编码" width="150">
                            <template slot-scope="scope">
                                <span style="color:#6595f3">{{scope.row.code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="供应商" width="120"></el-table-column>
                        <el-table-column prop="province" label="省" width="100"></el-table-column>
                        <el-table-column prop="city" label="市" width="100"></el-table-column>
                        <el-table-column prop="score" label="综合得分" width="80"></el-table-column>
                        <el-table-column label="综合预警状态" width="150">
                            <template slot-scope="scope">
                                <span style="color:#435e93" v-show="scope.row.status === '正常'">{{scope.row.status}}</span>
                                <span style="color:#eecf3f" v-show="scope.row.status === '黄色预警'">{{scope.row.status}}</span>
                                <span style="color:#4ea973" v-show="scope.row.status === '优秀'">{{scope.row.status}}</span>
                                <span style="color:#f54e40" v-show="scope.row.status === '红色预警'">{{scope.row.status}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="基本信息">
                            <el-table-column prop="business_address" label="经营地" width="150" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="registered_address" label="注册地" width="150" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="registration_year" label="注册时间" width="120"></el-table-column>
                            <el-table-column prop="company_size" label="公司规模" width="150">
                                <template slot-scope="scope">
                                    <span style="color:#4ea973" v-show="scope.row.company_size === '大'">{{scope.row.company_size}}</span>
                                    <span style="color:#435e93" v-show="scope.row.company_size === '中'">{{scope.row.company_size}}</span>
                                    <span style="color:#eea93f" v-show="scope.row.company_size === '较小'">{{scope.row.company_size}}</span>
                                    <span style="color:#3fcfd5" v-show="scope.row.company_size === '较大'">{{scope.row.company_size}}</span>
                                    <span style="color:#df7b3f" v-show="scope.row.company_size === '小'">{{scope.row.company_size}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="registered_capital" label="公司资本(万)" width="150"></el-table-column>
                            <el-table-column prop="company_type" label="公司性质" width="150"></el-table-column>
                        </el-table-column>
                        <el-table-column label="质量水平">
                            <el-table-column prop="quality.inspection_count" label="抽检次数" width="120"></el-table-column>
                            <el-table-column prop="quality.qualification_count" label="合格次数" width="120"></el-table-column>
                            <el-table-column prop="quality.pass_rate" label="抽检合格率" width="120"></el-table-column>
                            <el-table-column prop="quality.qualification_lot" label="检验批次" width="120"></el-table-column>
                            <el-table-column prop="quality.inspection_lot" label="达标批次" width="120"></el-table-column>
                            <el-table-column prop="quality.quality_score" label="质量水平得分" width="150"></el-table-column>
                            <el-table-column label="质量水平状态" width="150">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.quality.quality_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.quality.quality_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.quality.quality_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.quality.quality_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="行为水平">
                            <el-table-column prop="behavior.bidding_count" label="投标次数" width="120"></el-table-column>
                            <el-table-column prop="behavior.winning_count" label="中标次数" width="120"></el-table-column>
                            <el-table-column prop="behavior.win_rate" label="中标率" width="120"></el-table-column>
                            <el-table-column prop="behavior.bid_amount_level" label="报价水平" width="120"></el-table-column>
                            <el-table-column prop="behavior.risk_control_level" label="风险控制运营能力" width="150"></el-table-column>
                            <el-table-column prop="behavior.delivery_score" label="交货正常否(－代表提前交货)" width="220"></el-table-column>
                            <el-table-column prop="behavior.behavior_score" label="行为水平得分" width="120"></el-table-column>
                            <el-table-column label="行为水平状态" width="150">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.behavior.behavior_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.behavior.behavior_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.behavior.behavior_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.behavior.behavior_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="信用水平">
                            <el-table-column prop="credit.management_capacity" label="运营能力" width="120"></el-table-column>
                            <el-table-column prop="credit.solvency" label="偿债能力" width="120"></el-table-column>
                            <el-table-column prop="credit.profitability" label="盈利能力" width="120"></el-table-column>
                            <el-table-column prop="credit.capital_flow_capability" label="资金流能力" width="120"></el-table-column>
                            <el-table-column prop="credit.credit_score" label="信用水平得分" width="150"></el-table-column>
                            <el-table-column label="信用水平状态" width="150">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.credit.credit_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.credit.credit_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.credit.credit_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.credit.credit_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="服务水平">
                            <el-table-column prop="service.complaint_severity" label="投诉严重级别" width="150"></el-table-column>
                            <el-table-column prop="service.replenishment_ability" label="补货能力" width="120"></el-table-column>
                            <el-table-column prop="service.complaint_response_ability" label="投诉响应能力" width="150"></el-table-column>
                            <el-table-column prop="service.service_score" label="服务水平得分" width="150"></el-table-column>
                            <el-table-column label="服务水平状态" width="150">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.service.service_status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.service.service_status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.service.service_status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.service.service_status === '红色预警'">红色预警</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="合作水平">
                            <el-table-column prop="cooperation.partner_count" label="合作移动伙伴数" width="150"></el-table-column>
                            <el-table-column prop="cooperation.total_contract_amount" label="所有合作移动客户产生合同额" width="210"></el-table-column>
                            <el-table-column prop="cooperation.total_supply" label="所有合作移动客户供货总量" width="210"></el-table-column>
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
</template>
<script>
import {suppliersIndex} from '../../api/api.js'
import provinceData from '../../js/city.json'
import {removeChinese,fieldStr} from '../../js/common.js'
export default {
    name:'homeIndex',
    data(){
        return{
            provinceData:[],//省份数据
            cityData:[],//城市数据
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//性质
            tActive:-1,//时间
            caActive:-1,//资本
            eActive:-1,//级别
            /* 选中的字段 */
            selectP:'',
            selectC:'',
            selectN:'',
            selectTS:'',
            selectTE:'',
            selectCaS:'',
            selectCaE:'',
            selectE:'',
            cityShow:false,
            moreShowP:false,
            moreShowC:false,
            dataN:['集体企业','私有企业','国有企业','合伙企业'],
            dataT:['小于1998','1998-2005','2005-2010','2010-2015','大于2015'],
            dataCa:['小于20','20-200','200-400','400-700','700-1500','大于1500'],
            dataE:['优秀','正常','黄色预警','红色预警'],
            tableData:[],

            pageNum:0,
            pageSize:10,
            total:100
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
            Data = fieldStr(value,index,this.selectCaS,this.selectCaT,this.dataCa)
            this.selectCaS = Data[0]
            this.selectCaT = Data[1]
            this.pageNum = 0
            this.searchData()
            console.log(this.selectCaS,this.selectCaT)
        },
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
                endCapital:this.selectCaT,
                status:this.selectE
            }
            this.getList(params)
        },
        /* 分页 */
        handleSizeChange(val) {
            console.log(val)
            this.pageSize = val
            this.searchData()
        },
        handleCurrentChange(val) {
            console.log(val)
            this.pageNum = val
            this.searchData()
        },
        /* 获取数据 */
        //通用数据
        getList(params){
            suppliersIndex(params).then(res => {
                let Data = []
                this.tableData = res.data.data
                this.total = res.data.count
            }).catch(() => {})
        },
        //列表数据
        getData(){
            let params = {
                limit:this.pageSize,
                offset:this.pageNum
            }
            this.getList(params)
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
        this.provinceData = provinceData
        this.getData()
    }
}
</script>
<style lang="scss" scoped>

</style>

