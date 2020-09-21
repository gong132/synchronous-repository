import request from '@/utils/request';

// 新增
export async function addDemand(params) {
  return request('/demand/add', {
    method: 'post',
    params,
  });
}

// 暂存需求
export async function tempAddDemand(params) {
  return request('/demand/ts', {
    method: 'post',
    params,
  });
}

// 编辑需求
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

// 查看详情
export async function queryDemandInfo(params) {
  return request('/demand/selectOne', {
    method: 'get',
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

// story list
export async function fetchStoryList(params) {
  return request('/story/list', {
    method: 'post',
    params,
  });
}

// 复制story
export async function copyStory(params) {
  return request('/story/copy', {
    method: 'post',
    params,
  });
}

// 查询story
export async function searchStory(params) {
  return request('/story/search', {
    method: 'post',
    params,
  });
}
// 批量评估、转评估story
export async function batchAssessStory(params) {
  return request('/story/batch', {
    method: 'post',
    params,
  });
}
