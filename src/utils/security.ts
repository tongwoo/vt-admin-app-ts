import aes from 'crypto-js/aes.js'

/**
 * 创建一个指定长度的随机key(A-Z)
 * @param length key的长度
 */
export function randomKey(length: number = 32): string {
    const asciis = []
    for (let i = 0; i < length; i++) {
        asciis.push(Math.round(Math.random() * (90 - 65)) + 65)
    }
    return String.fromCharCode(...asciis)
}

/**
 * 编码数据
 * @param data 要编码的数据
 */
export function encodeData(data: string) {
    const key = randomKey()
    return {
        key: key,
        content: aes.encrypt(data, key).toString()
    }
}

/**
 * 要解码的数据
 * @param key 密钥
 * @param data 要解码的数据
 */
export function decodeData(key: string, data: any) {
    return aes.decrypt(data, key).toString()
}
