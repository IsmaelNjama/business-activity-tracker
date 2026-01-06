import { SignupData, User } from "@/types";

const API_BASE_URL = 'http://localhost:8000/v1';

// export interface ApiEmployeeRegisterInputs {
//   user_name: string
//   first_name: string
//   last_name: string
//   email: string
//   phone_number: string
//   gender: string
//   password: string
// }

// export interface ApiEmployeeRegisterResponse {
//   user_name: string
//   first_name: string
//   last_name: string
//   email: string
//   phone_number: string
//   gender: string
//   id: number
//   role: string
// }


class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async registerEmployee(inputs: SignupData): Promise<User> {
    return this.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  }


  // async healthCheck() {
    
  //   const response = await fetch('http://localhost:8000/health');
  //   return response.json();
  // }
}


export const apiService = new ApiService()