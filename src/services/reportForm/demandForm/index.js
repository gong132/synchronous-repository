import request from '@/utils/request';

// 查询需求方报表
export async function queryDemandReportForm(params) {
  return request('/report/demand', {
    method: 'post',
    params,
  });
}