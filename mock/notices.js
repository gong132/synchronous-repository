import __ from "lodash";


export default {
  'POST /api/notices': (req, res) => {
    const { pageSize, currentPage } = req.query;
    const list = [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: '1',
        account: 53453245.87,
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: '你推荐的 曲妮妮 已通过第三轮面试',
        datetime: '2017-08-08',
        type: '0',
        account: 12345,
      },
      {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: '这种模板可以区分多种通知类型',
        datetime: '2017-08-07',
        read: true,
        type: '3',
        account: 53245.49,
      },
      {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: '左侧图标用于区分不同的类型',
        datetime: '2017-08-07',
        type: '2',
        account: 123,
      },
      {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '内容不要超过十二个字,超出时自动截断',
        datetime: '2017-08-07',
        type: '1',
        account: 34234,
      },
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '曲丽丽 评论了你',
        description: '描述信息描述信息描述信息',
        datetime: '2017-08-07',
        type: '1',
        clickClose: true,
        account: 466,
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '朱偏右 回复了你',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: '2',
        clickClose: true,
        account: -356766,
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '标题',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: '1',
        clickClose: true,
        account: 24,
      },
      {
        id: '000000009',
        title: '任务名称',
        description: '任务需要在 2017-01-12 20:00 前启动',
        extra: '未开始',
        status: 'todo',
        type: '3',
        account: 336.033,
      },
      {
        id: '000000010',
        title: '第三方紧急代码变更',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '马上到期',
        status: 'urgent',
        type: '0',
        account: -234467.45,
      },
      {
        id: '000000011',
        title: '信息安全考试',
        description: '指派竹尔于 2017-01-09 前完成更新并发布',
        extra: '已耗时 8 天',
        status: 'doing',
        type: '3',
        account: 1355,
      },
      {
        id: '000000012',
        title: 'ABCD 版本发布',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '进行中',
        status: 'processing',
        type: '2',
        account: 132467987654,
      },
    ]
    const resErrData = {
      code: 500,
      msg: '请求失败',
      data: null,
    }
    if (!__.isNumber(pageSize * 1) || !__.isNumber(currentPage * 1)) {
      res.json(resErrData);
      return
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize > list.length ? list.length : currentPage * pageSize
    const transformList = () => {
      return {
        code: 200,
        msg: '请求成功',
        data: {
          datas: list.slice(startIndex,  endIndex),
          pageSize: pageSize,
          currentPage: currentPage - 1,
          total: list.length,
        }
      }
    }
    setTimeout(() => {
      res.json(transformList());
    }, 1000)
  },

  'POST /api/budget': (req, res) => {
    const { pageSize, currentPage } = req.query;
    const list = [
      {
        budgetId: '92077415863214785410',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785411',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785412',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785413',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785414',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785415',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785416',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785417',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785418',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785419',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785420',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785421',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785422',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
      {
        budgetId: '92077415863214785423',
        budgetName: '智能运维平台智能运维平台',
        reporter: '李易峰',
        reportTime: '2019-7-26 23:12:09',
        deptName: '李易峰',
        gather: '光大临售需求开发集群',
        expectStartTime: '2019-7-26 23:12:09',
        expectTotalAmount: 125527,
        expectHardwareAmount: 125527,
      },
    ]
    const resErrData = {
      code: 500,
      msg: '请求失败',
      data: null,
    }
    if (!__.isNumber(pageSize * 1) || !__.isNumber(currentPage * 1)) {
      res.json(resErrData);
      return
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize > list.length ? list.length : currentPage * pageSize
    const transformList = () => {
      return {
        code: 200,
        msg: '请求成功',
        data: {
          datas: list.slice(startIndex,  endIndex),
          pageSize: pageSize,
          currentPage: currentPage - 1,
          total: list.length,
        }
      }
    }
    setTimeout(() => {
      res.json(transformList());
    }, 1000)
  },
};


