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

// 查看流程进度接口
export async function queryFlow(params) {
  return request('/process/list', {
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
// 获取预算列表
export async function queryBudgetList(params) {
  return request('/budget/query', {
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

// story详情
export async function fetchStoryDetails(params) {
  return request('/story/info', {
    method: 'get',
    params,
  });
}

// 同步story
export async function syncStory(params) {
  return request('/story/sync', {
    method: 'get',
    params,
  });
}
// 查询 评估权限
export async function estimate(params) {
  return request('/story/estimate', {
    method: 'get',
    params,
  });
}

// 关注需求
// attention/add
export async function focusDemand(params) {
  return request('/attention/add', {
    method: 'post',
    params,
  });
}

// 指派关注人
export async function assignUser(params) {
  return request('/attention/add', {
    method: 'post',
    params,
  });
}

// 需求受理
export async function receiverDemand(params) {
  return request('/demand/receiver', {
    method: 'post',
    params,
  });
}

// 看板拖拽接口
export async function dragDemand(params) {
  return request('/demand/pointReceiver', {
    method: 'post',
    params,
  });
}