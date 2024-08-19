import { jwtDecode } from 'jwt-decode'; // Use the correct import

class AuthService {
  getProfile() {
    return jwtDecode(this.getToken()); // Use jwtDecode here
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token); // Use jwtDecode here
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error decoding token:', err);
      return true; // Treat as expired if an error occurs
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();