import request from '@/utils/request'

// 查询游戏信息列表
export function listGames(query) {
  return request({
    url: '/iaa/games/list',
    method: 'get',
    params: query
  })
}

// 查询游戏信息列表
export function listGamesSimple(query) {
  return request({
    url: '/iaa/games/listSimple',
    method: 'get',
    params: query
  })
}

// 查询游戏信息详细
export function getGames(id) {
  return request({
    url: '/iaa/games/' + id,
    method: 'get'
  })
}

// 新增游戏信息
export function addGames(data) {
  return request({
    url: '/iaa/games',
    method: 'post',
    data: data
  })
}

// 修改游戏信息
export function updateGames(data) {
  return request({
    url: '/iaa/games',
    method: 'put',
    data: data
  })
}

// 删除游戏信息
export function delGames(id) {
  return request({
    url: '/iaa/games/' + id,
    method: 'delete'
  })
}
