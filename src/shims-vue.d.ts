/* eslint-disable */
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.png'
declare module '*.js'
declare module '*.key'

interface Number {
    asDecimal(precision?: number): number
}
interface String {
    asDateTime(format?: string): string

    asDate(format?: string): string

    asTime(format?: string): string

    toNumeric(): number

    toMoment(): moment.Moment
}
