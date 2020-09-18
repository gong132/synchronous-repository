import request from '@/utils/request';

// 获取合同列表
export async function queryContractList(params) {
  return request('/contract/query', {
    method: 'post',
    params,
  });
}

// 获取合同详情
export async function queryContractInfo(params) {
  return request('/contract/info', {
    method: 'get',
    params,
  });
}

// 添加合同
export async function createContract(params) {
  return request('/contract/add', {
    method: 'post',
    params,
  });
}

// 修改合同/项目完结确认
export async function editContract(params) {
  return request('/contract/update', {
    method: 'post',
    params,
  });
}

// 合同确认
export async function checkProject(params) {
  return request('/contract/check', {
    method: 'post',
    params,
  });
}

// 查询所有集群板块
export async function queryAllCluster(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}

// 查询所有项目
export async function queryProject(params) {
  return request('/temp/project', {
    method: 'get',
    params,
  });
}

// 查询所有系统
export async function querySystem(params) {
  return request('/temp/system', {
    method: 'get',
    params,
  });
}

// 查询所有供应商
export async function querySupplier(params) {
  return request('/temp/supplier', {
    method: 'get',
    params,
  });
}

// 负责人和团队
export async function queryHeaderGroup(params) {
  return request('/team/query', {
    method: 'post',
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