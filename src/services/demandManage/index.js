import request from '@/utils/request';

// 获取需求管理信息
export async function fetchDemandInfo(params) {
  return request('/demand/manage/info', {
    method: 'post',
    params,
  });
}

// 获取需求管理列表
export async function fetchDemandList(params) {
  return request('/demand/manage/list', {
    method: 'post',
    params,
  });
}
