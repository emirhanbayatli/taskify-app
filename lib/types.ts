export interface Comment {
  id?: string;
  taskId: string;
  author: Member;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}
export type Column = {
  id?: string;
  title: string;
  order: number;
  workspaceId?: string;
  columnId?: string;
};

export interface MiniTaskCardProps {
  taskTitle: string;
  description: string;
  projectName: string;
  comments: Comment[];
  members: Member[];
  workspaceId: string;
  projectId: string;
  onClick?: () => void;
  createdAt: string;
}

export interface Task {
  taskTitle: string;
  description: string;
  workspaceId?: string;
  projectName: string;
  projectStatus?: string;
  addMemberBtn?: () => void;
  addCommentBtn?: () => void;
  onClose?: () => void;
  members?: Member[];
  comments?: Comment[];
  projectId?: string;
  id?: string;
  columnId?: string;
  createdAt?: string;
  selectedMembers?: Member[];
  order?: number;
}
export interface Workspace {
  workspaceDesc: string;
  workspaceName: string;
  id?: string;
  ownerId: string;
  members?: Member[];
}
export type UserType = {
  fullName: string;
  email: string | null;
  id: string | null;
  type?: AuthProviderType;
  status: string;
} | null;

export type AuthProviderType = "google" | "emailPassword";

export type AuthContextType = {
  user: UserType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};
