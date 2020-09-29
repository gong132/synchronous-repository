import request from '@/utils/request';

// 获取需求管理信息
export async function fetchDemandInfo(params) {
  return request('/demand/manage/info', {
    method: 'post',
    params,
  });
}
