import React from 'react';
import { Tooltip, Popover, Badge, Avatar } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';
import Ellipsis from '@/components/Ellipsis';

// ===========================> Check Instance <=========================== //
function isObject(value) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

function isArray(value) {
  const checkArray =
    Array.isArray || (_arg => Object.prototype.toString.call(_arg) === '[object Array]');
  return checkArray(value);
}

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (isObject(value)) return Object.keys(value).length === 0;
  if (isArray(value)) return value.length === 0;

  return false;
}

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function moneyFormat(text, prefix = '¥') {
  return text === null ? '--' : `${prefix} ${numeral(text).format('0,0.00')}`;
}

const CheckInstanceHelper = { isObject, isArray, isEmpty, isString };
// ===========================> Check Instance <=========================== //

// ===========================> Menu Actions <=========================== //
const Buttons = {
  DEFINE: (key, name, path) => ({ key, name, path }),
  CHECK: (name = '查看', path) => ({ key: 'check', name, path }),
  ADD: (name = '新增', path) => ({ key: 'add', name, path }),
  EDIT: (name = '编辑') => ({ key: 'edit', name }),
  DELETE: (name = '删除') => ({ key: 'delete', name }),
  EXPORT: (name = '导出') => ({ key: 'export', name }),
  PRINT: (name = '打印') => ({ key: 'print', name }),
  SAVE: (name = '保存') => ({ key: 'save', name }),
  SUBMIT: (name = '提交') => ({ key: 'submit', name }),
  CANCEL: (name = '取消') => ({ key: 'cancel', name }),
  BACK: (name = '返回') => ({ key: 'back', name }),
};

