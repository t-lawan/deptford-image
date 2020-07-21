import * as React from "react";
import Environment from "../../Components/Environment/Environment";
import Layout from "../../Components/Layout/Layout";
import DataPrivacy from "../../Components/DataPrivacy/DataPrivacy";

const Home = () => {

  return (
    <Layout>
        <Environment />
        <DataPrivacy />
    </Layout>
  );
};

export default Home;
