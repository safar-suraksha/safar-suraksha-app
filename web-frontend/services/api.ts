// API Service for SurakshaNet Police Dashboard

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Officers
  async getOfficers() {
    return this.request('/officers');
  }

  async dispatchOfficer(officerId: string, alertId?: string, location?: string) {
    return this.request(`/officers/${officerId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ alertId, location }),
    });
  }

  // SOS Alerts
  async getSOSAlerts(status?: string, priority?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/sos-alerts${query}`);
  }

  async createSOSAlert(alertData: any) {
    return this.request('/sos-alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async updateSOSAlert(alertId: string, updates: any) {
    return this.request(`/sos-alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async resolveSOSAlert(alertId: string) {
    return this.updateSOSAlert(alertId, { status: 'resolved' });
  }

  // Tourists
  async getTourists(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/tourists${query}`);
  }

  async createTourist(touristData: any) {
    return this.request('/tourists', {
      method: 'POST',
      body: JSON.stringify(touristData),
    });
  }

  async updateTourist(touristId: string, updates: any) {
    return this.request(`/tourists/${touristId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async verifyTourist(touristId: string) {
    return this.updateTourist(touristId, { status: 'verified' });
  }

  async rejectTourist(touristId: string, reason: string) {
    return this.updateTourist(touristId, { status: 'rejected', rejectionReason: reason });
  }

  // Reports
  async getReports(status?: string, type?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/reports${query}`);
  }

  async createReport(reportData: any) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updateReport(reportId: string, updates: any) {
    return this.request(`/reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async exportReport(reportId: string) {
    return this.request(`/reports/${reportId}/export`);
  }

  // Cameras  
  async getCameras() {
    return this.request('/cameras');
  }

  async viewCamera(cameraId: string) {
    return this.request(`/cameras/${cameraId}/view`);
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // Audit Logs
  async getAuditLogs(action?: string, userId?: string) {
    const params = new URLSearchParams();
    if (action) params.append('action', action);
    if (userId) params.append('userId', userId);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/audit-logs${query}`);
  }

  // Chat
  async getChatChannels() {
    return this.request('/chat/channels');
  }

  async getChatMessages(channelId: string) {
    return this.request(`/chat/${channelId}/messages`);
  }

  async sendChatMessage(channelId: string, message: string, priority: string = 'normal') {
    return this.request(`/chat/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        priority,
        sender: 'Current User' // Replace with actual user info
      }),
    });
  }

  // Map
  async getMapMarkers(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/map/markers${query}`);
  }

  // Communication
  async makeCall(phoneNumber: string) {
    return this.request(`/call/${phoneNumber}`, {
      method: 'POST',
    });
  }

  // Location
  async locateTourist(touristId: string) {
    return this.request(`/locate/${touristId}`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for custom instances if needed
export default ApiService;