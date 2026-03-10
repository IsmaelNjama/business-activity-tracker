import { BaseApiService } from "./baseApi";
import { EmployeeRegisterPayload, User, LoginData, LoginResponse } from "@/types";

class AuthApiService extends BaseApiService {
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
  
}

export const authApiService = new AuthApiService();