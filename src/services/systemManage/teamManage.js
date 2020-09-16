import request from '@/utils/request';

export async function queryTeamList(params) {
  return request('/group/query', {
    method: 'post',
    params,
  });
}

// 模糊查询
export async function queryTeamBy(params) {
  return request('/group/search', {
    method: 'get',
    params,
  });
}
