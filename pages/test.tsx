import { SidebarLayout } from '../components/Layout';

const Sidebar = () => {
  return (
    <>
      <h1>Aman Thakur Book Notes</h1>
      <p>@amanthakur</p>
    </>
  );
};

const Test = () => {
  return (
    <SidebarLayout sidebar={<Sidebar />}>
      <h2>A guide to the good life</h2>
    </SidebarLayout>
  );
};

export default Test;
