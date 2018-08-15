import {getLyric, getSongUrl, getVkey} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import {getUid} from 'common/js/uid'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }

  getSongLyric() {
    // 如果歌词存在则不再去网络请求歌词
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }

  getvkey() {
    getVkey(this.mid, this.filename).then((res) => {
      const key = res.data.items[0]
      console.log(`http://dl.stream.qqmusic.qq.com/${key.filename}?vkey=${key.vkey}&guid=${getUid()}&uin=0&fromtag=66`)
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=${getUid()}`
    // url: musicData.url
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo
      midUrlInfo.forEach((info, index) => {
        let song = songs[index]
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
      })
    }
    return songs
  })
}