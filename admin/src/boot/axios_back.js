import axios from 'axios'
import { util } from 'src/boot/util'
import { boot } from 'quasar/wrappers'
// import { set } from 'lodash'
// import { LocalStorage } from 'quasar'

const myInstance = axios.create({
  baseURL: process.env.API_BASE_URL
})
myInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const FORM_DATA = 'multipart/form-data'
const FORM_URLENCODED = 'application/x-www-form-urlencoded'
const injectAuthToken = (options, authNeeded = 'jwt') => {
  if (authNeeded) {
    // set(options, ['headers', 'X-XSRF-TOKEN'], LocalStorage.getItem('csrf').replace('=', '%3D'))
    // set(options, ['headers', 'X-XSRF-TOKEN'], 'eyJpdiI6Ik8zRWViNU1kZG12V1FsQXJaRUZDTFE9PSIsInZhbHVlIjoiQTRSQUtlaUJDa0ZRNnZvUUl4SmsyN25JbnBNTDlpWjVrbURuZ0pQbUsxMUFncWlUSWdzcVNSY21hWU82ZlZMd0pnRUtQdmgzTGE1VEFQY21OTHcyRys2TFI3UkMxUHcxR1kzU1JORTluMFJ4MU43SUxpcmpSTmM4aHNSR1NhcWMiLCJtYWMiOiI5MWFmNWFiYjA4MGEwYzAxZmY5MDJjMTVlZGVlY2YwOTQ2YjNhMjZkNWU1YzYyYzRiODVjZGFhMjVjMmQwMDM1IiwidGFnIjoiIn0%3D; Path=/; Expires=Tue, 14 Jun 2022 06:58:56 GMT;')
  }
  return options
}
const jsonToFormDataConverter = (json) => {
  const formData = new FormData()
  for (const key in json) {
    if (json[key] instanceof Array) {
      for (let i = 0; i < json[key].length; i++) {
        formData.append(key, json[key][i])
      }
    } else {
      formData.append(key, json[key])
    }
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
      // options.headers['XSRF-TOKEN'] = 'eyJpdiI6IjVYcWpKZlo1d3A1R3NZWElKUTRYUkE9PSIsInZhbHVlIjoiT3FkQm5laG56bkFUMEwxNzJMa3VIVnFCZ0J1TFBiUDJReFdvQlB1ZjJBL0g1UEpQdUNUK083LzdZaDR1M0E3azBHV0tsay81VVYreGdWS1BZN3U4SzNKUEZZbW1QNUk4OTF5RzRYK2pPenRSa2ZoVW9za2pTa3ZVUFVtbk02QXQiLCJtYWMiOiI5Njc5MGI3ZWEyMzNjMmEyNzQ1ZDU0Y2FiZGZhNGMxOWQ3YmRjODQ3NTk4M2FmYjY5MmMwZDc4ZmE5OTBiNzU4IiwidGFnIjoiIn0%3D'
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
      console.log('error message', error)
      util.showError(error.response.data.message)
      return Promise.reject(error)
    }
  )
}
createAxiosResponseInterceptor()

export const axiosWrapper = {
  get: (url, authNeeded = 'jwt', options = null) => {
    return myInstance.request(buildRequestOptions('GET', url, null, authNeeded, false, FORM_URLENCODED, options))
  },
  post: (url, data, authNeeded = 'jwt', json = false, options = null) => {
    return myInstance.request(buildRequestOptions('POST', url, data, authNeeded, json, FORM_DATA, options))
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
