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
// 获取预算详情
export async function fetchBudgetDetails(params) {
  return request('/budget/info', {
    method: 'get',
    params,
  });
}
// 获取日志
export async function fetchLogList(params) {
  return request('/log/query', {
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
// 集团
export async function fetchGroupList(params) {
  return request('/team/search', {
    method: 'get',
    params,
  });
}
// 部门
export async function fetchDeptList(params) {
  return request('/dept/search', {
    method: 'get',
    params,
  });
}
// 根据部门查询集群或者组
export async function fetchGroupByDept(params) {
  return request('/cluster/byDept', {
    method: 'get',
    params,
  });
}
// 查找团队
export async function fetchAllTeam(params) {
  return request('/team/search', {
    method: 'get',
    params,
  });
}