const CRUDButtons = [Buttons.CHECK(), Buttons.ADD(), Buttons.EDIT(), Buttons.DELETE()];
const ALLButtons = [
  Buttons.CHECK(),
  Buttons.ADD(),
  Buttons.EDIT(),
  Buttons.DELETE(),
  Buttons.EXPORT(),
  Buttons.PRINT(),
  Buttons.SAVE(),
  Buttons.SUBMIT(),
  Buttons.CANCEL(),
  Buttons.BACK(),
];
// Conversion router to menu.
function formatter(data, parentName, parentPath) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        path: `${parentPath || ''}${parentPath ? '/' : ''}${item.path}`,
      };
      if (item.routes) {
        const children = formatter(item.routes, locale, result.path);
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

function getMenuData(routers, parentPath) {
  return formatter(routers, '', parentPath);
}

function getFlatMenus(menuData) {
  let menus = [];
  menuData.forEach(item => {
    menus.push(item);
    if (item.children) {
      menus = menus.concat(getFlatMenus(item.children));
    }
  });
  return menus;
}

const MenuActionHelper = { Buttons, CRUDButtons, ALLButtons, getMenuData, getFlatMenus };

// ===========================> Menu Actions <=========================== //

// ===========================> Table Column <=========================== //
function genPlanColumn(key, title, extend) {
  return { key, title, dataIndex: key, align: 'center', ...extend, };
}

function getAvatarColumn(key, title, extend, props) {
  return {
    key,
    title,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => <Avatar src={text} alt="" {...props} />,
  };
}

function genLangColumn(key, title, extend, len = 20) {
  return {
    key,
    title,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => {
      if (text.length <= len) {
        return <span>{text}</span>;
      }
      return (
        <Tooltip placement="top" title={text}>
          {`${text.substring(0, len)}...`}
        </Tooltip>
      );
    },
  };
}

function genPopoverColumn(key, title, len = 12, extend) {
  return {
    key,
    title,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => {
      if (text.length <= len) {
        return <span>{text}</span>;
      }
      return (
        <Popover content={text} trigger="hover" title={title}>
          {`${text.substring(0, len)}...`}
        </Popover>
      );
    },
  };
}

function genEllipsisColumn(key, title, len = 12, extend) {
  return {
    key,
    title,
    align: 'center',
    ...extend,
    dataIndex: key,
    render: text => (
      <Ellipsis length={len} tooltip="true">
        {text}
      </Ellipsis>
    ),
  };
}
function genNewlineColumn(key, title, len = 12, extend) {
  return {
    key,
    title,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => {
      if (!text) return '';
      const arr = [];
      for (let i = 0; i < Math.ceil(text.length / len); i += 1) {
        arr.push(text.substr(i * len, (i + 1) * len))
      }
      return (
        <div>
          {
            arr.map((v, i)=> (
              <div key={v+i.toString()}>{v}</div>
            ))
          }
        </div>
      )
    },
  };
}

function genSelectColumn(key, title, options, extend) {
  return {
    title,
    key,
    align: 'center',
    ...extend,
    dataIndex: key,
    render: text => {
      if (isEmpty(options)) return text;
      const status = options.find(option => String(option.key) === String(text));
      if (status) {
        return status.value;
      }

      if (extend) {
        return extend.valueIfNone;
      }

      return text;
    },
  };
}

function genDateTimeColumn(key, title, format = 'YYYY-MM-DD HH:mm', extend) {
  return {
    title,
    key,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => (text && moment(text).format(format)) || '',
  };
}

function genMoneyColumn(key, title, extend, prefix = '￥') {
  return {
    title,
    key,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => moneyFormat(text, prefix),
  };
}

function genPercentColumn(key, title, extend) {
  return {
    title,
    key,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => (text === null ? '--' : `${numeral(text).format('0,0.00')} %`),
  };
}

function genDiscountMoneyColumn(key, title, extend, prefix = '￥') {
  return {
    title,
    key,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => (text === null ? '--' : `- ${prefix} ${numeral(text).format('0,0.00')}`),
  };
}

function genBadgeColumn(key, title, status, extend) {
  return {
    title,
    key,
    align: 'center',
    dataIndex: key,
    ...extend,
    render: text => <Badge text={text} status={status || 'default'} />,
  };
}

function unshiftIndexColumn(old, page, cProps = {}) {
  return [
    {
      key: 'index',
      title: '序号',
      align: 'center',
      ...cProps,
      render: (text, record, index) =>
        page
          ? page.pageSize * (page.pageNo || page.currentPage) + (index + 1) - page.pageSize
          : index + 1,
    },
  ].concat(old);
}

const TableColumnHelper = {
  genPlanColumn,
  genLangColumn,
  genNewlineColumn,
  genPopoverColumn,
  genEllipsisColumn,
  genSelectColumn,
  unshiftIndexColumn,
  getAvatarColumn,
  genDateTimeColumn,
  genMoneyColumn,
  genBadgeColumn,
  genDiscountMoneyColumn,
  genPercentColumn,
};
// ===========================> Table Column <=========================== //

// ===========================> Page <=========================== //
const DefaultPage = {
  currentPage: 1,
  pageSize: 10,
};

const MaxPage = {
  currentPage: 1,
  pageSize: 9999,
};

function genPagination(page = DefaultPage, showSizeChanger = true) {
  return {
    current: parseInt(page.currentPage, 0),
    total: parseInt(page.records, 0),
    pageSize: parseInt(page.pageSize, 0),
    showSizeChanger,
    showQuickJumper: true,
    showTotal: () => `共 ${page.records} 项`,
    pageSizeOptions: ['5', '10', '20', '50'],
  };
}

function genListState(filter) {
  return {
    filter: {
      ...DefaultPage,
      ...filter,
    },
    list: [],
    pagination: {},
  };
}

function resolveListState(payload) {
  const { filter, data, ...page } = payload;
  return {
    filter,
    list: data || [],
    pagination: {
      current: filter.currentPage,
      pageSize: filter.pageSize,
      total: page.total,
    },
  };
}

function filterResolver(filter = {}, key, sub1, sub2, format = 'YYYY-MM-DD') {
  const resItem = filter[key];
  delete filter[key];
  const finalFilter = { ...filter, [sub1]: (resItem && !isEmpty(resItem) && moment(resItem[0]).format(format)) || '',
    [sub2]: (resItem && !isEmpty(resItem) && moment(resItem[1]).format(format)) || '', };
  return finalFilter;
}

const PagerHelper = {
  genListState,
  resolveListState,
  filterResolver,
  genPagination,
  DefaultPage,
  MaxPage,
};
// ===========================> Page <=========================== //

// 数组转成以field为key的map对象
function arrayToMap(arr, key) {
  if (!arr) return {};

  return arr.reduce((map, item) => {
    const newMap = map;
    newMap[item[key]] = item;
    return newMap;
  }, {});
}

function getFlatMenuKeys(menuData) {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
}

function getMenuMatches(flatMenuKeys, path) {
  return flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });
}

