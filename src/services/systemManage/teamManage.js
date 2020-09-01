import request from '@/utils/request';

export async function queryTeamList(params) {
  return request('/cluster/query', {
    method: 'post',
    params,
  });
}


