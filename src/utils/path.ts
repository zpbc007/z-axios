import * as UrlUtil from 'url'

/**
 * 替换路径参数
 * @param url 请求路径
 * @param pathObj 路径参数对象
 */
export function replace(url: string, pathObj: { [key: string]: string | number }) {
    const regex = /\{([^{^}]*)\}/g
    return url.replace(regex, (_, $1) => {
        const variable = pathObj[$1]
        return variable as string
    })
}

/**
 * 添加查询字符串 传入的query必须经过encode
 * @param  url 请求路径
 * @param  queryObj 请求参数
 * @param override 是否覆盖路径中存在的query
 */
export function addQuery(
    url: string,
    queryObj: { [key: string]: string | number },
    override = false
) {
    const urlObject = UrlUtil.parse(url, true)
    const encodeQuery: any = {}

    // encode query
    for (const key in urlObject.query) {
        if (Object.hasOwnProperty.call(urlObject.query, key)) {
            encodeQuery[key] = encodeURIComponent(urlObject.query[key] as string)
        }
    }

    queryObj = override ? { ...encodeQuery, ...queryObj } : { ...queryObj, ...encodeQuery }

    return `${urlObject.pathname}?${Object.keys(queryObj)
        .map((queryKey) => {
            const queryVal = queryObj[queryKey]
            // 过滤
            if (queryVal === null || queryVal === undefined) {
                return null
            }
            return `${queryKey}=${queryVal}`
        })
        .filter((item) => item)
        .join('&')}`
}
