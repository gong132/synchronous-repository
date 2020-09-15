import request from '@/utils/request';

// 新增
export async function addUser(params) {
  return request('/personnel/add', {
    method: 'post',
    params,
  });
}

export async function updateUser(params) {
  return request('/personnel/update', {
    method: 'post',
    params,
  });
}

// 查询
export async function queryUserList(params) {
  return request('/personnel/queryPage', {
    method: 'post',
    params,
  });
}

