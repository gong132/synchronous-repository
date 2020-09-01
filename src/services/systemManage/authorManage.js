import request from '@/utils/request';

// 查询所有角色
export async function fetchAllRoles(params) {
  return request('/role/queryList', {
    method: 'get',
    params,
  });
}

//修改角色对应的权限菜单
export async function updateRoleAuthor(params) {
  return request('/role/updateMenu', {
    method: 'put',
    params,
  });
}

// 删除id对应的角色权限
export async function deleteRoleAuthor(params) {
  return request('/role/deleteRole', {
    method: 'delete',
    params,
  });
}

// 增加角色权限
export async function addRoleAuthor(params) {
  return request('/role/add', {
    method: 'post',
    params,
  });
}

// 遍历查询菜单
export async function queryMenuList(params) {
  return request('/resource/queryList', {
    method: 'get',
    params,
  });
}

// 新增权限菜单
export async function addAuthorMenu(params) {
  return request('/resource/addResource', {
    method: 'post',
    params,
  });
}

// 查询角色对应菜单权限
export async function queryAuthorByRoleId(params) {
  return request('/resource/queryListByRoleId', {
    method: 'get',
    params,
  });
}

// 修改权限菜单
export async function updateAuthorByRoleId(params) {
  return request('/resource/updateResource', {
    method: 'put',
    params,
  });
}

// 删除对应id权限菜单
export async function deleteAuthorByRoleId(params) {
  return request('/resource/deleteResource', {
    method: 'put',
    params,
  });
}