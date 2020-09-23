import request from '@/utils/request';

// 新增
export async function addMilePlan(params) {
  return request('/milestone/add', {
    method: 'post',
    params,
  });
}

// 编辑
export async function updateMilePlan(params) {
  return request('/milestone/edit', {
    method: 'post',
    params,
  });
}

// 删除
export async function removeMilePlan(params) {
  return request('/milestone/delete', {
    method: 'get',
    params,
  });
}

// 查询
export async function queryMilePlan(params) {
  return request('/milestone/list', {
    method: 'post',
    params,
  });
}

// 详情
export async function queryMilePlanInfo(params) {
  return request('/milestone/info', {
    method: 'get',
    params,
  });
}

// 获取里程碑所有阶段
export async function queryMilePlanStage(params) {
  return request('/milestone/stage', {
    method: 'get',
    params,
  });
}