function getDictionaryValue(code, dict) {
  if (isEmpty(dict)) return code;

  const item = dict.find(_item => String(_item.id) === String(code));
  if (isEmpty(item)) return code;

  return item.value;
}

const buildGoodsCategoryChildren = (goodsCategories, allCategories) => {
  goodsCategories.map(category => {
    category.children = allCategories.filter(cate => cate.parentId === category.id);
    if (!isEmpty(category.children)) {
      buildGoodsCategoryChildren(category.children, allCategories);
    } else {
      delete category.children;
    }
    return category;
  });
};

const buildGoodsCategory = list => {
  if (!list) return [];

  const goodsCategories = list.filter(cate => cate.parentId === 0);
  buildGoodsCategoryChildren(goodsCategories, list);
  return goodsCategories;
};

const formatGoodsCategory = (categoryCode, goodsCategories) => {
  if (isEmpty(goodsCategories)) return {};

  const category = goodsCategories.find(cate => cate.id === parseInt(categoryCode, 0)) || {};
  const secondCategory = isEmpty(category)
    ? {}
    : goodsCategories.find(cate => cate.id === parseInt(category.parentId, 0));

  const firstCategory = isEmpty(secondCategory)
    ? {}
    : goodsCategories.find(cate => cate.id === parseInt(secondCategory.parentId, 0));
  return {
    firstCategory,
    secondCategory,
    category,
  };
};

const buildGoodsTypesChildren = (goodsTypes, allTypes) => {
  goodsTypes.map(type => {
    type.children = allTypes.filter(_type => _type.parentId === type.id);
    if (!isEmpty(type.children)) {
      buildGoodsTypesChildren(type.children, allTypes);
    } else {
      delete type.children;
    }
    return type;
  });
};

const buildGoodsTypes = list => {
  if (!list) return [];
  const goodsTypes = list.filter(type => type.parentId === 0);
  buildGoodsTypesChildren(goodsTypes, list);
  return goodsTypes;
};

const GoodsHelper = {
  buildGoodsCategory,
  buildGoodsTypes,
  formatGoodsCategory,
};

const format = (time, formatStr = 'YYYY-MM-DD') => (time && moment(time).format(formatStr)) || '';
const TimeHelper = {
  format,
};

const NumberHelper = {
  /**
   * 最大两位小数点
   */
  maxTwoDp: num => {
    if (Number.isNaN(num)) {
      return '';
    }

    num = String(num);

    const numArray = num.split('.');
    if (numArray.length > 1) {
      num = `${numArray[0]}.${numArray[1].substring(0, 2)}`;
    }
    return num;
  },
  /**
   * 仅允许整数
   */
  intOnly: num => {
    if (Number.isNaN(num)) {
      return '';
    }
    num = String(num);
    const numArray = num.split('.');
    return numArray[0];
  },
  /**
   * 以金额形式展示
   */
  moneyFormat: (text, prefix = '¥') => moneyFormat(text, prefix),
  /**
   * 面积展示
   * */
  areaFormat: text => text && `${text.toFixed(2)}(㎡)`,
};

const SelectHelper = {
  /**
   * 渲染下拉项的数据展示
   */
  selectShow: (keyValue, options, extend = {}) => {
    if (!options || options.length <= 0) {
      return keyValue;
    }

    const { keyName = 'key', valueName = 'value', valueIfNone = '--' } = extend;

    const findValue = options.find(item => String(item[keyName]) === String(keyValue));
    if (findValue) {
      return findValue[valueName];
    }
    return keyValue || valueIfNone;
  },
};

export {
  DefaultPage,
  MenuActionHelper,
  PagerHelper,
  CheckInstanceHelper,
  TableColumnHelper,
  arrayToMap,
  getFlatMenuKeys,
  getMenuMatches,
  getDictionaryValue,
  GoodsHelper,
  TimeHelper,
  NumberHelper,
  SelectHelper,
};
