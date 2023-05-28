/* eslint-disable */
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.png'
declare module '*.js'


interface Number {
    toDecimal(precision?: number): number
}

interface String{
    asDateTime(format?: string): string
    asDate(format?: string): string
    asTime(format?: string): string
}
