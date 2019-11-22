<template>
    <div class="detailsPage" :class="{chartPage:blockShow === 1}">
        <!-- 面包屑 -->
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/depotManage/overviews' }">库存概况-表格</el-breadcrumb-item>
                <el-breadcrumb-item>项目明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="contentRightInner">

            <div class="blockTable">
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
                    <!-- 项目集 -->
                    <div class="items clearfix">
                        <div class="fl condition">项目集:</div>
                        <div class="fl classify project" :class="{moreShow:moreShowProject}">
                            <div>
                                <span @click="clickProjectItem(-1)"  :class="{c_active:projectActive == -1}">全部</span>
                            </div>
                            <div v-for="(item,index) in projectArr" :key="index">
                                <span @click="clickProjectItem(index,item)"  :class="{c_active:projectActive == index}">{{item}}</span>
                            </div>
                            <a class="more" @click="clickMoreProject">更多...</a>
                        </div>
                    </div>
                </div>
                <!-- 表格数据 -->
                <div class="tableBox ordinaryTable">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="project.set_name" label="项目集" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="project.code" label="项目编号" class-name ="Cblue"></el-table-column>
                        <el-table-column prop="project.name" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="project.start_date" label="项目开始时间"></el-table-column>
                        <el-table-column  prop="project.amount"label="项目金额(元)" class-name ="Cyellow"></el-table-column>
                        <el-table-column prop="depot.name" label="仓库"></el-table-column>
                        <el-table-column prop="material.code" label="物料编号"></el-table-column>
                        <el-table-column prop="material.name" label="物料名称"></el-table-column>
                        <el-table-column prop="material_created" label="物料提交时间"></el-table-column>
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
            <!-- 切换按钮 -->
            <div class="basiciTableBtn">
                <router-link to="/depotManage/overviews"><span>返回</span></router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import {_getOverviewList,_getDtailsList} from '../../../api/api.js';
    import {getYearArr,getMonthArr,getDepotCityArr,getMaterialArr,getProjectArr} from '../../../js/common.js';
    export default {
        name:'overviews',
        data(){
            return{
                blockShow: parseInt(localStorage.getItem('blockState'))||0,//单页面控制表格和图标的显示与隐藏 0:表格 1:图表
                depotCityArr:[],
                yearArr:[],
                monthArr:[],
                materialArr:[],
                projectArr:[],
                tableData:[],//表格数据

                pageNum:1,
                pageSize:10,
                total:100,

                depot:'',
                year:'',
                month:'',
                material:'',
                project:'',
                search:'',
                ordering:'',
                /* 筛选默认'全选'*/
                depotActive:'-1',
                yearActive:'-1',
                monthActive:'-1',
                materialActive:'-1',
                projectActive:'-1',

                moreShowMaterial:false,
                moreShowProject:false
            }
        },
        methods:{
            /* 获取数据 */
            //通用数据
            getList(params){
                _getDtailsList(params).then(res => {
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
                    set_name:this.project,
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
                this.projectArr = getProjectArr();
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
            /* 选择项目集 */
            clickProjectItem(index,value){
                this.projectActive = index;
                if(index != -1){
                    this.project = value
                }else{
                    this.project = ''
                }
                this.getData();
            },
            clickMoreMaterial(){
                this.moreShowMaterial = !this.moreShowMaterial
            },
            clickMoreProject(){
                this.moreShowProject = !this.moreShowProject
            },
        },
        mounted(){
        },
        created(){
            this.getFilterData();//获取筛选用到的枚举数据
            this.getData();//获取结果数据用于渲染table
        }
    }
</script>