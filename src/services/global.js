import request from '@/utils/request';

//查询日志
export async function queryLogList(params) {
  return request('/log/query', {
    method: 'post',
    params,
  });
}

// 新增权限菜单
export async function addMenuList(params) {
  return request('/resource/addResource', {
    method: 'post',
    params,
  });
}