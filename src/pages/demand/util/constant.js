// 需求描述默认模板
const DEFAULT_DESC =
  '<h4>功能描述：</h4><span>简要描述要实现的功能</span><h4>范围和用户：</h4><span>明确的应用范围和目标用户使得团队有的放矢。</span><h4>预期效益：</h4><span> 价值和可量化ROI或提升数字，需要明确的统计公式，如无法统计，则需要提数据埋点需求，通过数据量化收益。</span> ';

// 看板状态：暂存中，待指派、待受理、讨论中，待拆分，story技术评估，开发中，测试中，上线
const BOARD_TITLE = [
  {
    name: '暂存中',
    boardId: 1,
    demandList: [],
  },
  {
    name: '待指派',
    boardId: 2,
    demandList: [],
  },
  {
    name: '待受理',
    boardId: 3,
    demandList: [],
  },
  {
    name: '讨论中',
    boardId: 4,
    demandList: [],
  },
  {
    name: '待拆分',
    boardId: 5,
    demandList: [],
  },
  {
    name: 'story技术评估',
    boardId: 6,
    demandList: [],
  },
  {
    name: '开发中',
    boardId: 7,
    demandList: [],
  },
  {
    name: '测试中',
    boardId: 8,
    demandList: [],
  },
  {
    name: '上线',
    boardId: 9,
    demandList: [],
  },
  {
    name: '取消',
    boardId: 10,
    demandList: [],
  },
];

const BOARD_TITLE_OBJ = {
  '1': '暂存中',
  '2': '待指派',
  '3': '待受理',
  '4': '讨论中',
  '5': '待拆分',
  '6': 'story技术评估',
  '7': '开发中',
  '8': '测试中',
  '9': '上线',
  '10': '取消',
};

// 详情页流程
const FLOW_STATUS = [
  { label: '暂存中', value: '0', userName: '胖胖hhhhhhhhhh', time: '2020-09-17' },
  { label: '待指派', value: '1' },
  { label: '待受理', value: '2' },
  { label: '讨论中', value: '3' },
  { label: '待拆分', value: '4' },
  { label: 'Story技术评估', value: '5' },
  { label: '开发中', value: '6' },
  { label: '上线', value: '7' },
];

// 需求类型
const DEMAND_TYPE_ARR = [
  { key: 'p', val: '项目需求（需要OA技术评审）' },
  { key: 'u', val: '一般需求（需要通过OA审批）' },
];

const DEMAND_TYPE_OBJ = {
  p: '项目需求（需要OA技术评审）',
  u: '一般需求（需要通过OA审批）',
};

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

const IS_OR_NOT = {
  n: '否',
  y: '是',
};

// 快速搜索
const QUICK_SELECT = [
  {key: 'myDemand', value: '我的需求'},
  {key: 'myCreated', value: '我创建的'},
  {key: 'myAccepted', value: '我受理的'},
  {key: 'myFocused', value: '我关注的'},
  {key: 'myTeam', value: '我团队的'},
  {key: 'myDept', value: '我部门的'},
]

const QUICK_SELECT_DICT = {
  'myDemand': '我的需求',
  'myCreated': '我创建的',
  'myAccepted': '我受理的',
  'myFocused': '我关注的',
  'myTeam': '我团队的',
  'myDept': '我部门的',
}

export {
  BOARD_TITLE,
  DEMAND_TYPE_ARR,
  DEMAND_TYPE_OBJ,
  DEMAND_PRIORITY_ARR,
  DEMAND_PRIORITY_OBJ,
  IS_OR_NOT,
  DEFAULT_DESC,
  FLOW_STATUS,
  BOARD_TITLE_OBJ,
  QUICK_SELECT,
  QUICK_SELECT_DICT
};

export const STORY_TYPE = [
  { key: 1, value: '新增' },
  { key: 2, value: '优化' },
  { key: 3, value: '变更' },
];

export const STORY_PRIORITY = [
  { key: '最高', value: '最高' },
  { key: '高', value: '高' },
  { key: '中', value: '中' },
  { key: '低', value: '低' },
  { key: '最低', value: '最低' },
];

export const DEMAND_STATUS = [
  { key: '1', value: '暂存中' },
  { key: '2', value: '待指派' },
  { key: '3', value: '待受理' },
  { key: '4', value: '讨论中' },
  { key: '5', value: '待拆分' },
  { key: '6', value: 'story技术评估' },
  { key: '7', value: '开发中' },
  { key: '8', value: '测试中' },
  { key: '9', value: '上线' },
];
export const STORY_STATUS = [
  { key: '1', value: '需求分析中' },
  { key: '2', value: '需求已确定' },
  { key: '3', value: '开发中' },
  { key: '4', value: '测试提测' },
  { key: '5', value: '测试中' },
  { key: '6', value: '测试完成' },
  { key: '7', value: '已上线' },
  { key: '8', value: '暂停' },
  { key: '9', value: '取消' },
  { key: '10', value: '关闭' },
];
export const DEMAND_LEVEL = [
  { key: '1', value: '一般' },
  { key: '2', value: '紧急重要' },
];
// 需求类型
export const DEMAND_TYPE = [
  { key: 'p', value: '项目需求' },
  { key: 'u', value: '一般需求' },
];

// 下拉
export const DEMAND_GROUP = [
  { key: '1', value: '我的需求' },
  { key: '2', value: '我创建的' },
  { key: '3', value: '我受理的' },
  { key: '4', value: '我关注的' },
  { key: '5', value: '我团队的' },
  { key: '6', value: '我部门的' },
];

//
export const RISK_CONTROL = [
  { key: 'y', value: '是' },
  { key: 'n', value: '否' },
];
