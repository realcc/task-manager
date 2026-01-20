export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}
