import React, { Component } from 'react';
// import { boardTitle } from '../util/constant'
// import InfiniteScroll from 'react-infinite-scroller'
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from 'react-beautiful-dnd';
// import _ from 'lodash';
// import moment from 'moment';
// import styles from './storyBoard.less'

const grid = 1;
const getItemStyle = (isDragging, draggableStyle) => ({
  // 一些基本的风格，使项目看起来更好一点
  userSelect: 'none',
  // width: 250,
  // 将样式应用到拖动面板上
  ...draggableStyle,
});
console.log(getItemStyle);
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
  width: 250,
  // height: '76vh',
  // overflowY: 'auto'
});
console.log(getListStyle);
class DemandBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iHeight: 0, // 看板整体高度
      ciHeight: 0, // 每列下的高度
    };
  }

  componentDidMount() {
    const dragDom = document.getElementById('dragContext');
    let iTop = 0;
    const { clientHeight } = document.body;
    iTop = dragDom.offsetTop;
    this.setState({
      iHeight: clientHeight - iTop,
      ciHeight: clientHeight - iTop - 52 - 11,
    });
  }

  render() {
    const { iHeight, ciHeight } = this.state;
    console.log(iHeight, ciHeight);
    return <div>需求看板</div>;
  }
}

export default DemandBoard;
