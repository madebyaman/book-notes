import { NextPage } from 'next';
import { Layout } from '../../components/Dashboard';
import { Profile } from '../../components/Profile';

const Dashboard: NextPage = function () {
  return (
    <>
      <Layout>
        <Profile />
      </Layout>
    </>
  );
};

export default Dashboard;
