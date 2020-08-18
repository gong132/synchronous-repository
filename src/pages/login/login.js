import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, message, Checkbox } from 'antd';
import Login from '@/components/Login';
import { LOGIN_ENTRY_TYPE } from '@/utils/constant';
import styles from './login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, global, loading }) => ({
  login,
  global,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: LOGIN_ENTRY_TYPE.SUPER,
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
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
          ...values,
          type,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.bossMain}>
        <div className={styles.main}>
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Tab key={LOGIN_ENTRY_TYPE.SUPER} tab="光大证券管理系统">
              <div className={styles.desc}>Management System</div>
              {login.status === 'error' &&
              login.type === LOGIN_ENTRY_TYPE.SUPER &&
              !submitting &&
              this.renderMessage('请输入账号')}
              <div className={styles.labelStyle}>用户名</div>
              <UserName name="username" placeholder="登录账号" />
              <div className={styles.labelStyle}>密码</div>
              <Password
                name="password"
                placeholder="登录密码"
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                自动登录
              </Checkbox>
            </div>
            <Submit loading={submitting} className={styles.submitBtn}>
              登录
            </Submit>
          </Login>
        </div>
      </div>
    );
  }
}

export default LoginPage;
