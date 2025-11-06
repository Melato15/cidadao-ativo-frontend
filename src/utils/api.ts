const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  neighborhood: string;
  votesFor: number;
  votesAgainst: number;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  status?: string;
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error("Falha ao carregar projetos");
    }
    return response.json();
  },

  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) {
      throw new Error("Falha ao carregar projeto");
    }
    return response.json();
  },

  async create(data: CreateProjectDto, token: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao criar projeto");
    }
    return response.json();
  },

  async update(
    id: string,
    data: Partial<CreateProjectDto>,
    token: string
  ): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao atualizar projeto");
    }
    return response.json();
  },

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Falha ao deletar projeto");
    }
  },

  async vote(id: string, type: "for" | "against"): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${id}/vote/${type}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Falha ao votar");
    }
    return response.json();
  },
};
