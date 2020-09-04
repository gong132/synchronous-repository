import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, message, Checkbox } from 'antd';
import Login from '@/components/Login';
import styles from './login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, global, loading }) => ({
  login,
  global,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: false,
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked
    })
  }

  handleSubmit = (err, values) => {
    if (!err) {
      if (!values.username) {
        message.error('请输入用户名');
        return;
      }

      if (!values.password) {
        message.error('请输入密码');
        return;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          loginName: values.username,
          passWord: values.password,
        },
      }).then(result => {
        if (!result) return
        dispatch({
          type: 'global/queryCurrentUserInfo',
          payload: {
          },
        });
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { autoLogin } = this.state;
    return (
      <div className={styles.bossMain}>
        <div className={styles.main}>
          <Login
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <div className={styles.cusTabTitle}>欢迎登录需求管理平台</div>
            {login.status === 'error' &&
            !submitting &&
            this.renderMessage('请输入账号')}
            <div className={styles.labelStyle}>账号</div>
            <UserName name="username" placeholder="登录账号" />
            <div className={styles.labelStyle}>密码</div>
            <Password
              name="password"
              placeholder="登录密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />

            <Submit loading={submitting} className={styles.submitBtn}>
              登录
            </Submit>
            <div className={styles.cusAutoLogin}>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                自动登录
              </Checkbox>
            </div>
          </Login>
        </div>
      </div>
    );
  }
}

export default LoginPage;
