import api from './axios';

export const authService = {
  login: async (credentials) => {
    const identifier = credentials.email || credentials.identifier;
    const response = await api.post('/auth/local', {
      identifier: identifier.trim().toLowerCase(),
      password: credentials.password,
    });
    
    // response.data -> { jwt, user }
    if (response.data?.jwt) {
      localStorage.setItem('MIXO_jwt_token', response.data.jwt);
    }
    return response.data;
  },

  register: async (userData) => {
    const emailClean = (userData.email || '').trim().toLowerCase();
    const response = await api.post('/auth/local/register', {
      username: emailClean,
      email: emailClean,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });

    if (response.data?.jwt) {
      localStorage.setItem('MIXO_jwt_token', response.data.jwt);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me?populate=*');
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('MIXO_jwt_token');
    return { success: true };
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (code, password, passwordConfirmation) => {
    const response = await api.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation: passwordConfirmation || password,
    });
    return response.data;
  },

  updateProfile: async (data) => {
    const currentUser = await api.get('/users/me');
    const response = await api.put(`/users/${currentUser.data.id}`, data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  }
};

