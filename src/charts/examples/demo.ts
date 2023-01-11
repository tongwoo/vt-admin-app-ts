import {EChartsOption} from "echarts";

/**
 * 基础折线图
 */
export function buildBaseLineOption(): EChartsOption {
    return {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '基本折线图',
            top: 10,
            textStyle: {
                fontSize: 14
            }
        },
        grid: {
            top: 50,
            right: 30,
            bottom: 30,
            left: 70
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '今年',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            },
            {
                name: '明年',
                data: [420, 532, 501, 534, 790, 830, 720],
                type: 'line',
            },
        ]
    }
}

/**
 * 基础柱形图
 */
export function buildBaseBarOption(): EChartsOption {
    return {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '基础柱形图',
            top: 10,
            textStyle: {
                fontSize: 14
            }
        },
        grid: {
            top: 50,
            right: 30,
            bottom: 30,
            left: 70
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '今年',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'bar',
            },
            {
                name: '去年',
                data: [420, 532, 501, 534, 790, 830, 720],
                type: 'bar',
            }
        ]
    }
}

/**
 * 基础饼图
 */
export function buildBasePieOption(): EChartsOption {
    return {
        tooltip: {
            trigger: 'item',
            formatter: '<strong>{b}</strong>: {c} 占比: {d}%',
        },
        title: {
            left: 'center',
            text: '基础饼图',
            top: 10,
            textStyle: {
                fontSize: 14
            }
        },
        series: [
            {
                name: '生产值',
                type: 'pie',
                data: [
                    {
                        name: '第1季度',
                        value: 365,
                    },
                    {
                        name: '第2季度',
                        value: 295,
                    },
                    {
                        name: '第3季度',
                        value: 483,
                    },
                    {
                        name: '第4季度',
                        value: 586,
                    },
                ],
                radius: [
                    '40%',
                    '60%',
                ],
                center: [
                    '50%',
                    '50%',
                ],
                label: {
                    show: true,
                    position: 'outside',
                },
                labelLine: {
                    show: true,
                    length: 6,
                    length2: 13,
                },
                itemStyle: {
                    borderRadius: 0,
                },
            },
        ],
    }
}

/**
 * 雷达图
 */
export function buildBaseRadarOption(): EChartsOption {
    return {
        title: {
            text: '基础雷达图',
            top: 10,
            left: 10,
            textStyle: {
                fontSize: 14
            }
        },
        radar: {
            indicator: [
                {name: '攻击', max: 100},
                {name: '魔法', max: 100},
                {name: '道术', max: 100},
                {name: '防御', max: 100},
                {name: '魔防', max: 100},
                {name: '道防', max: 100}
            ]
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                    {
                        value: [69, 56, 88, 46, 89, 45],
                        name: 'Allocated Budget'
                    },
                ]
            }
        ]
    }
}

/**
 * 散点图
 */
export function buildBaseScatterOption() {
    return {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '基础散点图',
            top: 10,
            textStyle: {
                fontSize: 14
            }
        },
        grid: {
            top: 50,
            right: 30,
            bottom: 30,
            left: 40
        },
        xAxis: {},
        yAxis: {},
        series: [
            {
                type: 'scatter',
                symbolSize: 10,
                data: [
                    [10.0, 8.04],
                    [8.07, 6.95],
                    [13.0, 7.58],
                    [9.05, 8.81],
                    [11.0, 8.33],
                    [14.0, 7.66],
                    [13.4, 6.81],
                    [10.0, 6.33],
                    [14.0, 8.96],
                    [12.5, 6.82],
                    [9.15, 7.2],
                    [11.5, 7.2],
                    [3.03, 4.23],
                    [12.2, 7.83],
                    [2.02, 4.47],
                    [1.05, 3.33],
                    [4.05, 4.96],
                    [6.03, 7.24],
                    [12.0, 6.26],
                    [12.0, 8.84],
                    [7.08, 5.82],
                    [5.02, 5.68]
                ],
            },
        ]
    }
}
