import request from '@/utils/request';

// 新增/编辑需求
export async function addUpdateDemand(params) {
  return request('/demand/save', {
    method: 'post',
    params,
  });
}

// 删除需求
export async function deleteDemand(params) {
  return request('/demand/delete', {
    method: 'get',
    params,
  });
}

// 查看列表
export async function queryDemand(params) {
  return request('/demand/list', {
    method: 'post',
    params,
  });
}
// 查看列表
export async function fetchSearchList(params) {
  return request('/demand/quick/search/type', {
    method: 'get',
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
  return request('/demand/board', {
    method: 'post',
    params,
  });
}

// 查看详情
export async function queryDemandInfo(params) {
  return request('/demand/info', {
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

// 查预算编号
export async function queryBudgetNumber(params) {
  return request('/budget/search', {
    method: 'get',
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
  return request('/user/list', {
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

// 取消关注
export async function unFocusDemand(params) {
  return request('/demand/cancel/attention', {
    method: 'get',
    params,
  });
}

// 取消需求
export async function cancelDemand(params) {
  return request('/demand/cancel', {
    method: 'get',
    params,
  });
}

// 需求打回
export async function backDemand(params) {
  return request('/demand/return', {
    method: 'get',
    params,
  });
}

// 指派关注人/关注
export async function assignUser(params) {
  return request('/demand/attention', {
    method: 'post',
    params,
  });
}

// 需求受理/指派
export async function receiverAppointDemand(params) {
  return request('/demand/accept', {
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

// 添加常用语
export async function addCommonLang(params) {
  return request('/message/commonLanguage/add', {
    method: 'post',
    params,
  });
}

// 修改常用语
export async function updateCommonLang(params) {
  return request('/message/commonLanguage/update', {
    method: 'post',
    params,
  });
}

// 查询常用语
export async function queryCommonLang(params) {
  return request('/message/commonLanguage/list', {
    method: 'get',
    params,
  });
}

// 需求到待拆分
export async function toDivider(params) {
  return request('/demand/update/status', {
    method: 'get',
    params,
  });
}

// 发起oa技术评审
export async function sendOAReview(params) {
  return request('/demand/send/oa/review', {
    method: 'get',
    params,
  });
}