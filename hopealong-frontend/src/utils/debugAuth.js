// Debug utility to check authentication state
export const debugAuth = () => {
  const token = localStorage.getItem('token');
  console.log('🔍 Debug Auth State:');
  console.log('Token exists:', !!token);
  console.log('Token value:', token ? token.substring(0, 50) + '...' : 'null');
  
  if (token) {
    try {
      // Decode JWT payload (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires:', new Date(payload.exp * 1000));
      console.log('Token expired:', Date.now() >= payload.exp * 1000);
    } catch (e) {
      console.log('Error decoding token:', e.message);
    }
  }
  
  return { token, hasToken: !!token };
};

// Test function to verify API connection
export const testAuthFetch = async () => {
  const API_BASE_URL = 'https://hopealongl21.onrender.com';
  
  try {
    console.log('🧪 Testing auth fetch...');
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error('Auth test failed:', error);
    return { success: false, error: error.message };
  }
};
