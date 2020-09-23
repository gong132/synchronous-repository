import React, { Component, Fragment } from 'react'
import { Empty, Dropdown, Icon, Menu, Spin, Modal } from 'antd'
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
      demandId:''
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
    const { id, demandNumber } = item
    router.push({
      pathname: '/demand/myDemand/detail',
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

  handleViewAppointModal = (bool, recordValue) => {
    this.setState({
      showAppointModal: bool,
      demandId: recordValue.id
    })
  }

  renderBoardMenu = (record, boardId) => {
    const { collectId } = record
    return (
      <Menu onClick={({ item, key, keyPath, domEvent }) => this.quickResolveStory(item, key, keyPath, domEvent, record)}>
        {boardId !== 1 && <Menu.Item key='appointFocus'>指派关注人</Menu.Item>}
        {boardId === 2 && <Menu.Item key='appointAccept'>指派受理人</Menu.Item>}
        {(boardId === 1 || boardId === 3) && <Menu.Item key='edit'>编辑</Menu.Item>}
        {boardId === 3 && <Menu.Item key='accept'>受理</Menu.Item>}
        {(boardId === 1 || boardId === 2)
          && <Menu.Item key='del'>删除</Menu.Item>
        }
        {
          collectId ?
            <Menu.Item key='cancelFocus'>取消关注</Menu.Item>
            : <Menu.Item key='focus'>关注</Menu.Item>
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
          id: params.id,
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
        console.log('cancelFocus');
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
        this.handleViewAppointModal(true, editValue)
        break;
      case 'appointAccept':
        console.log('appointAccept')
        break;
      case 'accept':
        console.log('accept')
        break;
      default:
        break;
    }
  }






  render() {
    const { iHeight, ciHeight, showEditModal, propValue, showAppointModal, demandId } = this.state
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
        <DragDropContext>
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
                  <Spin spinning={loadingQueryBoard}>
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
                                              trigger='click'
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
                                        {item.title}
                                      </div>
                                      <div className={styles.dragBoard_thirdLine}>
                                        <div className={styles.dragBoard_thirdLine_time}>
                                          {`${item.creator}于${item.create_time}提交`}
                                        </div>
                                        <div className={styles.dragBoard_thirdLine_type}>
                                          {item.type === 'p'
                                            ? '项目'
                                            : '一般需求'}
                                        </div>
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
