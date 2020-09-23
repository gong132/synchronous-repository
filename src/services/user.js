import request from '@/utils/request';

export async function fetchMenuList(params) {
  return request('/resource/queryList',{ method: 'get', params});
}
export async function fetchCurrentUserInfo() {
  return request('/user/userInfo');
}
export async function queryNotices(params) {
  return request('/api/notices', {
    method: 'POST',
    params,
  });
}
export async function queryBudget(params) {
  return request('/api/budget', {
    method: 'POST',
    params,
  });
}

export async function fetchListByRoleId(params) {
  return request('/resource/queryListByRoleId', {
    method: 'get',
    params,
  });
}
export async function queryCurrentUserMenuList(params) {
  return request('/user/queryResource', {
    method: 'get',
    params,
  });
}
