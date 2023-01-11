//手机号码
export const PATTERN_MOBILE_NUMBER = /^1[3456789]\d{9}$/

//电子邮件地址
export const PATTERN_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

//身份证号码
export const PATTERN_ID_NUMBER = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/

//是否包含中文
export const PATTERN_CHINESE_INCLUDE = /[\u0391-\uFFE5]+/

//是否全部中文
export const PATTERN_CHINESE = /^[\u0391-\uFFE5]+$/
