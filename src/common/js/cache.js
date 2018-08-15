import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const PLAY_HISTROY = '__playHistory__'
const PLAY_HISTROY_MAXLENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function savePlay(song) {
  let playHistory = storage.get(PLAY_HISTROY, [])
  insertArray(playHistory, song, (item) => {
    return item.id === song.id
  }, PLAY_HISTROY_MAXLENGTH)
  storage.set(PLAY_HISTROY, playHistory)
  return playHistory
}

function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function saveFavorite(song) {
  let favorite = storage.get(FAVORITE_KEY, [])
  insertArray(favorite, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favorite)
  return favorite
}

export function cancelFavorite(song) {
  let favorite = storage.get(FAVORITE_KEY, [])
  deleteFromArray(favorite, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, favorite)
  return favorite
}

export function loadPlay() {
  return storage.get(PLAY_HISTROY, [])
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}