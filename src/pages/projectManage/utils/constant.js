// 优先级
const DEMAND_PRIORITY_ARR = [
  { key: 'h', val: '高' },
  { key: 'm', val: '中' },
  { key: 'l', val: '低' },
];

const DEMAND_PRIORITY_OBJ = {
  h: '高',
  m: '中',
  l: '低',
};

// 项目状态
const PROJECT_STATUS_ARR = [
  { key: '1', val: '立项' },
  { key: '2', val: '商务' },
  { key: '3', val: '启动' },
  { key: '4', val: '开发' },
  { key: '5', val: '测试' },
  { key: '6', val: '上线' },
  { key: '7', val: '验收结项' },
]

const PROJECT_STATUS_OBJ = {
  '1': '立项',
  '2': '商务',
  '3': '启动',
  '4': '开发',
  '5': '测试',
  '6': '上线',
  '7': '验收结项',
}

// 评审阶段
const REVIEW_STAGE_ARR = [
  { key: '1', val: '未发起' },
  { key: '2', val: '审批中' },
  { key: '3', val: '已通过' },
]

const REVIEW_STAGE_OBJ = {
  '1': '未发起',
  '2': '审批中',
  '3': '已通过',
}

// 商务状态
const BUSINESS_STATUS_ARR = [
  { key: '1', val: '未商务' },
  { key: '2', val: '待商务' },
  { key: '3', val: '已商务' },
]

const BUSINESS_STATUS_OBJ = {
  '1': '未商务',
  '2': '待商务',
  '3': '已商务',
}

export {
  DEMAND_PRIORITY_ARR,
  DEMAND_PRIORITY_OBJ,
  PROJECT_STATUS_ARR,
  PROJECT_STATUS_OBJ,
  REVIEW_STAGE_ARR,
  REVIEW_STAGE_OBJ,
  BUSINESS_STATUS_ARR,
  BUSINESS_STATUS_OBJ
}