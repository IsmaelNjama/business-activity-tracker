

const API_BASE_URL = 'http://localhost:8000/v1';
// const API_BASE_URL = 'https://cva7pmhdeh.execute-api.us-east-1.amazonaws.com/';


export class BaseApiService {
  protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
  
  // async healthCheck() {
    
  //   const response = await fetch('http://localhost:8000/health');
  //   return response.json();
  // }
}


