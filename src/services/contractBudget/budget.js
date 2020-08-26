import request from '@/utils/request';

export async function queryBudgetList(params) {
  return request('/budget/info', {
    method: 'get',
    params,
  });
}
