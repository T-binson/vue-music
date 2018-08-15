import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlayList(this.playlist)
  },
  activated() {
    this.handlePlayList(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'playing',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    getFavoriteIcon(song) {
      /* if (this._isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      } */
      return this._isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this._isFavorite(song)) {
        this.cancelFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    _isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return song.id === item.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'cancelFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(key) {
      this.$refs.searchBox.setQuery(key)
    },
    onQueryChange(newQuery) {
      /* if (!this.query) {
        return
      } */
      this.query = newQuery
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    }
  },
  ...mapActions([
    'saveSearchHistory',
    'deleteSearchHistory'
  ])
}