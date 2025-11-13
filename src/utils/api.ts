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

// Nova API de votos
export interface Vote {
  id: string;
  type: "up" | "down";
  comment?: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface VoteDto {
  type: "up" | "down";
  comment?: string;
}

export const votesApi = {
  async vote(
    projectId: string,
    voteData: VoteDto,
    token: string
  ): Promise<Vote> {
    const response = await fetch(`${API_BASE_URL}/votes/project/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(voteData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao votar");
    }
    return response.json();
  },

  async removeVote(projectId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/votes/project/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao remover voto");
    }
  },

  async getMyVote(projectId: string, token: string): Promise<Vote | null> {
    const response = await fetch(
      `${API_BASE_URL}/votes/project/${projectId}/my-vote`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Falha ao buscar voto");
    }
    return response.json();
  },

  async getProjectVotes(projectId: string): Promise<Vote[]> {
    const response = await fetch(`${API_BASE_URL}/votes/project/${projectId}`);
    if (!response.ok) {
      throw new Error("Falha ao buscar votos do projeto");
    }
    return response.json();
  },

  async getMyVotes(token: string): Promise<Vote[]> {
    const response = await fetch(`${API_BASE_URL}/votes/my-votes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar meus votos");
    }
    return response.json();
  },
};

// API de Reports (Denúncias)
export interface Report {
  id: number;
  title: string;
  description: string;
  category:
    | "infrastructure"
    | "education"
    | "health"
    | "security"
    | "environment"
    | "culture"
    | "sports"
    | "transportation"
    | "other";
  status:
    | "draft"
    | "active"
    | "voting"
    | "approved"
    | "rejected"
    | "implemented";
  priority: "low" | "medium" | "high" | "urgent";
  location?: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  title: string;
  description: string;
  category:
    | "infrastructure"
    | "education"
    | "health"
    | "security"
    | "environment"
    | "culture"
    | "sports"
    | "transportation"
    | "other";
  status:
    | "draft"
    | "active"
    | "voting"
    | "approved"
    | "rejected"
    | "implemented";
  priority: "low" | "medium" | "high" | "urgent";
  location?: string;
}

export const reportsApi = {
  async getAll(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) {
      throw new Error("Falha ao carregar denúncias");
    }
    return response.json();
  },

  async getById(id: number): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) {
      throw new Error("Falha ao carregar denúncia");
    }
    return response.json();
  },

  async getByAuthor(authorId: string): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/reports/author/${authorId}`);
    if (!response.ok) {
      throw new Error("Falha ao carregar denúncias do autor");
    }
    return response.json();
  },

  async create(data: CreateReportDto, token: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao criar denúncia");
    }
    return response.json();
  },

  async update(
    id: number,
    data: Partial<CreateReportDto>,
    token: string
  ): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao atualizar denúncia");
    }
    return response.json();
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Falha ao deletar denúncia");
    }
  },
};
