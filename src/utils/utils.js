import pathRegexp from 'path-to-regexp';

import moment from 'moment';
import React from 'react';
import { parse, stringify } from 'qs';
import numeral from 'numeral';
import { isEmpty } from '@/utils/lang';
import storage from './storage';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};


export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type, days) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'now' && !isEmpty(days)) {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay * (days + 1) - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

const regDecimalsTwo = /^(\-)*(\d+)\.(\d\d).*$/;

export function limitDecimals(value) {
  let result = '';
  if (typeof value === 'string') {
    result = !isEmpty(Number(value)) ? value.replace(regDecimalsTwo, '$1$2.$3') : '';
  } else if (typeof value === 'number') {
    result = !isEmpty(value) ? String(value).replace(regDecimalsTwo, '$1$2.$3') : '';
  }
  return result;
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function isTokenExpired(userInfo) {
  // eslint-disable-next-line camelcase
  const { loginTime, expires_in } = userInfo;
  const expireDateTime = new Date(loginTime).setSeconds(
    // eslint-disable-next-line camelcase
    new Date(loginTime).getSeconds() + expires_in
  );
  return expireDateTime <= new Date().getTime();
}

export function yuan(text, prefix) {
  return `${prefix || '￥'} ${numeral(text).format('0,0.00')}`;
}

export function downloadFile(downloadUrl, downloadFileName) {
  const userInfo = storage.get('modoo-user') || {};
  const xhr = new XMLHttpRequest();
  xhr.open('POST', downloadUrl, true);
  xhr.setRequestHeader('Authorization', `Bearer ${userInfo.access_token}`);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.responseType = 'blob';
  xhr.onload = function on() {
    if (this.status === 200) {
      const blob = this.response;
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = downloadFileName;
      a.onload = function onload() {
        window.URL.revokeObjectURL(a.href);
      };
      a.click();
    }
  };
  xhr.send();
}

// 文件下载, 参数 ( URL  文件名   查询参数)
export function downLoad(downloadUrl, fileName, params) {
  const userInfo = storage.get('modoo-user') || {};
  fetch(downloadUrl, {
    method: 'POST',
    body: window.JSON.stringify(params),
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.access_token}`,
    }),
  })
    .then(response => {
      response.blob().then(blob => {
        const aLink = document.createElement('a');
        document.body.appendChild(aLink);
        aLink.style.display = 'none';
        const objectUrl = window.URL.createObjectURL(blob);
        aLink.href = objectUrl;
        aLink.download = fileName;
        aLink.click();
        document.body.removeChild(aLink);
      });
    })
    .catch(error => {
      console.log(error);
    });
}

export function _fetch(requestPromise, timeout = 30000) {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject(new Error('请求超时'));
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([requestPromise, timerPromise]);
}

export function getDictionary(typeList, dispatch, dictionaryData) {
  const _typeList = typeList.filter(type => isEmpty(dictionaryData[type]));
  if (isEmpty(_typeList)) return;
  dispatch({
    type: 'global/getDictionary',
    payload: {
      typeList: _typeList,
    },
  });
}

export function partition(arr, fn) {
  let initial = [];
  const result = [];
  if (!arr || arr.length <= 0) {
    return result;
  }

  initial.push(arr[0]);

  arr.forEach((elem, index) => {
    if (index >= 1) {
      const flag = fn(arr[index - 1], elem);
      if (flag) {
        initial.push(elem);
      } else {
        result.push(initial);
        initial = [elem];
      }
    }
  });

  result.push(initial);
  return result;
}

/**
 * 去重数组，根据comparator比较器的结果去除重复
 * @param {对象数组} arr
 * @param {比较器} compareKey
 * @return {*} 去除重复的数组
 */
export function deDuplicate(arr, compareKey) {
  const hashSet = new Set();
  const result = arr.reduce((prev, curr) => {
    if (!hashSet.has(curr[compareKey])) {
      hashSet.add(curr[compareKey]);
      prev.push(curr);
    }
    return prev;
  }, []);
  return result;
}

// 去除首尾所有空格 trim head tail space
export function trimHTAllSpace(obj) {
  if (!obj) return obj;
  const newObj = Object.create(null);
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      newObj[key] = trimHTAllSpace(value);
    } else if (Object.prototype.toString.call(value) === '[object Array]') {
      value.forEach(item => {
        newObj[key] = trimHTAllSpace(item);
      });
    } else if (Object.prototype.toString.call(value) === '[object String]') {
      newObj[key] = value.replace(/^\s+|\s+$/g, '');
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
}

export function groupArray(datas, cols) {
  if (!datas) return [];

  const result = datas.reduce(
    (pre, current) => {
      pre.current.push(current);
      if (pre.current.length === cols) {
        pre.list.push(pre.current);
        pre.current = [];
      }
      return pre;
    },
    { list: [], current: [] }
  );

  if (result.current.length) {
    result.list.push(result.current);
  }

  return result.list;
}

/**
 * 生成随机数字加字符串
 * @returns 长度为16为的随机字符串
 */
export function random() {
  return Math.random()
    .toString(36)
    .substr(2);
}

/** 匹配图片 */
export function transformLink(strUrl) {
  const picreg = /https(\S*)(png|jpg|jpeg|svg)/;
  const strList = strUrl.split(',');
  const strUrlList = strList.map(v => {
    if (v.match(picreg) !== null) {
      return v.replace(
        v.match(picreg)[0],
        `<a href="${
          v.match(picreg)[0]
        }" style="display: block;width:15em;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" target="_blank">${
          v.match(picreg)[0]
        }</a>`
      );
    }
    return v;
  });
  return strUrlList.join('');
}

/**
 * 根据子节点将数组拍平，以子节点里的数据为维度
 * @param {*} array 源数据
 * @param {*} childKey 子节点key
 */
export const flatArrayByChildKey = (array, childKey) => {
  if (!array || array.length <= 0) return [];
  const ret = array.reduce((acc, currValue, currIndex) => {
    const rowClassName = currIndex % 2 === 0 ? 'table-row-dark' : '';
    const rowOrder = currIndex + 1;
    const flagItems = currValue[childKey]
      ? currValue[childKey].map((child, childIndex) => {
        const rowSpan = childIndex > 0 ? 0 : currValue[childKey].length;
        return {
          ...currValue,
          flatItem: child,
          rowSpan,
          rowKey: `${currIndex}_${childIndex}`,
          rowClassName,
          rowOrder,
        };
      })
      : [{ ...currValue, rowKey: `${currIndex}_0`, rowSpan: 1, rowClassName, rowOrder }];
    acc.push(...flagItems);
    return acc;
  }, []);
  return ret;
};

/**
 * @desc 分页
 * @param {Number} current = 1
 * @param {Number} total = 10
 * @param {Function} callback
 * @param {Number} pageSize
 * @param {Boolean} bool = true
 * @todo
*/
export const paginationProps = (props) => {
  const {current, pageSize, total, changePage, handleShowSizeChanger, showQuickJumper} = props
  return {
    defaultPageSize: pageSize,
    showQuickJumper: bool,
    total: total,
    current: current,
    showTotal: () => `共${total}条数据， 每页${pageSize}条`,
    onChange: page => callback(page)
  }
}

