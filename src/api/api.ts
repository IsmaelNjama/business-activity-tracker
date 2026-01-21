import { EmployeeRegisterPayload, User, LoginData, LoginResponse } from "@/types";

const API_BASE_URL = 'http://localhost:8000/v1';


class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    }

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options?.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      
      ...options,
      headers,
      
    });
    

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async registerEmployee(inputs: EmployeeRegisterPayload): Promise<User> {
    return this.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  }

  async loginEmployee(loginData: LoginData): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password)
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: formData,
    });
  }

  async getAllEmployees(): Promise<User[]> {
    return this.request<User[]>('/employees', {
      method: 'GET',
      
  })
  }
  

  // async healthCheck() {
    
  //   const response = await fetch('http://localhost:8000/health');
  //   return response.json();
  // }
}


export const apiService = new ApiService()