import request from '@/utils/request';

// 获取消息列表
export async function fetchMessageList(params) {
  return request('/message/notice/list', {
    method: 'post',
    params,
  });
}

// 批量修改成已读
export async function batchModifyRead(params) {
  return request('/message/handle/read', {
    method: 'post',
    params,
  });
}
