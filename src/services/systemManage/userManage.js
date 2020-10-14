import request from '@/utils/request';

export async function updateUser(params) {
  return request('/personnel/update', {
    method: 'post',
    params,
  });
}

// 查询
export async function queryUserList(params) {
  return request('/user/search', {
    method: 'post',
    params,
  });
}

// 查询所有角色
export async function fetchAllRolesList(params) {
  return request('/role/queryPage', {
    method: 'post',
    params,
  });
}

// 负责人和团队
export async function queryHeaderGroup(params) {
  return request('/team/query', {
    method: 'post',
    params,
  });
}

// 根据人员id查角色，编辑用
export async function queryRoleById(params) {
  return request('/personnel/queryListByPersonnelId', {
    method: 'get',
    params,
  });
}
