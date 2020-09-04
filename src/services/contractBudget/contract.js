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

// 修改合同
export async function editContract(params) {
  return request('/contract/update', {
    method: 'post',
    params,
  });
}