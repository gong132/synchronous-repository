import { Button, Result } from 'antd';
import { router } from 'umi';

const NoMatchPage = () => (
  <Result
    status={403}
    title="403"
    subTitle="您没有当前页面权限!如需要,请联系网络管理员."
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        返回首页
      </Button>
    }
  />
);


export default NoMatchPage;
