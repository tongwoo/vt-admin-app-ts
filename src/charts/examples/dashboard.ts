import {EChartsOption} from "echarts";

export function buildSeasonLineOption(): EChartsOption {
    return {
        background: "transparent",
        title: {
            show: false,
            text: "标题",
            left: "auto",
            top: "auto",
            textStyle: {
                color: "#333",
                fontSize: 18
            }
        },
        tooltip: {
            show: true,
            appendToBody: true,
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
        },
        legend: {
            show: false,
            left: "center",
            top: "auto",
            itemWidth: 25,
            itemHeight: 14,
            textStyle: {
                color: "#000000"
            }
        },
        textStyle: {
            fontFamily: "微软雅黑",
            fontSize: 12
        },
        grid: {
            show: false,
            top: 10,
            right: 30,
            bottom: 10,
            left: 20,
            borderColor: "#ccc",
            borderWidth: 1,
            containLabel: true
        },
        xAxis: {
            show: true,
            type: "category",
            data: [
                "第一季度",
                "第二季度",
                "第三季度",
                "第四季度"
            ],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            boundaryGap: false,
            axisLine: {
                show: false,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: false,
                length: 5,
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: true,
                showMaxLabel: true,
                color: "#90969A",
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#EEEEEE",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        yAxis: {
            show: true,
            type: "value",
            data: [],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            axisLine: {
                show: false,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: false,
                length: 5,
                lineStyle: {
                    color: "#D2D2D2",
                    width: 0,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: false,
                showMaxLabel: false,
                color: "#8E8E8E",
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#EEEEEE",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        series: [
            {
                name: "交易量",
                data: [
                    437,
                    438,
                    593,
                    328
                ],
                type: "line",
                smooth: false,
                symbol: "emptyCircle",
                symbolSize: 4,
                showSymbol: false,
                lineStyle: {
                    color: "#FF5667",
                    width: 2,
                    type: "solid",
                },
                areaStyle: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        "x2": 0,
                        "y2": 1,
                        colorStops: [
                            {
                                offset: 0.44,
                                color: "#FF5667FF"
                            },
                            {
                                offset: 0.85,
                                color: "#FF566700"
                            }
                        ]
                    },
                    opacity: 0.11
                }
            }
        ]
    }
}


export function buildUserLineOption(): EChartsOption {
    return {
        background: "transparent",
        title: {
            show: false,
            text: "标题",
            left: "auto",
            top: "auto",
            textStyle: {
                color: "#333",
                fontSize: 18
            }
        },
        tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
        },
        legend: {
            show: false,
            left: "center",
            top: "auto",
            itemWidth: 25,
            itemHeight: 14,
            textStyle: {
                color: "#000000"
            }
        },
        textStyle: {
            fontFamily: "微软雅黑",
            fontSize: 12
        },
        grid: {
            show: false,
            top: 10,
            right: 21,
            bottom: 10,
            left: 10,
            borderColor: "#ccc",
            borderWidth: 1,
            containLabel: true
        },
        xAxis: {
            show: true,
            type: "category",
            data: [
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
                "周日"
            ],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            boundaryGap: false,
            axisLine: {
                show: false,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: false,
                length: 5,
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: true,
                showMaxLabel: true,
                color: "#90969A",
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#EEEEEE",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        yAxis: {
            show: true,
            type: "value",
            data: [],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            axisLine: {
                show: false,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: false,
                length: 5,
                lineStyle: {
                    color: "#D2D2D2",
                    width: 0,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: false,
                showMaxLabel: false,
                color: "#8E8E8E",
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#EEEEEE",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        series: [
            {
                name: "交易量",
                data: [
                    437,
                    438,
                    593,
                    328,
                    487,
                    902,
                    408
                ],
                type: "line",
                smooth: false,
                symbol: "emptyCircle",
                symbolSize: 4,
                showSymbol: false,
                areaStyle: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        "x2": 0,
                        "y2": 1,
                        colorStops: [
                            {
                                offset: 0.44,
                                color: "#56B3FFFF"
                            },
                            {
                                offset: 0.85,
                                color: "#56B3FF00"
                            }
                        ]
                    },
                    opacity: 0.11
                }
            }
        ]
    }
}


export function buildUserWherePieOption(): EChartsOption {
    return {
        background: "transparent",
        title: {
            show: false,
            text: "标题",
            left: "auto",
            top: "auto",
            textStyle: {
                color: "#333",
                fontSize: 18
            }
        },
        tooltip: {
            show: true,
            trigger: "item",
            axisPointer: {
                type: "shadow"
            },
        },
        legend: {
            show: false,
            left: "center",
            top: "auto",
            itemWidth: 25,
            itemHeight: 14,
            textStyle: {
                color: "#000000"
            }
        },
        textStyle: {
            fontFamily: "微软雅黑",
            fontSize: 12
        },
        grid: {
            show: false,
            top: 60,
            right: 10,
            bottom: 10,
            left: 10,
            borderColor: "#ccc",
            borderWidth: 1,
            containLabel: true
        },
        xAxis: {
            show: false,
            type: "category",
            data: [
                "江苏",
                "浙江",
                "上海",
                "北京",
                "安徽",
                "山东",
                "河南"
            ],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            boundaryGap: true,
            axisLine: {
                show: true,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: true,
                length: 5,
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: true,
                showMaxLabel: true,
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#ccc",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        yAxis: {
            show: false,
            type: "value",
            data: [],
            nameLocation: "end",
            nameTextStyle: {
                fontSize: 12
            },
            axisLine: {
                show: true,
                symbol: "none",
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisTick: {
                show: true,
                length: 5,
                lineStyle: {
                    color: "#333",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            },
            axisLabel: {
                show: true,
                rotate: 0,
                showMinLabel: false,
                showMaxLabel: false,
                fontSize: 12
            },
            splitLine: {
                show: true,
                interval: "auto",
                lineStyle: {
                    color: "#ccc",
                    width: 1,
                    type: "solid",
                    opacity: 1
                }
            }
        },
        series: [
            {
                name: "分布",
                data: [
                    {
                        name: "江苏",
                        value: 736
                    },
                    {
                        name: "浙江",
                        value: 627
                    },
                    {
                        name: "上海",
                        value: 109
                    },
                    {
                        name: "北京",
                        value: 444
                    },
                    {
                        name: "安徽",
                        value: 644
                    },
                    {
                        name: "山东",
                        value: 550
                    },
                    {
                        name: "河南",
                        value: 564
                    }
                ],
                type: "pie",
                roseType: "radius",
                center: [
                    "50%",
                    "50%"
                ],
                radius: [
                    "39%",
                    "74%"
                ],
                label: {
                    show: true,
                    position: "outside",
                    formatter: "{b}：{d}%",
                    fontSize: 12
                },
                labelLine: {
                    show: true,
                    length: 10,
                    "length2": 10,
                    smooth: false
                },
            }
        ]
    }
}
