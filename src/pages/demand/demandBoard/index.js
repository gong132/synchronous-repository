import React, { Component, Fragment } from 'react'
import { Empty, Dropdown, Icon, Menu, Spin, Modal, message } from 'antd'
import { connect } from 'dva'
import { router } from 'umi'
import { BOARD_TITLE } from '../util/constant'
// import InfiniteScroll from 'react-infinite-scroller'
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import _ from 'lodash';
import EditModal from '../components/createModal'
import AppointModal from '../components/appointModal'
import focusIcon from '@/assets/icon/sc.svg'
import { getUserInfo } from '@/utils/utils'
// import moment from 'moment';
import styles from '../index.less'

const grid = 1;
const getItemStyle = (isDragging, draggableStyle) => ({
  // 一些基本的风格，使项目看起来更好一点
  userSelect: 'none',
  // width: 250,
  // 将样式应用到拖动面板上
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
  width: 250,
  // height: '76vh',
  // overflowY: 'auto'
});
@connect(({ demand, loading }) => ({
  demandBoard: demand.demandBoard,
  loadingQueryBoard: loading.effects['demand/queryDemandBoard']
}))
class DemandBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iHeight: 0, // 看板整体高度
      ciHeight: 0, // 每列下的高度
      showEditModal: false,
      propValue: {},
      showAppointModal: false,
      appointModalTitle: '指派关注人',
      demandId: ''
    }
  }

  componentDidMount() {
    const dragDom = document.getElementById('dragContext')
    let iTop = 0
    const { clientHeight } = document.body
    iTop = dragDom.offsetTop
    this.setState({
      iHeight: clientHeight - iTop - 88,
      ciHeight: clientHeight - iTop - 52 - 11 - 100
    })
  }

  handleViewDetail = (item) => {
    const { id, demandNumber, type } = item
    // router.push({
    //   pathname: '/survey',
    //   query: {
    //     t: item.title,
    //     no: demandNumber
    //   }
    // });
    let pathname = '/demand/generalDemand/detail'
    if(type === 'p') {
      pathname='/demand/projectDemand/detail'
    }
    router.push({
      pathname,
      query: {
        id,
        no: demandNumber
      }
    });
  };

  stopPropogation = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      window.event.cancelBubble === true;
    }
  }

  handleViewModal = (bool, val) => {
    this.setState({
      showEditModal: bool,
      propValue: val,
    })
  }

  handleViewAppointModal = (bool, recordValue = {}, title) => {
    this.setState({
      showAppointModal: bool,
      demandId: recordValue.id,
      appointModalTitle: title
    })
  }

  renderBoardMenu = (record, boardId) => {
    const { attention, creator, receiverName } = record
    const { userInfo={} } = getUserInfo()
    const { userName, roleName } = userInfo

    return (
      <Menu onClick={({ item, key, keyPath, domEvent }) => this.quickResolveStory(item, key, keyPath, domEvent, record)}>
        {((boardId === 2 && roleName === '团队经理')
          || (boardId === 3 || boardId === 5 || boardId === 6 || boardId === 7 || boardId === 10))
          && <Menu.Item key='appointFocus'>指派关注人</Menu.Item>
        }
        {(boardId === 2 || boardId === 3)
          && roleName === '团队经理'
          && <Menu.Item key='appointAccept'>指派受理人</Menu.Item>
        }
        {(((boardId === 1 || boardId === 3 || boardId === 2)
          && creator === userName)
          || ((boardId === 4 || boardId === 5) && receiverName === userName))
          && <Menu.Item key='edit'>编辑</Menu.Item>
        }
        {boardId === 3
          && <Menu.Item key='accept'>受理</Menu.Item>
        }
        {(boardId === 1 || boardId === 2 || boardId === 3)
          && creator === userName
          && <Menu.Item key='del'>删除</Menu.Item>
        }
        {((boardId === 1 && creator === userName)
          || (boardId === 3 || boardId === 2 || boardId === 5 || boardId === 6 || boardId === 7 || boardId === 10))
          && (
            attention === 1 ?
              <Menu.Item key='cancelFocus'>取消关注</Menu.Item>
              : <Menu.Item key='focus'>关注</Menu.Item>
          )
        }
      </Menu>
    )
  }

  // 删除
  deleteDemand = params => {
    this.props
      .dispatch({
        type: 'demand/updateDemand',
        payload: {
          id: String(params.id),
          isDelete: 1
        },
      })
      .then(res => {
        if (res) {
          this.props.handleQueryBoard()
        }
      });
  };

  // 关注
  handleFocusDemand = (id) => {
    this.props.dispatch({
      type: 'demand/focusDemand',
      payload: {
        type: 0,
        demandId: Number(id)
      }
    }).then(res => {
      if (res) {
        this.props.handleQueryBoard()
      }
    });
  }

  // 取消关注
  handleUnFocusDemand = (id) => {
    this.props.dispatch({
      type: 'demand/unFocusDemand',
      payload: {
        demandId: Number(id)
      }
    }).then(res => {
      if (res) {
        this.props.handleQueryBoard()
      }
    });
  }

  // 受理需求
  handleReceiverDemand = (id) => {
    const { userInfo } = getUserInfo()
    const { userId, userName } = userInfo
    this.props.dispatch({
      type: 'demand/receiverDemand',
      payload: {
        id: Number(id),
        receiverId: String(userId),
        receiverName: userName
      }
    }).then(res => {
      if (res) {
        this.props.handleQueryBoard()
      }
    });
  }

  // 拖拽变更状态
  handleDragDemand = (params) => {
    this.props.dispatch({
      type: 'demand/dragDemand',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        this.props.handleQueryBoard()
      }
    });
  }

  // 取消关注

  quickResolveStory = async (item, key, keyPath, domEvent, editValue) => {
    if (domEvent.stopPropagation) {
      domEvent.stopPropagation()
    } else {
      window.event.cancelBubble === true;
    }
    switch (key) {
      case 'focus':
        this.handleFocusDemand(editValue.id)
        break;
      case 'cancelFocus':
        this.handleUnFocusDemand(editValue.id)
        break;
      case 'edit':
        this.handleViewModal(true, editValue)
        break;
      case 'del':
        Modal.confirm({
          content: '确定删除当前需求？',
          onOk: () => this.deleteDemand(editValue)
        })
        // this.deleteDemand(editValue)
        break;
      case 'appointFocus':
        this.handleViewAppointModal(true, editValue, '指派关注人')
        break;
      case 'appointAccept':
        this.handleViewAppointModal(true, editValue, '指派受理人')
        break;
      case 'accept':
        this.handleDragDemand({ status: '4', demandId: editValue.id })
        break;
      default:
        break;
    }
  }

  // 拖拽处理
  onDragEnd = result => {
    const { userInfo: { roleName } } = getUserInfo()
    const { source, destination, draggableId } = result
    if (destination === null) {
      console.log('不允许******************')
      // message.warning('这不是一次有效的操作！')
      return true
    }
    const params = {
      demandId: Number(draggableId)
    }
    if (source.droppableId === '2' && destination.droppableId === '3') {
      // 受理
      params.status = '3'
      if (roleName !== '团队经理') {
        message.warning('只有团队经理可执行该操作！')
        return false
      }
      this.handleDragDemand(params)
      return true
    }
    if (source.droppableId === '3' && destination.droppableId === '4') {
      params.status = '4'
      this.handleDragDemand(params)
      return true
    }
    // message.warning('这不是一次有效的操作！')
    console.log('不允许******************')
    return true
  }

  render() {
    const { iHeight, ciHeight, showEditModal, propValue, showAppointModal, demandId, appointModalTitle } = this.state
    const { demandBoard, handleQueryBoard, loadingQueryBoard } = this.props
    const editModalProps = {
      visibleModal: showEditModal,
      modalTitle: '编辑',
      handleViewModal: this.handleViewModal,
      handleQueryBoard,
      recordValue: propValue,
    }

    const appointModalProps = {
      handleViewModal: this.handleViewAppointModal,
      handleQueryBoard,
      visible: showAppointModal,
      demandId,
      title: appointModalTitle,
    }
    const arr = _.isEmpty(demandBoard) ? BOARD_TITLE : demandBoard
    return (
      <div
        className={styles.drag}
        style={{
          height: iHeight
        }}
        id='dragContext'
      >
        {showEditModal && <EditModal {...editModalProps} />}
        {showAppointModal && <AppointModal {...appointModalProps} />}
        <DragDropContext onDragEnd={this.onDragEnd}>
          {!_.isEmpty(arr) && arr.map((droppableItem) => (
            <div
              key={droppableItem.boardId}
              className={styles.spectaculars}
            >
              <Fragment>
                <div className={styles.cardTitle}>
                  {!_.isEmpty(droppableItem.demandList)
                    ? <Fragment><span>{droppableItem.name}</span><span className={styles.cardTitle_count}>({droppableItem.demandList.length})</span></Fragment>
                    : <span>{droppableItem.name}</span>}
                </div>
                <div
                  className={styles.spectaculars__set}
                  style={{ height: ciHeight }}
                >
                  {droppableItem.boardId === 2 || droppableItem.boardId === 3 || droppableItem.boardId === 4
                    ? <Spin spinning={loadingQueryBoard}>
                      <Droppable
                        droppableId={String(droppableItem.boardId)}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={
                              getListStyle(
                                snapshot.isDraggingOver,
                              )}
                          >

                            <div style={{ height: ciHeight, overflowY: 'auto' }}>
                              {_.isArray(droppableItem.demandList) && !_.isEmpty(droppableItem.demandList) ? droppableItem.demandList.map((item, i) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={String(item.id)}
                                  index={i}
                                >
                                  {(providedd, snapshott) => (
                                    <div
                                      ref={providedd.innerRef}
                                      {...providedd.draggableProps}
                                      {...providedd.dragHandleProps}
                                      style={getItemStyle(
                                        snapshott.isDragging,
                                        providedd.draggableProps.style
                                      )}
                                    >
                                      <div
                                        className={styles.dragBoard}
                                      >
                                        <div className={styles.dragBoard_firstLine}>
                                          <div
                                            onClick={() => this.handleViewDetail(item)}
                                            className={styles.dragBoard_firstLine_no}
                                          >
                                            {item.demandNumber}
                                          </div>
                                          <div className={styles.dragBoard_firstLine_menu}>
                                            <div
                                              onClick={(e) => this.stopPropogation(e)}
                                            >
                                              <Dropdown
                                                overlay={this.renderBoardMenu(item, droppableItem.boardId)}
                                                trigger={['click']}
                                                onClick={(e) => this.stopPropogation(e)}
                                              >
                                                <Icon
                                                  type='menu'
                                                  onClick={(e) => this.stopPropogation(e)}
                                                />
                                              </Dropdown>
                                            </div>
                                          </div>
                                        </div>
                                        <div className={styles.dragBoard_secondLine}>
                                          {item.attention === 1 && <Icon component={focusIcon} />}
                                          <span title={item.title}>{item.title}</span>
                                        </div>
                                        <div className={styles.dragBoard_thirdLine}>
                                          <div className={styles.dragBoard_thirdLine_time}>
                                            {`${item.creator}于${item.createTime}提交`}
                                          </div>
                                          {/* <div className={styles.dragBoard_thirdLine_type}>
                                              {item.type === 'p'
                                                ? '项目'
                                                : '一般需求'}
                                            </div> */}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </Spin>
                    : <Spin spinning={loadingQueryBoard}>
                      <div style={{ height: ciHeight, overflowY: 'auto' }}>
                        {_.isArray(droppableItem.demandList) && !_.isEmpty(droppableItem.demandList) ? droppableItem.demandList.map((item, i) => (
                          <div
                            className={styles.dragBoard}
                          >
                            <div className={styles.dragBoard_firstLine}>
                              <div
                                onClick={() => this.handleViewDetail(item)}
                                className={styles.dragBoard_firstLine_no}
                              >
                                {item.demandNumber}
                              </div>
                              <div className={styles.dragBoard_firstLine_menu}>
                                <div
                                  onClick={(e) => this.stopPropogation(e)}
                                >
                                  <Dropdown
                                    overlay={this.renderBoardMenu(item, droppableItem.boardId)}
                                    trigger={['click']}
                                    onClick={(e) => this.stopPropogation(e)}
                                  >
                                    <Icon
                                      type='menu'
                                      onClick={(e) => this.stopPropogation(e)}
                                    />
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className={styles.dragBoard_secondLine}>
                              {item.attention === 1 && <Icon component={focusIcon} />}
                              <span title={item.title}>{item.title}</span>
                            </div>
                            <div className={styles.dragBoard_thirdLine}>
                              <div className={styles.dragBoard_thirdLine_time}>
                                {`${item.creator}于${item.createTime}提交`}
                              </div>
                              {/* <div className={styles.dragBoard_thirdLine_type}>
                                {item.type === 'p'
                                  ? '项目'
                                  : '一般需求'}
                              </div> */}
                            </div>
                          </div>
                        )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                      </div>
                    </Spin>
                  }
                </div>
              </Fragment>
            </div>
          ))}
        </DragDropContext>
      </div>
    )
  }
}

export default DemandBoard
