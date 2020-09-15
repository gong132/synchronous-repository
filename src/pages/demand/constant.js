// 看板状态：暂存中，待指派、待受理、讨论中，待拆分，story技术评估，开发中，测试中，上线
const boardTitle = [
  {
    name: '暂存中',
    boardId: '0',
  },
  {
    name: '待指派',
    boardId: '1',
  },
  {
    name: '待受理',
    boardId: '2',
  },
  {
    name: '讨论中',
    boardId: '3',
  },
  {
    name: '待拆分',
    boardId: '4',
  },
  {
    name: 'story技术评估',
    boardId: '5',
  },
  {
    name: '开发中',
    boardId: '6',
  },
  {
    name: '测试中',
    boardId: '7',
  },
  {
    name: '上线',
    boardId: '8',
  },
]

// 需求类型
const demandTypeArr = [
  { key: 'p', val: '项目需求（需要OA技术评审）' },
  { key: 'u', val: '一般需求（需要通过OA审批）' },
]

const demandTypeObj = {
  'p': '项目需求（需要OA技术评审）',
  'u': '一般需求（需要通过OA审批）'
}

// 优先级
const demandPriorityArr = [
  { key: 'h', val: '高' },
  { key: 'm', val: '中' },
  { key: 'l', val: '低' },
]

const demandPriorityObj = {
  'h': '高',
  'm': '中',
  'l': '低',
}

const isOrNot = {
  '0': '否',
  '1': '是'
}

export {
  boardTitle,
  demandTypeArr,
  demandTypeObj,
  demandPriorityArr,
  demandPriorityObj,
  isOrNot,
}