/** Used to check objects for own properties. */
// const hasOwnProperty = Object.prototype.hasOwnProperty;

function isObject(value) {
  const type = typeof value;
  return (
    value !== null && (type === 'object' || type === 'function') && Array.isArray(value) === false
  );
}

function isArray(value) {
  const isArrayFn =
    Array.isArray || (arg => Object.prototype.toString.call(arg) === '[object Array]');
  return isArrayFn(value);
}

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function isNumber(value) {
  return typeof value === 'number' && value !== Infinity;
}

function isEmpty(value) {
  if (value === null || value === undefined || value === '') return true;
  if (isObject(value)) return Object.keys(value).length === 0;
  if (isArray(value)) return value.length === 0;

  return false;
}

// 数组对象排序 参数: ( 排序属性,升序(desc)or降序(asc))
function compare(propertyName, type) {
  let sort;
  if (type === 'asc') {
    return function(object1, object2) {
      if (object1[propertyName] < object2[propertyName]) {
        sort = 1;
        return sort;
      }
      if (object1[propertyName] > object2[propertyName]) {
        sort = -1;
        return sort;
      }
      if (object1[propertyName] === object2[propertyName]) {
        sort = 0;
        return sort;
      }
      return sort;
    };
  }
  if (type === 'desc') {
    return function(object1, object2) {
      if (object1[propertyName] > object2[propertyName]) {
        sort = 1;
        return sort;
      }
      if (object1[propertyName] < object2[propertyName]) {
        sort = -1;
        return sort;
      }
      if (object1[propertyName] === object2[propertyName]) {
        sort = 0;
        return sort;
      }
      return sort;
    };
  }
  return sort;
}

function getValue(value, returnValue = '') {
  if (value === null || value === undefined) return returnValue;
  if (isObject(value)) return Object.keys(value).length === 0 ? returnValue : value;
  if (isArray(value)) return value.length === 0 ? returnValue : value;
  if (isString(value)) return value.length === 0 ? returnValue : value;
  if (isNumber(value)) return value.length === 0 ? returnValue : value;

  return value || returnValue;
}

function objectHandler(obj, handler) {
  const finalObj = Object.keys(obj).reduce(
    (a, c) => ({
      ...a,
      [c]: handler(obj[c]),
    }),
    {}
  );
  return finalObj;
}

function trim(str) {
  if (Object.prototype.toString.call(str) === '[object String]') {
    return str.trim();
  }
  return str;
}

function statusToValue(targetArr = [], status) {
  const findObj = targetArr.find(v => String(v.key) === String(status))
  return findObj?.value
}

export { isString, isObject, isArray, isEmpty, objectHandler, trim, getValue, compare, statusToValue };
