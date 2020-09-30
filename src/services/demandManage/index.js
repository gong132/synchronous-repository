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

// 系统列表
export async function fetchSystemList(params) {
  return request('/system/list', {
    method: 'post',
    params,
  });
}
// 人员列表
export async function fetchUserList(params) {
  return request('/personnel/queryPage', {
    method: 'post',
    params,
  });
}
// 获取所有集成模块
export async function fetchClusterList(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}
