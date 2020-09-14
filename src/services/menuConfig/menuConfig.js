import request from '@/utils/request';

// 获取所有菜单
export async function fetchAllMenuList(params) {
  return request('/resource/queryList', { method: 'get', params });
}

// 删除菜单
export async function deleteMenu(params) {
  return request('/resource/deleteBatch', { method: 'post', params });
}

// 新增菜单
export async function addMenu(params) {
  return request('/resource/addResource', { method: 'post', params });
}
