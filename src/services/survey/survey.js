import request from '@/utils/request';

// 添加
export async function addSurvey(params) {
  return request('/appraise/add', {
    method: 'post',
    params,
  });
}

// 查看
export async function querySurvey(params) {
  return request('/appraise/info', {
    method: 'get',
    params,
  });
}