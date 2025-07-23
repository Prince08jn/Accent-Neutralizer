// Authentication Manager
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authToken = null;
    this.refreshToken = null;
    
    this.loadAuthState();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.updateProfile(e));
    }
  }
  
  loadAuthState() {
    const savedAuth = localStorage.getItem('accent-neutralizer-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        this.currentUser = authData.user;
        this.authToken = authData.token;
        this.refreshToken = authData.refreshToken;
        this.isAuthenticated = true;
        
        this.updateAuthUI();
        this.validateToken();
      } catch (error) {
        console.error('Error loading auth state:', error);
        this.clearAuthState();
      }
    }
  }
  
  saveAuthState() {
    const authData = {
      user: this.currentUser,
      token: this.authToken,
      refreshToken: this.refreshToken,
      timestamp: Date.now()
    };
    localStorage.setItem('accent-neutralizer-auth', JSON.stringify(authData));
  }
  
  clearAuthState() {
    this.currentUser = null;
    this.authToken = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
    localStorage.removeItem('accent-neutralizer-auth');
    this.updateAuthUI();
  }
  
  async handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      this.showLoading('loginBtn', 'Signing in...');
      
      // Simulate API call
      const response = await this.simulateLogin(email, password);
      
      if (response.success) {
        this.currentUser = response.user;
        this.authToken = response.token;
        this.refreshToken = response.refreshToken;
        this.isAuthenticated = true;
        
        this.saveAuthState();
        this.updateAuthUI();
        
        if (window.app) {
          window.app.closeModal('authModal');
          window.app.showNotification('Welcome back!', 'success');
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    } finally {
      this.hideLoading('loginBtn', 'Sign In');
    }
  }
  
  async handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    };
    
    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      if (window.app) {
        window.app.showNotification('Passwords do not match', 'error');
      }
      return;
    }
    
    try {
      this.showLoading('signupBtn', 'Creating account...');
      
      // Simulate API call
      const response = await this.simulateSignup(userData);
      
      if (response.success) {
        this.currentUser = response.user;
        this.authToken = response.token;
        this.refreshToken = response.refreshToken;
        this.isAuthenticated = true;
        
        this.saveAuthState();
        this.updateAuthUI();
        
        if (window.app) {
          window.app.closeModal('authModal');
          window.app.showNotification('Account created successfully!', 'success');
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    } finally {
      this.hideLoading('signupBtn', 'Create Account');
    }
  }
  
  async simulateLogin(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        success: true,
        user: {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          avatar: 'DU',
          plan: 'professional',
          joinDate: new Date().toISOString(),
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: true
          }
        },
        token: 'demo-jwt-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now()
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  async simulateSignup(userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate email validation
    if (!userData.email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }
    
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        plan: 'free',
        joinDate: new Date().toISOString(),
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      },
      token: 'jwt-token-' + Date.now(),
      refreshToken: 'refresh-token-' + Date.now()
    };
  }
  
  async updateProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = {
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
      company: formData.get('company'),
      role: formData.get('role')
    };
    
    try {
      this.showLoading('saveProfileBtn', 'Saving...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current user
      this.currentUser = { ...this.currentUser, ...profileData };
      this.saveAuthState();
      this.updateAuthUI();
      
      if (window.app) {
        window.app.showNotification('Profile updated successfully', 'success');
      }
    } catch (error) {
      if (window.app) {
        window.app.showNotification('Failed to update profile', 'error');
      }
    } finally {
      this.hideLoading('saveProfileBtn', 'Save Changes');
    }
  }
  
  logout() {
    this.clearAuthState();
    
    if (window.app) {
      window.app.showNotification('Signed out successfully', 'info');
      window.app.showSection('home');
    }
  }
  
  async validateToken() {
    if (!this.authToken) return false;
    
    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.clearAuthState();
      return false;
    }
  }
  
  updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (this.isAuthenticated && this.currentUser) {
      // Show user menu
      if (authButton) authButton.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userName) userName.textContent = this.currentUser.name;
      if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
      
      // Update profile form if visible
      this.populateProfileForm();
    } else {
      // Show auth button
      if (authButton) authButton.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
    }
  }
  
  populateProfileForm() {
    if (!this.currentUser) return;
    
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const bioInput = document.getElementById('profileBio');
    const companyInput = document.getElementById('profileCompany');
    const roleInput = document.getElementById('profileRole');
    
    if (nameInput) nameInput.value = this.currentUser.name || '';
    if (emailInput) emailInput.value = this.currentUser.email || '';
    if (bioInput) bioInput.value = this.currentUser.bio || '';
    if (companyInput) companyInput.value = this.currentUser.company || '';
    if (roleInput) roleInput.value = this.currentUser.role || '';
  }
  
  showLoading(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = true;
      button.innerHTML = `<span class="loading-spinner"></span> ${text}`;
    }
  }
  
  hideLoading(buttonId, originalText) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  }
  
  requireAuth() {
    if (!this.isAuthenticated) {
      if (window.app) {
        window.app.openModal('authModal');
        window.app.showNotification('Please sign in to continue', 'warning');
      }
      return false;
    }
    return true;
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  getAuthToken() {
    return this.authToken;
  }
}