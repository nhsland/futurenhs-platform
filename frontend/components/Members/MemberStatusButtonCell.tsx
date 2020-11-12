import React, { FC } from "react";

import { Button } from "nhsuk-react-components";
import { OperationContext, OperationResult } from "urql";

import {
  User,
  WorkspaceMembership,
  MembershipChange,
  Exact,
  ChangeWorkspaceMembershipMutation,
} from "../../lib/generated/graphql";

type MutationError = {
  user: User;
  error?: string | undefined;
} | null;

type ButtonCellProps = {
  user: User;
  workspaceId: string;
  newRole: WorkspaceMembership;
  changeMembership: (
    variables?:
      | Exact<{
          input: MembershipChange;
        }>
      | undefined,
    context?: Partial<OperationContext> | undefined
  ) => Promise<OperationResult<ChangeWorkspaceMembershipMutation>>;
  mutatationError: MutationError;
  setMutatationError: React.Dispatch<React.SetStateAction<MutationError>>;
};

export const MemberStatusButtonCell: FC<ButtonCellProps> = ({
  user,
  workspaceId,
  newRole,
  changeMembership,
  setMutatationError,
  mutatationError,
}) => (
  <>
    <Button
      secondary
      onClick={async () => {
        const result = await changeMembership({
          input: {
            workspace: workspaceId,
            user: user.id,
            newRole,
          },
        });
        setMutatationError({
          user,
          error: result.error?.message,
        });
      }}
    >
      {newRole === WorkspaceMembership.Admin
        ? "Make Administrator"
        : "Make Member"}
    </Button>
    {mutatationError?.user.id === user.id && mutatationError?.error && (
      <p> Oh no... {mutatationError.error} </p>
    )}
  </>
);
