import request from '@/utils/request';

// 查询项目报表
export async function queryProjectReportForm(params) {
  return request('/report/project', {
    method: 'post',
    params,
  });
}