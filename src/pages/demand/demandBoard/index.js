import React, { Component, Fragment } from 'react'
import { boardTitle } from '../util/constant'
// import InfiniteScroll from 'react-infinite-scroller'
import {
  DragDropContext,
  // Droppable,
  // Draggable,
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
                {/* <div
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
                          {_.isArray(droppableItem.sub) && !_.isEmpty(droppableItem.sub) ? droppableItem.sub.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={String(item.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  <div
                                    className={this.handleRenderCardStyle(item.overTime)}
                                    onClick={() => this.goToStoryDetail(item)}
                                  >

                                    {item.taskVOList.length > 0
                                      ? <Fragment>
                                        <div className={styles.unusualBox}>
                                          <Popover
                                            content={
                                              this.renderUnusualContent(item.taskVOList, true)
                                            }
                                            trigger='hover'
                                          >
                                            <div className={styles.unusualBox__tooTip}>
                                              异常单
                                                      <span style={{ display: 'inline-block', marginLeft: 8 }}>
                                                ( {this.renderUnusualContent(item.taskVOList)} )
                                                      </span>
                                            </div>
                                          </Popover>
                                          <div className={styles.unusualBox__items__content_id}>
                                            {item.storyNo}
                                          </div>
                                          {droppaleItem.statusCode !== 11 && <div
                                            onClick={(e) => this.stopPropogation(e)}
                                            className={styles.unusuallittleMenu}
                                          >
                                            <Dropdown
                                              overlay={this.renderBoardMenu(item, item.collectId)}
                                              trigger='click'
                                              onClick={(e) => this.stopPropogation(e)}
                                            >
                                              <Icon type='menu'
                                                onClick={(e) => this.stopPropogation(e)}
                                              />
                                            </Dropdown>
                                          </div>}
                                          <div className={styles.unusualBox__items__content_flex}>
                                            {
                                              Boolean(item.collectId) && <Icon className={styles.littleStar} type='star' theme='filled' />
                                            }
                                            <div title={item.storyTitle} className={styles.unusualBox__items__content_title}>
                                              {item.storyTitle ? item.storyTitle.length > 15 ? `${item.storyTitle.substring(0, 15)}...` : item.storyTitle : '--'}
                                            </div>
                                          </div>
                                          <div className={secondFlexWrapper}>
                                            <div className={styles.unusualBox__items__content_exhibitor}>
                                              {item.cUserName || '--'} 于 {moment(item.createTime).format('YYYY-MM-DD') || '--'} 提交
                                                          </div>
                                          </div>
                                        </div>
                                      </Fragment>
                                      : <Fragment>
                                        <div
                                          className={styles.spectaculars__items__content}>
                                          <div className={styles.spectaculars__items__content_id}>
                                            {item.storyNo}
                                          </div>
                                          {droppaleItem.statusCode !== 11 && <div
                                            className={styles.littleMenu}
                                            onClick={(e) => this.stopPropogation(e)}
                                          >
                                            <Dropdown
                                              overlay={this.renderBoardMenu(item, item.collectId)}
                                              trigger='click'
                                            >
                                              <Icon type='menu'
                                                onClick={(e) => this.stopPropogation(e)}
                                              />
                                            </Dropdown>
                                          </div>}
                                          <div className={styles.spectaculars__items__content_flex}>
                                            {
                                              Boolean(item.collectId) && <Icon className={styles.littleStar} type='star' theme='filled' />
                                            }
                                            <div title={item.storyTitle} className={styles.spectaculars__items__content_title}>
                                              {item.storyTitle ? item.storyTitle.length > 15 ? `${item.storyTitle.substring(0, 15)}...` : item.storyTitle : '--'}
                                            </div>
                                          </div>
                                          <div className={secondFlexWrapper}>
                                            <div className={styles.spectaculars__items__content_exhibitor}>
                                              {item.cUserName || '--'} 于 {moment(item.createTime).format('YYYY-MM-DD') || '--'} 提交
                                                        </div>
                                          </div>
                                        </div>
                                      </Fragment>}
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
                </div> */}
              </Fragment>
            </div>
          ))}
        </DragDropContext>
      </div>
    )
  }
}

export default DemandBoard
