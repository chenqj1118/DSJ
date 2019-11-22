import axios from 'axios';
export const root = 'http://1.1.7.52:8000';
export const root2 = 'http://1.1.7.52:9000';
import QS from 'qs';
import router from '../router';
import { Loading } from 'element-ui';


//JSON字符串请求头
export const oXHRHeadrs = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
};

// url序列化请求头
export const oXHRHeadrsUrlencoded = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};  

// formData表单请求头
export const oXHRHeadrsFormData = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};

let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    //console.log(needLoadingRequestCount)
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
        needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

/* 请求拦截器 */
axios.interceptors.request.use(
  config => {
        /* let token = localStorage.getItem('user_token');
        if (token) {
            config.headers['X-Auth-Token'] =  `${token}`; 
            //console.log(config);
        }else{
            window.location.pathname = '/'
        } */
         showFullScreenLoading()
        return config;
        //console.log(config);
  },
  err => {
    alter("请求超时")
    return Promise.reject(err);
  }
);

axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

// 响应拦截器
axios.interceptors.response.use((response) => {
    tryHideFullScreenLoading()
    return response
}, (error) => {
    if (error.response) {
        //console.log(error.response.status)
        switch (error.response.status) {
            case 401:
                /* confirm('登录已过期') */
                /* router.replace({
                    path: '/'
                }) */
                /* router.push({path:'/'})
                location.reload() */
            break;
            case 404:
                //console.log("zheshi404")
            break;
            default:
                tryHideFullScreenLoading()
            break;
        }
    }
    console.log(error.response.data)
    return Promise.reject(error.response.data) 
})

/**
 * fetch Get请求
 * @param {String} url 请求地址
 * @param {Obejct} params
 * @return {Promise}
 */
export function FetchGet(url, params = {}, headers) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                url, {
                    params: params
                },
                headers
            )
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
}
/**
 * fetch Post请求
 * @param {String} url 请求地址
 * @param {Obejct} data
 * @return {Promise}
 */
export function FetchPost(url, data = {}, headers, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, data, headers, params)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
}

//供应商画像获取数据
function _getData (url,params){
    return FetchGet(root+url, params, oXHRHeadrs).then((response) => {
        return response;
    })
}

/* 
首页
*/
export const suppliersIndex = params => {
    return _getData('/suppliers/index/',params);
}
/* 
基本水平
 */
export const suppliersList = params => {
    return _getData('/suppliers/',params);
}
/* 
地图数据
*/
export const mapsData = params => {
    return _getData('/charts/map/',params);
}
/* 
质量水平
 */
export const suppliersQuality = params => {
    return _getData('/suppliers/quality/',params);
}

/* 
行为水平
 */
export const suppliersBehavior = params => {
    return _getData('/suppliers/behavior/',params);
}

/* 
信用水平
 */
export const suppliersCredit = params => {
    return _getData('/suppliers/credit/',params);
}

/* 
服务水平
 */
export const suppliersService = params => {
    return _getData('/suppliers/service/',params);
}

/* 
合作水平
 */
export const suppliersCooperation = params => {
    return _getData('/suppliers/cooperation/',params);
}

/* 
综合评价
 */
export const suppliersOverview = params => {
    return _getData('/suppliers/overview/',params);
}

//图表数据
/* 
基础数据
 */
export const chartsBaseAttr = params => {
    return _getData('/charts/base_attr/',params);
}
/* 
基础数据
 */
export const chartsQuality = params => {
    return _getData('/charts/quality/',params);
}
/* 
行为水平
*/
export const chartsBehavior = params => {
    return _getData('/charts/behavior/',params);
}
/* 
信用水平
*/
export const chartsCredit = params => {
    return _getData('/charts/credit/',params);
}
/* 
服务水平
*/
export const chartsService = params => {
    return _getData('/charts/service/',params);
}
/* 
合作水平
*/
export const chartsCooperation = params => {
    return _getData('/charts/cooperation/',params);
}
/* export const login = params => {
    return _getData('/api/login',params);
}
 */


//库存管理获取数据
function _getData2 (url,params){
    return FetchGet(root2+url, params, oXHRHeadrs).then((response) => {
        return response;
    })
}
/*
 overviews 库存概况
 */
export const _getOverviewList = params => {
    return _getData2('/overviews/',params);
}
export const _getOverviewTab2ChartData1 = params => {
    return _getData2('/charts/overviews/depot_compare/',params);
}
export const _getOverviewTab1ChartData1A = params => {
    return _getData2('/charts/overviews/used_quantity/',params);
}
export const _getOverviewTab1ChartData1B = params => {
    return _getData2('/charts/overviews/purchase_amount/',params);
}
export const _getOverviewTab1ChartData2 = params => {
    return _getData2('/charts/overviews/history_proportion/',params);
}
export const _getOverviewTab1ChartData3 = params => {
    return _getData2('/charts/overviews/used_quantity_percent/',params);
}
export const _getOverviewTab1ChartData4= params => {
    return _getData2('/charts/overviews/material_same_percent',params);
}



/*
 项目明细
 */
export const _getDtailsList = params => {
    return _getData2('/details/',params);
}

/*
 forecasts 需求预测
 */
export const _getForecastsList = params => {
    return _getData2('/forecasts/',params);
}
export const _getForecastsChartData = params => {
    return _getData2('/charts/forecasts/a/',params);
}
export const _getForecastsChartData2 = params => {
    return _getData2('/charts/forecasts/b/',params);
}

/*
 safety_stocks 安全库存
 */
export const _getSafetyStocksList = params => {
    return _getData2('/safety_stocks/',params);
}
export const _getSafetyStocksChartData1 = params => {
    return _getData2('/charts/safe_stocks/a/',params);
}
export const _getSafetyStocksChartData2 = params => {
    return _getData2('/charts/safe_stocks/b/',params);
}
export const _getSafetyStocksChartData3 = params => {
    return _getData2('/charts/safe_stocks/c/',params);
}
/*
 stockings 备货量
 */
export const _getStockingsList = params => {
    return _getData2('/stockings/',params);
}
export const _getStockingsChartData1 = params => {
    return _getData2('/charts/stockings/a/',params);
}
export const _getStockingsChartData2 = params => {
    return _getData2('/charts/stockings/b/',params);
}
export const _getStockingsChartData3 = params => {
    return _getData2('/charts/stockings/c/',params);
}
/*
 suppliers 智能选商
 */
export const _getSuppliersList = params => {
    return _getData2('/suppliers/',params);
}