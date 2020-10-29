import React, { FC } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Footer } from "../../../components/Footer";
import { H2 } from "../../../components/H2";
import { Head } from "../../../components/Head";
import { MainHeading } from "../../../components/MainHeading";
import { NavHeader } from "../../../components/NavHeader";
import { Navigation } from "../../../components/Navigation";
import { PageLayout } from "../../../components/PageLayout";
import { ResponsiveTable } from "../../../components/Table";
import {
  User,
  useGetWorkspaceWithMembersQuery,
} from "../../../lib/generated/graphql";
import withUrqlClient from "../../../lib/withUrqlClient";

const PageContent = styled.section`
  flex-grow: 3;
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 10%;
  padding-right: 10%;
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  `}
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const nameCell: FC<User> = ({ name }) => <div>{name}</div>;
const emailAddressCell: FC<User> = ({ emailAddress }) => <a>{emailAddress}</a>;

const WorkspaceMembersPage: NextPage = () => {
  const router = useRouter();
  const { workspaceId } = router.query;
  const id = (workspaceId || "unknown").toString();

  const [{ data, fetching, error }] = useGetWorkspaceWithMembersQuery({
    variables: { id },
  });

  const workspaceTitle = (!fetching && data?.workspace.title) || "Loading...";

  return (
    <>
      <Head title={workspaceTitle} />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation workspaceId={id} workspaceTitle={workspaceTitle} />
          <PageContent>
            <MainHeading>Workspace members</MainHeading>
            <H2 title="This is a list of all workspace members." />
            {error && <p> Oh no... {error?.message} </p>}
            <>
              {data && (
                <ResponsiveTable
                  tableHeading="Admins"
                  columns={[
                    { name: "Name of user", content: nameCell },
                    { name: "Email", content: emailAddressCell },
                  ]}
                  data={data.workspace.admins as User[]}
                />
              )}
              {data && (
                <ResponsiveTable
                  tableHeading="Members"
                  columns={[
                    { name: "Name of User", content: nameCell },
                    { name: "Email", content: emailAddressCell },
                  ]}
                  data={data.workspace.members as User[]}
                />
              )}
            </>
          </PageContent>
        </ContentWrapper>
        <Footer />
      </PageLayout>
    </>
  );
};

export default withUrqlClient(WorkspaceMembersPage);
