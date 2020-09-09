const formLayoutItem = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const formLayoutItemAddDouble = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formLayoutItem1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}
const formLayoutItemAddEdit = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
}

const searchItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 20 },
  },
};

export {
  formLayoutItem,
  formLayoutItem1,
  formLayout,
  searchItemLayout,
  formLayoutItemAddDouble,
  formLayoutItemAddEdit
 }

export const COLOR_TYPY = {
  activeColor: '#FF9716'
}
// 登陆入口
export const LOGIN_ENTRY_TYPE = {
  BOSS: 'BOSS', // 运营管理
  MERCHANT: 'MERCHANT', // 商户管理
  SUPER: 'SUPER', // 超级管理
  CASHIER: 'CASHIER', // 门店管理
};

export const MENU_ACTIONS = {
  ADD: 'add', // 新增
  EDIT: 'edit', // 编辑
  CHANGE: 'change', // 变更
  DELETE: 'delete', // 删除
  ABANDON: 'abandon', // 废弃
  CHECK: 'check', // 查看
  ENABLE: 'enable', // 启用
  DISABLE: 'disable', // 禁用
  AUDIT: 'audit', // 审核
  EXPORT: 'export', // 导出
  PRINT: 'print', // 打印
  SAVE: 'save', // 保存
  SUBMIT: 'submit', // 提交
  CANCEL: 'cancel', // 取消
  BACK: 'back', // 返回
};

const imgTypes = ['JPG', 'JPEG', 'PNG', 'BMP']
const fileTypes = ['TXT', 'XLS', 'EXCEL', 'DOC', 'XLSX', 'DOCX', 'PPT', 'PPTX', 'VSD', 'CVS', 'PDF']
const judgeFileType = (file={}, fileArr = []) => {
  const {name } = file
  const arr = name ? name.split('.') : []
  let bool = false
  let suffix = ''
  if(arr.length> 0) {
    suffix=arr[arr.length-1].toUpperCase()
  }
  if(fileArr.indexOf(suffix) < 0) {
    bool = true
  }
  return bool
}
export {
  imgTypes,
  fileTypes,
  judgeFileType
}
