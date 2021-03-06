import request from '@/utils/request';

// 查询集群板块列表
export async function fetchData(params) {
  return request('/cluster/query', {
    method: 'post',
    params,
  });
}

// 
export async function createData(params) {
  return request('/cluster/add', {
    method: 'post',
    params,
  });
}

// 编辑/删除集群板块
export async function updateData(params) {
  return request('/cluster/update', {
    method: 'post',
    params,
  });
}

// 未被集群版块绑定的部门
export async function queryDept(params) {
  return request('/cluster/notBindDept', {
    method: 'get',
    params,
  });
}

// 查看集群板块详情
export async function querySectorInfo(params) {
  return request('/cluster/info', {
    method: 'get',
    params,
  });
}

// 查询所有部门
export async function queryDeptAll(params) {
  return request('/dept/search', {
    method: 'get',
    params,
  });
}