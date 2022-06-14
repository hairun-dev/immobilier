/* eslint-disable */
import { boot } from 'quasar/wrappers'
import { date, Notify, Loading } from 'quasar'

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const util = {
  formatDate(d, format = 'DD-MM-YYYY') {
    return date.formatDate(new Date(d), format)
  },
  /**
   * Convert iso time to locale time
   *
   * @param string isoTime
   */
  fromISOTime (isoTime) {
    let localDate = (new Date()).toISOString()
    const patternTimeParts = /T(.*)Z/
    const matches = localDate.match(patternTimeParts)
    const isoDate = new Date(localDate.replace(matches[1], isoTime))
    return isoDate.getHours()
  },
  getImageBinary(inp, file) {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        inp.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  },
  convertFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) reject('File undefined')
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      reader.readAsDataURL(file)
    })
    // if (file) {
    //   const reader = new FileReader()
    //   reader.onload = (e) => {
    //     inp.push(e.target.result)
    //   }
    //   reader.readAsDataURL(file)
    // }
  },
  openPick(classe) {
    const button = document.querySelector(`.${classe}`)
    button.click()
  },
  openUrl(link) {
    if (link) window.open(link, '_blank')
  },
  random(max) {
    return Math.floor(Math.random() * max)
  },
  getCurrentMonday () {
    // Monday: 1
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + 1)
    return d
  },
  nextPrev (d, action, diff = 7) {
    if (action) d.setDate(d.getDate() + diff)
    else d.setDate(d.getDate() - diff)
    return d
  },
  showLoading () {
    Loading.show()
  },
  hideLoading () {
    Loading.hide()
  },
  showMessage: (message) => {
    Notify.create({
      message: message,
      color: 'green',
      position: 'top-right',
      timeout: 3000,
      icon: 'cloud_done'
    })
  },
  showError (message) {
    Notify.create({
      message: message,
      timeout: 3000,
      icon: 'report_problem',
      color: 'red',
      position: 'top-right'
    })
  },
  playVideo (dom, stream) {
    if ('srcObject' in dom) {
      dom.srcObject = stream
    } else {
      dom.src = window.URL.createObjectURL(stream)
    }
  },
  getJour (date) {
    return JOURS[date.getDay()]
  },
  showTime (t) {
    if (t < 10) return `0${t}`
    return t
  },
  convertMultipartFile (dataurl) {
    console.log('dataUr', dataurl)
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
    }
    return new File([u8arr], dataurl.name, { type: mime })
  }
}
export default boot(({ app }) => {
  app.config.globalProperties.$util = util
})
