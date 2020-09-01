import React, { Component } from 'react';
import { connect } from 'dva';

class GlobalHeaderRight extends Component {
  componentDidMount() {

  }
  render() {
    return (
      <div>111111111</div>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
