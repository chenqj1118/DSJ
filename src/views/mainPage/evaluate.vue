<template>
    <div class="evaluate">
        <!-- 面包屑 -->
        <div class="contentTopBox clearfix">
            <div class="breadcrumb fl">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>综合评价水平</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <!-- 切换为数据表格 -->
        <div class="blockTable">
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
                        <!-- 预警 -->
                        <div class="items clearfix">
                            <div class="fl condition">预警:</div>
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
                            <el-table-column prop="quality_score" label="质量信息得分"></el-table-column>
                            <el-table-column prop="behavior_score" label="行为信息得分"></el-table-column>
                            <el-table-column prop="credit_score" label="信用信息得分"></el-table-column>
                            <el-table-column prop="service_score" label="服务综合得分"></el-table-column>
                            <el-table-column prop="score" label="画像综合得分"></el-table-column>
                            <el-table-column label="综合预警状态">
                                <template slot-scope="scope">
                                    <span style="color:#435e93" v-show="scope.row.status === '正常'">正常</span>
                                    <span style="color:#eecf3f" v-show="scope.row.status === '黄色预警'">黄色预警</span>
                                    <span style="color:#4ea973" v-show="scope.row.status === '优秀'">优秀</span>
                                    <span style="color:#f54e40" v-show="scope.row.status === '红色预警'">红色预警</span>
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
    </div>
</template>
<script>
var echarts = require('echarts')
var CTAData = require('../../js/city.json')
import {suppliersOverview} from '../../api/api.js'
export default {
    name:'evaluate',
    data(){
        return{
            /* 筛选选中的状态 */
            pActive:-1,//省份
            cActive:-1,//城市
            nActive:-1,//预警
            /* 选中的字段 */
            selectP:'',
            selectC:'',
            selectN:'',
            provinceData:[],//省份数据
            cityData:[],//城市数据
            cityShow:false,
            moreShowP:false,
            moreShowC:false,
            dataN:['红色预警','黄色预警','正常','优秀'],
            tableData:[],

            pageNum:1,
            pageSize:10,
            total:100,
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
            suppliersOverview(params).then(res => {
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
                status:this.selectN
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
        /* 页面固定宽度 */
        widthCof(){
            $('.boxCard').css({"width":$(window).width()-310+'px'});
        }
        
    },
    mounted(){
        this.widthCof()
    },
    created(){
        this.provinceData = CTAData
        this.getData()
    },
}
</script>
<style lang="scss" scoped>

</style>

