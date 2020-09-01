import request from '@/utils/request';

export async function queryUserList(params) {
  return request('/cluster/query', {
    method: 'post',
    params,
  });
}

export async function updateUser(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}

