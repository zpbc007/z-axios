import { addQuery, replace } from '../../src/utils/path'

describe('test path utils', () => {
    it('should fill url path with pathObj', () => {
        const baseUrl = `/api/{a}/{b}/{c}`
        const pathObj = {
            a: 1,
            b: 2,
            c: 3,
        }

        const url = replace(baseUrl, pathObj)
        expect(url).toEqual('/api/1/2/3')
    })

    it('should add query params to url', () => {
        const baseUrl = '/api'
        const queryObj = {
            a: 1,
            b: 2,
            c: 3,
        }

        const url = addQuery(baseUrl, queryObj)
        expect(url).toEqual('/api?a=1&b=2&c=3')
    })

    it('should use url query params by default', () => {
        const baseUrl = '/api?a=1'
        const queryObj = {
            a: 4,
            b: 2,
            c: 3,
        }

        const url = addQuery(baseUrl, queryObj)
        expect(url).toEqual('/api?a=1&b=2&c=3')
    })

    it('should override url query params by queryObj', () => {
        const baseUrl = '/api?a=1'
        const queryObj = {
            a: 4,
            b: 2,
            c: 3,
        }

        const url = addQuery(baseUrl, queryObj, true)
        expect(url).toEqual('/api?a=4&b=2&c=3')
    })
})
