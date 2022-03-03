import { NextPage } from 'next';
import { BookCards } from '../../components/Dashboard';
import { DashboardLayout as Layout } from '../../components/Layout';

const Dashboard: NextPage = function () {
  return (
    <>
      <Layout>
        <BookCards />
      </Layout>
    </>
  );
};

export default Dashboard;
