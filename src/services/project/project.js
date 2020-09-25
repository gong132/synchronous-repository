import request from '@/utils/request';

// 查询所有集群板块
export async function queryAllCluster(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}

// 查预算编号
export async function queryBudgetNumber(params) {
  return request('/budget/search', {
    method: 'get',
    params,
  });
}