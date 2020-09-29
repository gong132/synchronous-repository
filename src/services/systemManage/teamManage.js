import request from '@/utils/request';

export async function queryTeamList(params) {
  return request('/team/query', {
    method: 'post',
    params,
  });
}

// 模糊查询
export async function queryTeamBy(params) {
  return request('/team/search', {
    method: 'get',
    params,
  });
}

// 查团队经理
export async function queryTeamHeader(params) {
  return request('/personnel/queryTeamHead', {
    method: 'get',
    params,
  });
}