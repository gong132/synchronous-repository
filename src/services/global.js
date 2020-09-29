import request from '@/utils/request';

// 查询日志
export async function queryLogList(params) {
  return request('/log/query', {
    method: 'post',
    params,
  });
}

// 查询部门
export async function queryDept(params) {
  return request('/dept/search', {
    method: 'get',
    params,
  });
}

// 查询团队
export async function queryGroup(params) {
  return request('/team/search', {
    method: 'get',
    params,
  });
}

// 查询公司
export async function queryComp(params) {
  return request('/company/search', {
    method: 'get',
    params,
  });
}

// 查询附件
export async function queryFile(params) {
  return request('/attachment/query', {
    method: 'get',
    params,
  });
}

// 保存附件
export async function saveFile(params) {
  return request('/attachment/bind', {
    method: 'get',
    params,
  });
}

// 查询人员列表
export async function fetchUserList(params) {
  return request('/personnel/search', {
    method: 'post',
    params,
  });
}

// 查询人员
export async function queryUserList(params) {
  return request('/personnel/search', {
    method: 'get',
    params,
  });
}

// 查询系统
export async function fetchSystemList(params) {
  return request('/system/list', {
    method: 'post',
    params,
  });
}
