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
    method: 'post',
    params,
  });
}

// 查看项目或一般需求看板
export async function queryProjectDemandBoard(params) {
  return request('/demand/queryBoard', {
    method: 'post',
    params,
  });
}

// 团队
export async function queryGroup(params) {
  return request('/group/query', {
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
// 系统列表  临时暂用
export async function fetchSystemList(params) {
  return request('/temp/system', {
    method: 'get',
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
// 新增Story
export async function addStory(params) {
  return request('/story/add', {
    method: 'post',
    params,
  });
}
// 编辑Story
export async function updateStory(params) {
  return request('/story/update', {
    method: 'post',
    params,
  });
}
