"use client";
import { InputModal } from "@/components/InputModal";
import { Button } from "@/components/ui/button";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  createWorkspace,
  getWorkspacesByOwner,
} from "@/features/workspace/actions";
import { useEffect, useState } from "react";
import { Workspace as WorkspaceType } from "@/lib/types";

export default function Workspace() {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      const result = await getWorkspacesByOwner(user.id || "unknown");
      setWorkspaces(result as unknown as WorkspaceType[]);
    };
    fetchWorkspaces();
  }, [user]);

  return (
    <div className="p-8">
      <Button onClick={() => setOpenModal(true)}>Create Workspace</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            id={workspace.id || ""}
            title={workspace.workspaceName}
            description={workspace.workspaceDesc || "No description provided."}
          />
        ))}
      </div>

      {openModal && (
        <InputModal
          setOpenModal={setOpenModal}
          title="Create New Workspace"
          firstInputLabel="Workspace Name"
          secondInputLabel="Description"
          btnLabel="Create"
          onSubmitAction={async (data) => {
            await createWorkspace({
              ownerId: user?.id || "unknown",
              workspaceName: data.field1,
              workspaceDesc: data.field2,
              members: [],
            });
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}
