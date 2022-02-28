import { NextPage } from 'next';
import { BookCards, Layout } from '../../components/Dashboard';

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
