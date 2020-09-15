import request from '@/utils/request';

// 新增
export async function addDemand(params) {
  return request('/demand/add', {
    method: 'post',
    params,
  });
}

// 新增
export async function updateDemand(params) {
  return request('/demand/update', {
    method: 'post',
    params,
  });
}

// 查看列表
export async function queryDemand(params) {
  return request('/demand/query', {
    method: 'post',
    params,
  });
}

// 查看详情
export async function queryDemandDetail(params) {
  return request('/demand/selectOne', {
    method: 'get',
    params,
  });
}

// 查看项目或一般需求列表
export async function queryDemandProject(params) {
  return request('/demand/queryListByType', {
    method: 'get',
    params,
  });
}


// 查看需求看板
export async function queryDemandBoard(params) {
  return request('/demand/queryBoard', {
    method: 'get',
    params,
  });
}

// 查看项目或一般需求看板
export async function queryProjectDemandBoard(params) {
  return request('/demand/queryBoard', {
    method: 'get',
    params,
  });
}