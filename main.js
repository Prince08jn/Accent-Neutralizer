// Main Application Controller
class AccentNeutralizerApp {
  constructor() {
    this.currentSection = 'home';
    this.currentTheme = 'light';
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    this.loadTheme();
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupModals();
    this.setupKeyboardShortcuts();
    this.initializeComponents();
    this.apply3DEffects();
    
    this.isInitialized = true;
    console.log('Accent Neutralizer App initialized');
  }
  
  loadTheme() {
    const savedTheme = localStorage.getItem('accent-neutralizer-theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      
      const themeIcon = document.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      }
    }
  }
  
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.showSection(section);
      });
    });
    
    // Handle mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }
  
  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
    
    localStorage.setItem('accent-neutralizer-theme', this.currentTheme);
  }
  
  showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Update URL hash
    window.location.hash = sectionId;
    
    // Initialize section-specific functionality
    this.initializeSectionComponents(sectionId);
  }
  
  initializeSectionComponents(sectionId) {
    switch (sectionId) {
      case 'transcribe':
        if (window.transcriptionManager) {
          window.transcriptionManager.initialize();
        }
        break;
      case 'meetings':
        if (window.meetingsManager) {
          window.meetingsManager.loadMeetings();
        }
        break;
      case 'analytics':
        if (window.analyticsManager) {
          window.analyticsManager.updateCharts();
        }
        break;
      case 'team':
        if (window.teamManager) {
          window.teamManager.loadTeamMembers();
        }
        break;
      case 'settings':
        if (window.settingsManager) {
          window.settingsManager.loadSettings();
        }
        break;
      case 'translate':
        if (window.translationManager) {
          window.translationManager.initialize();
        }
        break;
    }
  }
  
  setupModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target.id);
      }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          this.closeModal(activeModal.id);
        }
      }
    });
  }
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.showSection('home');
            break;
          case '2':
            e.preventDefault();
            this.showSection('transcribe');
            break;
          case '3':
            e.preventDefault();
            this.showSection('translate');
            break;
          case '4':
            e.preventDefault();
            this.showSection('meetings');
            break;
          case '5':
            e.preventDefault();
            this.showSection('analytics');
            break;
          case '6':
            e.preventDefault();
            this.showSection('team');
            break;
          case '7':
            e.preventDefault();
            this.showSection('settings');
            break;
        }
      }
    });
  }
  
  initializeComponents() {
    // Initialize all component managers
    if (typeof TranscriptionManager !== 'undefined') {
      window.transcriptionManager = new TranscriptionManager();
    }
    
    if (typeof TranslationManager !== 'undefined') {
      window.translationManager = new TranslationManager();
    }
    
    if (typeof MeetingsManager !== 'undefined') {
      window.meetingsManager = new MeetingsManager();
    }
    
    if (typeof AnalyticsManager !== 'undefined') {
      window.analyticsManager = new AnalyticsManager();
    }
    
    if (typeof TeamManager !== 'undefined') {
      window.teamManager = new TeamManager();
    }
    
    if (typeof SettingsManager !== 'undefined') {
      window.settingsManager = new SettingsManager();
    }
    
    if (typeof AIFeaturesManager !== 'undefined') {
      window.aiManager = new AIFeaturesManager();
      window.aiManager.initialize();
    }
    
    if (typeof WebSocketManager !== 'undefined') {
      window.wsManager = new WebSocketManager();
      window.wsManager.initialize();
    }
    
    if (typeof OfflineManager !== 'undefined') {
      window.offlineManager = new OfflineManager();
    }
  }
  
  apply3DEffects() {
    // Apply 3D effects to existing elements
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      if (!card.classList.contains('card-3d')) {
        card.classList.add('card-3d');
      }
    });
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      if (!btn.classList.contains('btn-3d')) {
        btn.classList.add('btn-3d');
      }
    });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      if (!card.classList.contains('feature-card-3d')) {
        card.classList.add('feature-card-3d');
      }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (!link.classList.contains('nav-link-3d')) {
        link.classList.add('nav-link-3d');
      }
    });
    
    const navbar = document.querySelector('.navbar');
    if (navbar && !navbar.classList.contains('navbar-3d')) {
      navbar.classList.add('navbar-3d');
    }
    
    const hero = document.querySelector('.hero');
    if (hero && !hero.classList.contains('hero-3d')) {
      hero.classList.add('hero-3d');
    }
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.classList.contains('hero-title-3d')) {
      heroTitle.classList.add('hero-title-3d');
    }
    
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
      if (!card.classList.contains('floating-card-3d')) {
        card.classList.add('floating-card-3d');
        card.style.setProperty('--delay', `${index * 0.5}s`);
      }
    });
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (!modal.classList.contains('modal-3d')) {
        modal.classList.add('modal-3d');
      }
    });
    
    const formInputs = document.querySelectorAll('.form-input, .select-input');
    formInputs.forEach(input => {
      if (!input.classList.contains('form-input-3d')) {
        input.classList.add('form-input-3d');
      }
    });
    
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
      if (!slider.classList.contains('slider-3d')) {
        slider.classList.add('slider-3d');
      }
    });
  }
  
  // Utility methods
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 5rem;
          right: 1rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          color: white;
          font-weight: 500;
          z-index: 3000;
          animation: slideInRight 0.3s ease-out;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-xl);
        }
        .notification-info { 
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover)); 
        }
        .notification-success { 
          background: linear-gradient(135deg, var(--success-color), #059669); 
        }
        .notification-warning { 
          background: linear-gradient(135deg, var(--warning-color), #d97706); 
        }
        .notification-error { 
          background: linear-gradient(135deg, var(--danger-color), #dc2626); 
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
  
  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Global utility functions
function showSection(sectionId) {
  if (window.app) {
    window.app.showSection(sectionId);
  }
}

function openModal(modalId) {
  if (window.app) {
    window.app.openModal(modalId);
  }
}

function closeModal(modalId) {
  if (window.app) {
    window.app.closeModal(modalId);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AccentNeutralizerApp();
  
  // Handle initial hash navigation
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash)) {
    window.app.showSection(hash);
  }
  
  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      window.app.showSection(hash);
    }
  });
  
  console.log('Accent Neutralizer Platform loaded successfully');
});