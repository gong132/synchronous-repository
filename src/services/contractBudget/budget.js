import request from '@/utils/request';

// 获取预算列表
export async function queryBudgetList(params) {
  return request('/budget/query', {
    method: 'post',
    params,
  });
}
// 新增预算
export async function addBudget(params) {
  return request('/budget/add', {
    method: 'post',
    params,
  });
}
// 修改预算
export async function updateBudget(params) {
  return request('/budget/update', {
    method: 'post',
    params,
  });
}
// 获取所有集成模块
export async function fetchClusterList(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}
// 集群版块查询部门信息
export async function fetchDeptListByCluster(params) {
  return request('/cluster/bindDept', {
    method: 'get',
    params,
  });
}
// 集团  暂用
export async function fetchGroupList(params) {
  return request('/temp/group', {
    method: 'get',
    params,
  });
}
