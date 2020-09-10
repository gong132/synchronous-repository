import request from '@/utils/request';

// 获取预算列表
export async function fetchAllMenuList(params) {
  return request('/resource/queryList', { method: 'get', params });
}
