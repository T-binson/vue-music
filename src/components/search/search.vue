<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref='searchBox' @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" :key="item.n" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="confirmShow">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref='suggest'></suggest>
    </div>
    <confirm ref="confirm" :text="text" confirmBtnText="清空" @confirm="clearAll" @cancel="cancelCount"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
// import {mapActions, mapGetters} from 'vuex'
import {mapActions} from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playlistMixin, searchMixin} from 'common/js/mixin'

export default {
  name: 'search',
  data() {
    return {
      hotkey: [],
      // query: '',
      text: '是否清空所有搜索历史'
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  created() {
    this._getHotKey()
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
    /* ...mapGetters([
      'searchHistory'
    ]) */
  },
  mixins: [playlistMixin, searchMixin],
  methods: {
    /* blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(key) {
      this.$refs.searchBox.setQuery(key)
    },
    onQueryChange(newQuery) {
      this.query = newQuery
      if (!this.query) {
        return
      }
    }, */
    /* saveSearch() {
      this.saveSearchHistory(this.query)
    }, */
    deleteSearch(item) {
      // 此方法可以省略，然后直接在dom中调用以下方法
      this.deleteSearchHistory(item)
    },
    clearAll() {
      // 此方法可以省略，然后直接在dom中调用以下方法
      this.clearSearchHistory()
    },
    confirmShow() {
      this.$refs.confirm.show()
    },
    cancelCount() {
      // 按需需要统计的数据
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
      this.$refs.searchResult.style.bottom = bottom
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0px
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0px 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>