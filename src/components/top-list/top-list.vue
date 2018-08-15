<template>
  <transition name="slide">
    <music-list class="" :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getRankListDetails} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  name: 'top-list',
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getRankListDetails() {
      if (!this.topList.id) {
        this.$router.push('/rank/')
        return
      }
      getRankListDetails(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._noamalizeSongs(res.songlist)
        }
      })
    },
    _noamalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getRankListDetails()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s ease
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>