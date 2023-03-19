import {NameValue} from "@/types/built-in"

/*
 * 季节
 */
export enum Season {
    /**
     * 春
     */
    Spring = 'spring',

    /**
     * 夏
     */
    Summer = 'summer',

    /**
     * 秋
     */
    Autumn = 'autumn',

    /**
     * 冬
     */
    Winter = 'winter'
}

/**
 * 获取季节列表
 */
export function getSeasons(): NameValue<Season>[] {
    return [
        {
            name: '春',
            value: Season.Spring
        },
        {
            name: '夏',
            value: Season.Summer
        },
        {
            name: '秋',
            value: Season.Autumn
        },
        {
            name: '冬',
            value: Season.Winter
        },
    ];
}

/**
 * 获取季节名称
 * @param value 要获得名称的值
 */
export function getSeasonName(value: any): string | null {
    return getSeasons().find( item => item.value === value )?.name ?? null;
}

/**
 * 获取季节使用的样式
 * @param value 值
 */
export function getSeasonClass(value: any):  string | null {
    if ( value === Season.Spring ){
        return 'season-spring';
    } else if ( value === Season.Summer ){
        return 'season-summer';
    } else if ( value === Season.Autumn ){
        return 'season-autumn';
    } else if ( value === Season.Winter ){
        return 'season-winter';
    } else {
        return null;
    }
}