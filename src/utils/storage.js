/* eslint-disable*/
const storage = { version: '1.3.17' };

storage.has = key => storage.get(key) !== undefined;

storage.transact = (key, defaultVal, transactionFn) => {
  let val = '';
  if (transactionFn === null) {
    transactionFn = defaultVal;
    defaultVal = null;
  }
  if (defaultVal === null) {
    defaultVal = {};
  }
  val = storage.get(key, defaultVal);
  transactionFn(val);
  storage.set(key, val);
};

storage.serialize = value => JSON.stringify(value);
storage.deserialize = value => {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value || undefined;
  }
};

storage.set = (key, val, callback) => {
  if (val === undefined) {
    return storage.remove(key);
  }
  localStorage.setItem(key, storage.serialize(val));

  callback && callback();
  return val;
};
storage.get = (key, defaultVal, callback) => {
  const val = storage.deserialize(localStorage.getItem(key));

  callback && callback(val === undefined ? defaultVal : val);
  return val === undefined ? defaultVal : val;
};
storage.remove = key => localStorage.removeItem(key);
storage.clear = () => localStorage.clear();
storage.getAll = () => {
  const ret = {};

  storage.forEach((key, val) => {
    ret[key] = val;
  });
  return ret;
};
storage.forEach = callback => {
  let i = 0;
  let key = '';
  for (i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);
    callback(key, storage.get(key));
  }
};

storage.add = (key, val, callback) => {
  if (val === undefined) {
    return storage.remove(key);
  }
  const historyStorage = storage.get(key, {});
  storage.set(key, {...historyStorage, ...val});

  callback && callback();
  return val;
};

export default storage;
