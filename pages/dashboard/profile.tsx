import { NextPage } from 'next';
import { DashboardLayout as Layout } from '../../components/Dashboard';
import { ProfilePreferences as Profile } from '../../components/Profile';

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
