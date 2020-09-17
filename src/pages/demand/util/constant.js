// 需求描述默认模板
const defaultDescription = '<h4>功能描述：</h4><span>简要描述要实现的功能</span><h4>范围和用户：</h4><span>明确的应用范围和目标用户使得团队有的放矢。</span><h4>预期效益：</h4>< span > 价值和可量化ROI或提升数字，需要明确的统计公式，如无法统计，则需要提数据埋点需求，通过数据量化收益。</span> '

// 看板状态：暂存中，待指派、待受理、讨论中，待拆分，story技术评估，开发中，测试中，上线
const boardTitle = [
  {
    name: '暂存中',
    boardId: '0',
    sub:[
      {
        id: '1',
        demandNumber: 'D20200915-001',
        demandTitle: '需求001',
        createUser: '胖胖1号',
        createTime:'2020-09-15',
        demandType:'p'
      },
      {
        id: '2',
        demandNumber: 'D20200915-002',
        demandTitle: '需求002',
        createUser: '胖胖2号',
        createTime:'2020-09-15',
        demandType:'u'
      },
      {
        id: '3',
        demandNumber: 'D20200915-003',
        demandTitle: '需求003',
        createUser: '胖胖3号',
        createTime:'2020-09-15',
        demandType:'p'
      },
      {
        id: '4',
        demandNumber: 'D20200915-004',
        demandTitle: '需求004',
        createUser: '胖胖4号',
        createTime:'2020-09-15',
        demandType:'u'
      },
    ]
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
];

// 详情页流程
const flowStatus = [
  { label: '暂存中', value: '0' },
  { label: '待指派', value: '1' },
  { label: '待受理', value: '2' },
  { label: '讨论中', value: '3' },
  { label: '待拆分', value: '4' },
  { label: 'Story技术评估', value: '5' },
  { label: '开发中', value: '6' },
  { label: '上线', value: '7' },
]

// 需求类型
const demandTypeArr = [
  { key: 'p', val: '项目需求（需要OA技术评审）' },
  { key: 'u', val: '一般需求（需要通过OA审批）' },
];

const demandTypeObj = {
  p: '项目需求（需要OA技术评审）',
  u: '一般需求（需要通过OA审批）',
};

// 优先级
const demandPriorityArr = [
  { key: 'h', val: '高' },
  { key: 'm', val: '中' },
  { key: 'l', val: '低' },
];

const demandPriorityObj = {
  h: '高',
  m: '中',
  l: '低',
};

const isOrNot = {
  '0': '否',
  '1': '是',
};

export {
  boardTitle,
  demandTypeArr,
  demandTypeObj,
  demandPriorityArr,
  demandPriorityObj,
  isOrNot,
  defaultDescription,
  flowStatus,
};
