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
