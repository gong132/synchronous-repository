import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
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
