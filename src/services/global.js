import request from '@/utils/request';

// 查询日志
export async function queryLogList(params) {
  return request('/log/query', {
    method: 'post',
    params,
  });
}

// 查询部门
export async function queryDept(params) {
  return request('/dept/search', {
    method: 'get',
    params,
  });
}

// 查询公司
export async function queryComp(params) {
  return request('/company/search', {
    method: 'get',
    params,
  });
}
