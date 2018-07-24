import moment from 'moment'

//数据格式转换类
export default class DataFormate {
    //将时间戳转成"YYYY-MM-DD hh:mm"的格式
    static dateFomate(time) {
        return moment(time).format('YYYY-MM-DD hh:mm');
    }

    //将当前时间和时间戳的间隔转成"xx天"的格式
    static periodFormate(time) {
        let day = '未知';
        if (time) {
            const current=new Date().getTime();
            const days = parseInt(current / 1000 / 3600,10)-parseInt(time / 1000 / 3600,10);
            if (parseInt(days / 24 / 365,10) >= 1) {
                day = parseInt(days / 24 / 365,10) + "年"
            } else if (days / 24  > 30) {
                day = parseInt(days / 24 / 30,10) + "个月"
            } else if (days /24 >= 7) {
                day = parseInt(days/24 / 7,10) + "周"
            } else if (days /24 >= 1) {
                day = parseInt(days /24,10) + "天"
            } else {
                day = days + "小时"
            }
        }
        return day;
    }
}