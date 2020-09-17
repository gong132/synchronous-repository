import React, { Component, Fragment } from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import { TableColumnHelper } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import budget_log from '@/assets/icon/modular_czrz.svg';
import budget_xq from '@/assets/icon/modular_xq.svg';
import flowIcon from '@/assets/icon/xqxq_lcjd.svg'
import sdIcon from '@/assets/icon/modular_xtxq.svg'
import msgIcon from '@/assets/icon/modular_xx.svg'
import editIcon from '@/assets/icon/Button_bj.svg';
import psIcon from '@/assets/icon/nav_xqgl.svg'
import apsIcon from '@/assets/icon/nav_xqgl_hover.svg'

import { Steps, Descriptions } from 'antd'
import styles from '../index.less'

const DescriptionItem = Descriptions.Item

class Detail extends Component {

  handleRenderStepIcon = (status, index) => {
    // if (status === 'finish') return <CustomIcon type={completedIcon} size="middle" />
    // if (status === 'process') return <CustomIcon type={progressIcon} size="middle" />
    if (status === 'wait') return <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#606265',
        fontSize: 12,
        backgroundColor: '#e5e9f2'
      }}
    >
      {index + 1}
    </div>
  }

  render() {
    const btnStyle = {
      border: '1px solid #D63649',
      borderRadius: '2px',
      color: '#D63649'
    }

    // const judgeCurrentDot = (allStoryStatus, obj) => {
    //   if (taskStatus.length === 0) return 0
    //   const i = _.findIndex(allStoryStatus, o => String(o.statusId) === String(obj.statusId))
    //   return i
    // }

    const detailList = [
      { span: 3, required: false, name: '标题', value: 'name', style: { whiteSpace: 'pre' } },
      { span: 1, required: false, name: '需求编号', value: 'number' },
      { span: 1, required: false, name: '状态', value: 'number' },
      { span: 1, required: false, name: '预算编号', value: 'budgetNumber' },
      { span: 1, required: false, name: '需求类型', value: 'clusterName' },
      { span: 1, required: false, name: '优先级', value: 'projectName' },
      { span: 1, required: false, name: '提出人', value: 'providerCompanyName' },
      { span: 1, required: false, name: '受理团队', value: 'deptName' },
      { span: 1, required: false, name: '受理人', value: 'firstOfferAmount' },
      { span: 1, required: false, name: '是否沟通', value: 'transactionAmount' },
      { span: 1, required: false, name: '期望完成日期', value: 'headerName' },
      { span: 1, required: false, name: '计划上线时间', value: 'headerGroupName' },
      { span: 1, required: false, name: '状态', value: 'signingTime' },
      { span: 1, required: false, name: '项目编号', value: 'userName' },
      { span: 1, required: false, name: '创建人', value: 'createTime' },
      { span: 1, required: false, name: '创建时间', value: 'projectCheckTime' },
      { span: 3, required: false, name: '需求描述', value: 'freeDefendDate', dataIndex: 'description' },
      { span: 3, required: false, name: '附件', value: 'defendPayTime' },
    ];

    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间', { width: '100px' }),
    ];

    return (
      <Fragment>
        <div className='yCenter-between'>
          <CustomBtn type='create' title='下一节点' />
          <div className='yCenter'>
            <CustomBtn type='others' title='关闭' style={{ ...btnStyle, marginRight: '16px' }} />
            <CustomBtn type='others' title='打回' style={btnStyle} />
          </div>
        </div>
        <GlobalSandBox
          title='流程进度'
          img={flowIcon}
        >
          <Steps
            size='small'
            style={{ width: '100%' }}
            className={styles.stepSet}
            progressDot={(dot, { status, index }) => (
              this.handleRenderStepIcon(status, index)
            )}
          // current={
          //   judgeCurrentDot(allStoryStatus, curStatus)
          // }
          >
            {/* {allStoryStatus && allStoryStatus.length > 0 && allStoryStatus.map((v, index) => (
              <Step
                key={v.statusId}
                title={
                  <div className={styles.step}>
                    {v.statusName}
                  </div>
                }
                description={
                  taskStatus[curIndex(v)] ?
                    <div className={styles.stepContent}>
                      <div className={styles.stepContent_userName} title={taskStatus[curIndex(v)].userName}>{taskStatus[curIndex(v)].userName}</div>
                      <div title={taskStatus[curIndex(v)].createTime}>{taskStatus[curIndex(v)].createTime}</div>
                    </div>
                    : null
                }
              />
            ))} */}
          </Steps>
        </GlobalSandBox>
        <GlobalSandBox
          title='需求详情'
          img={budget_xq}
          optNode={
            <div>
              <OptButton
                style={{
                  backgroundColor: 'white',
                  color: '#B0BAC9',
                  borderColor: '#B0BAC9'
                }}
                disabled
                img={psIcon}
                text="已提交OA技术评审"
              />
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                img={apsIcon}
                text="提交OA技术评审"
              />
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                img={editIcon}
                text="编辑"
              />
            </div>
          }
        >
          <Descriptions column={3} bordered className={styles.formatDetailDesc}>
            {detailList.map((v, i) => (
              <DescriptionItem
                key={i.toString()}
                span={v.span}
                label={
                  <>
                    {v.required && <span style={{ color: 'red' }}>*</span>}
                    {v.name}
                  </>
                }
              >
                {v.dataIndex === 'description' ? (
                  /* eslint-disable */
                  <div
                    className="infoDescription"
                    style={{ border: 0 }}
                    dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                  /> /* eslint-disable */
                ) : (
                    <div style={v.style}>{v.value}</div>
                  )}
              </DescriptionItem>
            ))}
          </Descriptions>
        </GlobalSandBox>
        <GlobalSandBox
          title='需求详情'
          img={budget_xq}
          optNode={
            <div>
              <OptButton
                style={{
                  backgroundColor: 'white',
                  color: '#B0BAC9',
                  borderColor: '#B0BAC9'
                }}
                disabled
                img={psIcon}
                text="已提交OA审批"
              />
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                img={apsIcon}
                text="提交OA审批"
              />
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                img={editIcon}
                text="编辑"
              />
            </div>
          }
        >

        </GlobalSandBox>
        <GlobalSandBox
          title='系统需求'
          img={sdIcon}
        >

        </GlobalSandBox>
        <GlobalSandBox
          title='评论'
          img={msgIcon}
        >

        </GlobalSandBox>
        <GlobalSandBox img={budget_log} title="操作日志">
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
          // data={logList}
          // loading={loadingQueryLogData}
          // onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}

export default Detail