import Axios, { AxiosRequestConfig, AxiosInstance, Canceler, AxiosResponse } from 'axios'
import { CanNotBeEmptyTemplate, OverrideTemplate } from './error-template'
import { addQuery, replace } from './utils/path'
const { CancelToken } = Axios

interface IConfig {
    /** 是否需要创建新的实例 */
    newIns?: boolean
    /** 创建新实例的配置 */
    insConfig?: AxiosRequestConfig
}

export class ZAxios {
    private axiosIns: AxiosInstance
    private url: string
    private queryObj: {}
    private pathObj: {}
    private body: {}
    private config: AxiosRequestConfig
    private cancel: Canceler

    constructor({ newIns = false, insConfig }: IConfig = {}) {
        if (newIns) {
            this.axiosIns = Axios.create(insConfig)
        } else {
            this.axiosIns = Axios
        }
    }

    /**
     * 设置url
     *
     * @param url 请求url
     */
    setUrl(url: string) {
        if (!url) {
            throw new Error(CanNotBeEmptyTemplate('url'))
        }

        if (this.url) {
            console.warn(OverrideTemplate('url', this.url, url))
        }

        this.url = url

        return this
    }

    /**
     * 设置查询参数
     *
     * @param queryObj 请求参数
     */
    setQueryObj(queryObj: {}) {
        if (!queryObj) {
            throw new Error(CanNotBeEmptyTemplate('query obj'))
        }

        if (this.queryObj) {
            console.warn(OverrideTemplate('queryObj', this.queryObj, queryObj))
        }
        this.queryObj = queryObj

        return this
    }

    /**
     * 设置路径参数
     *
     * @param pathObj 路径参数
     */
    setPathObj(pathObj: {}) {
        if (!pathObj) {
            throw new Error(CanNotBeEmptyTemplate('path obj'))
        }

        if (this.pathObj) {
            console.warn(OverrideTemplate('pathObj', this.pathObj, pathObj))
        }

        this.pathObj = pathObj

        return this
    }

    /**
     * 设置请求体
     * @param body 请求体
     */
    setBody(body: {}) {
        if (!body) {
            throw new Error(CanNotBeEmptyTemplate('body'))
        }

        if (this.body) {
            console.warn(OverrideTemplate('body', this.body, body))
        }

        this.body = body

        return this
    }

    /**
     * 设置axios
     * @param config axios config
     */
    setConfig(config: AxiosRequestConfig) {
        if (config) {
            throw new Error(CanNotBeEmptyTemplate('config'))
        }

        if (this.config) {
            console.warn(OverrideTemplate('config', this.config, config))
        }

        this.config = config

        return this
    }

    get<T = any>() {
        return this.sendRequest<T>({
            method: 'get',
        })
    }

    post<T = any>() {
        return this.sendRequest<T>({
            method: 'post',
            data: this.body,
        })
    }

    delete<T = any>() {
        return this.sendRequest<T>({
            method: 'delete',
        })
    }

    patch<T = any>() {
        return this.sendRequest<T>({
            method: 'patch',
        })
    }

    cancelRequest() {
        if (!this.cancel) {
            console.warn(`there is no request`)
        }

        this.cancel()
        this.clearConfig()
    }

    addReqInterceptor(
        onSuccess: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
        onError: (error: any) => any
    ) {
        return this.axiosIns.interceptors.request.use(onSuccess, onError)
    }

    addResInterceptor(
        onSuccess: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
        onError: (error: any) => any
    ) {
        return this.axiosIns.interceptors.response.use(onSuccess, onError)
    }

    ejectReqInterceptor(id: number) {
        this.axiosIns.interceptors.request.eject(id)
    }

    ejectResInterceptor(id: number) {
        this.axiosIns.interceptors.response.eject(id)
    }

    private async sendRequest<T>(config: AxiosRequestConfig) {
        const reqConfig = this.buildReqConfig()

        try {
            const res = await this.axiosIns.request<T>({
                ...config,
                ...reqConfig,
            })
            return res.data
        } finally {
            this.clearConfig()
        }
    }

    private buildReqConfig() {
        const url = this.buildPath()
        let reqConfig: AxiosRequestConfig = {
            url,
            cancelToken: new CancelToken((cancel) => (this.cancel = cancel)),
        }
        if (this.config) {
            reqConfig = {
                ...this.config,
                ...reqConfig,
            }
        }

        return reqConfig
    }

    /**
     * 生成请求url
     */
    private buildPath() {
        if (!this.url) {
            throw new Error(`can not send request before set url!`)
        }

        let url = this.url

        // 替换路径参数
        this.pathObj && (url = replace(url, this.pathObj))
        // 添加查询参数
        this.queryObj && (url = addQuery(url, this.queryObj))

        // 清空状态
        this.clearPath()

        return url
    }

    private clearPath() {
        this.url = null
        this.queryObj = null
        this.pathObj = null
    }

    private clearConfig() {
        this.config = null
        this.body = null
        this.cancel = null
    }
}
