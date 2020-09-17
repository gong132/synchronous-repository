import React, { Component, Fragment } from 'react'
import { boardTitle } from '../util/constant'
import { Empty } from 'antd'
// import InfiniteScroll from 'react-infinite-scroller'
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import _ from 'lodash';
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
console.log(getItemStyle)
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
  width: 250,
  // height: '76vh',
  // overflowY: 'auto'
});
console.log(getListStyle)
class DemandBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iHeight: 0, // 看板整体高度
      ciHeight: 0, // 每列下的高度
    }
  }

  componentDidMount() {
    const dragDom = document.getElementById('dragContext')
    let iTop = 0
    const { clientHeight } = document.body
    iTop = dragDom.offsetTop
    this.setState({
      iHeight: clientHeight - iTop,
      ciHeight: clientHeight - iTop - 52 - 11
    })
  }

  render() {
    const { iHeight, ciHeight } = this.state
    console.log(boardTitle, ciHeight)
    return (
      <div
        className={styles.drag}
        style={{
          height: iHeight
        }}
        id='dragContext'
      >
        <DragDropContext>
          {!_.isEmpty(boardTitle) && boardTitle.map((droppableItem, index) => (
            <div
              key={droppableItem.boardId}
              className={styles.spectaculars}
            >
              <Fragment>
                <div className={styles.cardTitle}>
                  {console.log(index)}
                  {droppableItem.name || '--'}
                </div>
                <div
                  className={styles.spectaculars__set}
                  style={{ height: ciHeight }}
                >
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
                          {_.isArray(droppableItem.sub) && !_.isEmpty(droppableItem.sub) ? droppableItem.sub.map((item, i) => (
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
                                  <div className={styles.dragBoard}>
                                    <div className={styles.dragBoard_firstLine}>
                                      <div className={styles.dragBoard_firstLine_no}>
                                        {item.demandNumber}
                                      </div>
                                      {/* <div className={styles.dragBoard_firstLine_menu}></div> */}
                                    </div>
                                    <div className={styles.dragBoard_secondLine}>
                                      {item.demandTitle}
                                    </div>
                                    <div className={styles.dragBoard_thirdLine}>
                                      <div className={styles.dragBoard_thirdLine_time}>
                                        {`${item.createUser}于${item.createTime}提交`}
                                      </div>
                                      <div className={styles.dragBoard_thirdLine_type}>
                                        {item.demandType === 'p'
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
