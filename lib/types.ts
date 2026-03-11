export interface Comment {
  id: number;
  name: string;
  author: Member;
  message: string;
  date: string;
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
}

export interface Task {
  taskTitle: string;
  description: string;
  workspaceId: string;
  projectName: string;
  projectStatus?: string;
  addMemberBtn?: () => void;
  addCommentBtn?: () => void;
  onClose?: () => void;
  members?: Member[];
  comments?: Comment[];
  projectId?: string;
  taskId?: string;
  columnId: string;
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
} | null;

export type AuthContextType = {
  user: UserType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};
