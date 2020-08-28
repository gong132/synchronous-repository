import request from '@/utils/request';

export async function fetchData(params) {
  return request('/cluster/query', {
    method: 'post',
    params,
  });
}

export async function fetchAllSectors(params) {
  return request('/cluster/all', {
    method: 'get',
    params,
  });
}

export async function createData(params) {
  return request('/cluster/add', {
    method: 'post',
    params,
  });
}

export async function updateData(params) {
  return request('/cluster/update', {
    method: 'post',
    params,
  });
}
