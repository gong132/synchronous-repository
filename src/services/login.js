import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/budget/login', {
    method: 'GET',
    params: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
