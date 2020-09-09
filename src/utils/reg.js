export const regex = {
  // 大于0的正整数
  positiveGreateThanZero: '^\\+?[1-9][0-9]*$',

  // 正整数(包括0)
  positiveIntegerAndZero: /^[+]{0,1}(\d+)$/,

  // 正整数(不包括0)
  positiveInteger: /^[1-9]\d*$/,

  // 手机号
  phone: /(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57]|19[136])[0-9]{8}$/,

  // 0-1之间的两位小数(含0,1)
  amongZeroAndOneContainOne: /^(1|0(\.\d{1,2})?)$/,

  // 0-1之间的两位小数(含0不含1)
  amongZeroAndOne: /^(0(\.\d{1,2})?)$/,

  // 10000以内正整数(不含10000)
  positiveGreateMyriad: /^[0-9]\d{0,3}$/,

  // 1000以内正整数(不含1000)
  positiveGreateThousand: /^[0-9]\d{0,2}$/,

  // 100以内正整数(不含100)
  positiveGreateHundred: /^[0-9]\d{0,1}$/,

  // 10以内正整数(不含10)
  positiveGreateTen: /^[0-9]$/,

  // 数字和字母
  numberAndLetter: /[a-zA-Z]|[0-9]/g,

  // 仅中文
  onlyChinese: /[\u4e00-\u9fa5]/g,

  // 两位有效数字正实数
  twoSignificantDigits: /^[0-9]+(.[0-9]{1,2})?$/,

  // 一位有效数字正实数
  oneSignificantDigits: /^[0-9]+(.[0-9]{1})?$/,

  // 身份证号码
  IDCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
};
