import request from '@/utils/request';

// 预算图表
export async function fetchBudgetChartsData(params) {
  return request('/report/budget/picture', {
    method: 'post',
    params,
  });
}

// 预算列表
export async function fetchBudgetListData(params) {
  return request('/report/budget/list', {
    method: 'post',
    params,
  });
}
// 预算树
export async function fetchBudgetTreeData(params) {
  return request('/report/budget/tree', {
    method: 'post',
    params,
  });
}

// 预算详情
export async function fetchBudgetinfo(params) {
  return request('/report/budget/info', {
    method: 'post',
    params,
  });
}
