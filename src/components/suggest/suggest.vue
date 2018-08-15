<template>
  <scroll class="suggest" :data="results" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="loadMore" ref="suggest" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in results" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !results.length">
      <no-result :title="title"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  name: 'suggest',
  data() {
    return {
      page: 1,
      results: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '抱歉，暂无搜索结果'
    }
  },
  watch: {
    query() {
      this.search()
    }
  },
  methods: {
    search() {
      if (!this.query) {
        return
      }
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this._normalizeResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    loadMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this.results.concat(this._normalizeResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({id: item.singermid, name: item.singername})
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    listScroll() {
      this.$emit('listScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    _normalizeResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerId) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSong(data.song.list))
      }
      return ret
    },
    _normalizeSong(list) {
      let ret = []
      list.forEach((item) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>