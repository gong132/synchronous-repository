import request from '@/utils/request';

//查询日志
export async function queryLogList(params) {
  return request('/log/query', {
    method: 'post',
    params,
  });
}


