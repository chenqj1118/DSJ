/* 过滤汉字 */
function removeChinese(strValue){
    if(strValue!= null && strValue != ""){  
        var reg = /[\u4e00-\u9fa5]/g;   
        return strValue.replace(reg, "");   
    }  
}
/* 字段截取 */
function fieldStr(value,index,start,end,data){
    if(index != -1){
        if(index == 0 ){
            end = parseInt(removeChinese(value))
            start = ''
        }else if(index == data.length-1 ){
            start = parseInt(removeChinese(value))
            end = ''
        }else{
            let newData = []
            newData = (value || '').split('-');
            start = parseInt(newData[0])
            end = parseInt(newData[1])
        }
        console.log("开始:"+start,'结束:'+end)
    }else{
        end = ''
        start = ''
    }
    let Data = []
    Data.push(start)
    Data.push(end)
    return Data
}

//获取最近的n个年份,比如 getYear(3); 则输出[2017,2018,2019]
export const getYearArr = (n) => {
    let yearArr = [];
    let curYear = new Date().getFullYear();
    let m = n-1;
    for(let i=0;i<n;i++){
        yearArr[i]=curYear-(m--);
    }
    return yearArr;
}

//获取仓库城市
export const getDepotCityArr = () => {
    return ['宁波','温州','金华','绍兴','杭州'];
}

//获取常备物料
export const getMaterialArr =() => {
    return ['光缆','馈线连接器','光纤配线架','硅芯管','ICT集成服务','IP专用交换机','IT零星配件','LCD一体机','MSAP多业务接入平台','NAT IP地址转换设备','RADIUS','SDH微波'];
}
//项目集
export const getProjectArr =() => {
    return ['传输网-专项优化','传送网维修费','传送网-网络优化','用户接入费','综合接入-专项优化','代办业务利润','4G-建设项目','4G容量保障-覆盖延伸项目','5规模试验传输网','FDD覆盖专项','城镇线路迁改'];
}

//获取1月~12月，不带“月”字
export const getMonthArr =() =>{
    let monthArr = [];
    for(let i=0;i<12;i++){
        monthArr[i]=i+1;
    }
    return monthArr;
}



export {removeChinese,fieldStr}