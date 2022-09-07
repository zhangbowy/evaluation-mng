import { IChartList } from "@/page/evaluation/management/type";
import { observable, action } from "mobx";

const EvalDetail = observable({
    evalDetailInfo: <IChartList>{},// 图表数据
    departmentId: -1,// 部门id
    measurementObj: <IMeasurement>{},// 测评信息
    // 设置图表数据
    setEvalDetailInfo<T extends IChartList>(evalDetailInfo: T) {
        this.evalDetailInfo = evalDetailInfo;
    },
    getEvalDetailInfo() {
        return this.evalDetailInfo
    },
    // 设置部门id
    setDepartmentId(id: number) {
        this.departmentId = id;
    },
    // 设置测评信息
    setMeasurement(measurement: IMeasurement) {
        this.measurementObj = measurement;
    }
}, {
    setEvalDetailInfo: action,
    getEvalDetailInfo: action,
    setDepartmentId: action,
    setMeasurement: action
})

export default EvalDetail;