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

// 获取项目所有阶段状态
export async function queryAllStageStatus(params) {
  return request('/project/all/stage', {
    method: 'get',
    params,
  });
}

// 项目详情
export async function queryProjectInfo(params) {
  return request('/project/info', {
    method: 'get',
    params,
  });
}

// 项目列表
export async function queryProjectList(params) {
  return request('/project/list', {
    method: 'post',
    params,
  });
}

// 项目编辑
export async function updateProject(params) {
  return request('/project/update', {
    method: 'post',
    params,
  });
}

// 查供应商
export async function querySupplier(params) {
  return request('/supplier/list', {
    method: 'post',
    params,
  });
}