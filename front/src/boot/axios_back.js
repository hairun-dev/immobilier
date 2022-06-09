import axios from 'axios'
import { util } from 'src/boot/util'
import { boot } from 'quasar/wrappers'
import { set } from 'lodash'
import { LocalStorage } from 'quasar'

const myInstance = axios.create({
  baseURL: process.env.API_BASE_URL
})
const FORM_DATA = 'multipart/form-data'
const FORM_URLENCODED = 'application/x-www-form-urlencoded'
const injectAuthToken = (options, authNeeded = 'jwt') => {
  if (authNeeded) {
    set(options, ['headers', 'Authorization'], `Bearer ${LocalStorage.getItem(authNeeded)}`)
  }
  return options
}
const jsonToFormDataConverter = (json) => {
  const formData = new FormData()
  for (const key in json) {
    formData.append(key, json[key])
  }
  return formData
}
const convertDataToParams = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    params.append(key, data[key])
  }
  return params
}
/**
 * Convert a data to a form param
 * @param multipart Indicate if a request is a multipart.
 * @param data The data object to convert
 * @return The form data as a FormData object or a form string data.
 */
const convertData = (data, multipart) => {
  if (multipart === FORM_URLENCODED) {
    return convertDataToParams(data)
  }
  return jsonToFormDataConverter(data)
}
const injectData = (options, data, json = null) => {
  if (options.options) {
    if (!options.headers) options.headers = {}
    for (const key in options.options) {
      if (Object.hasOwnProperty.call(options.options, key)) {
        const el = options.options[key]
        options.headers[key] = el
      }
    }
    delete options.options
  }
  if (data) {
    options.data = data
    if (json != null) {
      options.data = convertData(data, json)
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Content-Type'] = json
    }
  }
  return options
}
const buildRequestOptions = (method, url, data = null, authNeeded = 'jwt', json = false, contentType = FORM_DATA, opt) => {
  const options = {
    method,
    url
  }
  const content = json ? null : contentType
  injectAuthToken(options, authNeeded)
  if (opt) {
    options.options = opt
  }
  injectData(options, data, content)
  return options
}
const createAxiosResponseInterceptor = () => {
  // eslint-disable-next-line
  const interceptor = myInstance.interceptors.response.use(
    (response) => {
      return response.data
    }, async (error) => {
      const status = error.response.data.data.status
      const data = error.response.data.message
      console.log('error', error.response.data.data.status)
      switch (status) {
        case 400:
          if (typeof data === 'string') {
            util.showError(data)
          } else {
            for (const key in data) {
              switch (key) {
                case 'user_code':
                  break
                default:
                  util.showError(`${data[key]}`)
              }
            }
          }
          return Promise.reject(error.response.data)
        case 403:
          util.showMessage(data)
          // util.showMessage('Vous n\'êtes pas autorisé, veuillez contacter l\'admin')
          return Promise.reject(error.response.data)
        default:
          return Promise.reject(error.response.data)
      }
    }
  )
}
createAxiosResponseInterceptor()

export const axiosWrapper = {
  get: (url, authNeeded = 'jwt', options = null) => {
    return myInstance.request(buildRequestOptions('GET', url, null, authNeeded, false, FORM_URLENCODED, options))
  },
  post: (url, data, authNeeded = 'jwt', json = false, options = null) => {
    return myInstance.request(buildRequestOptions('POST', url, data, authNeeded, json, FORM_URLENCODED, options))
  },
  put: (url, data, authNeeded = 'jwt', json = false) => {
    return myInstance.request(buildRequestOptions('PUT', url, data, authNeeded, json, FORM_URLENCODED))
  },
  delete: (url, authNeeded = 'jwt') => {
    return myInstance.request(buildRequestOptions('DELETE', url, null, authNeeded))
  }
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through axios and api

  app.config.globalProperties.$back = axiosWrapper
})
