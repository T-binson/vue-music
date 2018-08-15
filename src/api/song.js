import {commonParam} from './config'
import axios from 'axios'
import {getUid} from 'common/js/uid'
import {ERR_OK} from 'api/config'
import jsonp from 'common/js/jsonp'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParam, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getVkey(mid, filename) {
  const a = 'MusicJsonCallback' + (Math.random() + '').replace('0.', '')
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParam, {
    g_tk: 5381,
    jsonpCallback: a,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    callback: a,
    uin: 0,
    songmid: mid,
    filename: filename,
    guid: getUid()
  })
  return jsonp(url, data)
}

export function getSongUrl(songs) {
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParam, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })
  return new Promise((resolve, reject) => {
    let tryTime = 3
    function request() {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === ERR_OK) {
          let urlMid = res.url_mid
          if (urlMid && urlMid.code === ERR_OK) {
            const info = urlMid.data.midurlinfo[0]
            if (info && info.purl) {
              resolve(res)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }
    request()
  })
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: 0,
      loginflag: 0,
      platform: '23'
    }
  }
}