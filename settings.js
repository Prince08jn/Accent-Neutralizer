// Settings Manager
class SettingsManager {
  constructor() {
    this.settings = {
      general: {
        defaultLanguage: 'auto',
        theme: 'light',
        keyboardShortcuts: true,
        notifications: true
      },
      audio: {
        microphone: 'default',
        audioQuality: 'medium',
        noiseSuppression: 70,
        echoCancellation: true,
        autoGainControl: true
      },
      privacy: {
        endToEndEncryption: true,
        localStorageOnly: false,
        dataRetention: 90,
        analyticsOptIn: true
      },
      integrations: {
        slack: false,
        teams: true,
        zoom: false,
        googleMeet: false
      },
      billing: {
        plan: 'professional',
        billingCycle: 'monthly',
        autoRenew: true
      }
    };
    
    this.loadSettings();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Settings tab navigation
    const settingsTabs = document.querySelectorAll('.settings-tab');
    settingsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        this.showSettingsTab(tabName);
      });
    });
    
    // Form change listeners
    this.setupFormListeners();
    this.setupMicrophoneDetection();
  }
  
  setupFormListeners() {
    // General settings
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.settings.general.theme = e.target.value;
        this.applyTheme(e.target.value);
        this.saveSettings();
      });
    });
    
    // Audio settings
    const noiseSlider = document.querySelector('#privacy input[type="range"]');
    if (noiseSlider) {
      noiseSlider.addEventListener('input', (e) => {
        this.settings.audio.noiseSuppression = parseInt(e.target.value);
        this.saveSettings();
      });
    }
    
    // Privacy checkboxes
    const privacyCheckboxes = document.querySelectorAll('#privacy input[type="checkbox"]');
    privacyCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const setting = e.target.closest('.setting-item').querySelector('span').textContent;
        if (setting.includes('encryption')) {
          this.settings.privacy.endToEndEncryption = e.target.checked;
        } else if (setting.includes('locally')) {
          this.settings.privacy.localStorageOnly = e.target.checked;
        }
        this.saveSettings();
      });
    });
  }
  
  async setupMicrophoneDetection() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices.filter(device => device.kind === 'audioinput');
      
      const micSelect = document.getElementById('microphoneSelect');
      if (micSelect && microphones.length > 0) {
        micSelect.innerHTML = '';
        microphones.forEach(mic => {
          const option = document.createElement('option');
          option.value = mic.deviceId;
          option.textContent = mic.label || `Microphone ${mic.deviceId.substring(0, 8)}`;
          micSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.log('Could not enumerate microphones:', error);
    }
  }
  
  showSettingsTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      }
    });
    
    // Update panels
    const panels = document.querySelectorAll('.settings-panel');
    panels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === tabName) {
        panel.classList.add('active');
      }
    });
  }
  
  loadSettings() {
    const savedSettings = localStorage.getItem('accent-neutralizer-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsed };
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    }
    
    this.applySettings();
  }
  
  saveSettings() {
    localStorage.setItem('accent-neutralizer-settings', JSON.stringify(this.settings));
    
    if (window.app) {
      window.app.showNotification('Settings saved', 'success');
    }
  }
  
  applySettings() {
    // Apply theme
    this.applyTheme(this.settings.general.theme);
    
    // Apply form values
    this.updateFormValues();
  }
  
  applyTheme(theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }
  
  updateFormValues() {
    // Update theme radio buttons
    const themeRadio = document.querySelector(`input[name="theme"][value="${this.settings.general.theme}"]`);
    if (themeRadio) {
      themeRadio.checked = true;
    }
    
    // Update checkboxes
    const encryptionCheckbox = document.querySelector('#privacy input[type="checkbox"]');
    if (encryptionCheckbox) {
      encryptionCheckbox.checked = this.settings.privacy.endToEndEncryption;
    }
    
    // Update sliders
    const noiseSlider = document.querySelector('#privacy input[type="range"]');
    if (noiseSlider) {
      noiseSlider.value = this.settings.audio.noiseSuppression;
    }
  }
  
  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      localStorage.removeItem('accent-neutralizer-settings');
      
      // Reset to defaults
      this.settings = {
        general: {
          defaultLanguage: 'auto',
          theme: 'light',
          keyboardShortcuts: true,
          notifications: true
        },
        audio: {
          microphone: 'default',
          audioQuality: 'medium',
          noiseSuppression: 70,
          echoCancellation: true,
          autoGainControl: true
        },
        privacy: {
          endToEndEncryption: true,
          localStorageOnly: false,
          dataRetention: 90,
          analyticsOptIn: true
        },
        integrations: {
          slack: false,
          teams: true,
          zoom: false,
          googleMeet: false
        },
        billing: {
          plan: 'professional',
          billingCycle: 'monthly',
          autoRenew: true
        }
      };
      
      this.applySettings();
      
      if (window.app) {
        window.app.showNotification('Settings reset to defaults', 'info');
      }
    }
  }
  
  exportSettings() {
    const settingsData = JSON.stringify(this.settings, null, 2);
    const blob = new Blob([settingsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accent-neutralizer-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Settings exported successfully', 'success');
    }
  }
  
  importSettings(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        this.settings = { ...this.settings, ...importedSettings };
        this.applySettings();
        this.saveSettings();
        
        if (window.app) {
          window.app.showNotification('Settings imported successfully', 'success');
        }
      } catch (error) {
        if (window.app) {
          window.app.showNotification('Error importing settings file', 'error');
        }
      }
    };
    reader.readAsText(file);
  }
  
  testMicrophone() {
    if (window.app) {
      window.app.showNotification('Testing microphone...', 'info');
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Test successful
        if (window.app) {
          window.app.showNotification('Microphone test successful', 'success');
        }
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(error => {
        if (window.app) {
          window.app.showNotification('Microphone test failed', 'error');
        }
        console.error('Microphone test error:', error);
      });
  }
  
  connectIntegration(service) {
    // Simulate integration connection
    this.settings.integrations[service] = true;
    this.saveSettings();
    
    // Update UI
    const integrationCard = document.querySelector(`[data-integration="${service}"]`);
    if (integrationCard) {
      const button = integrationCard.querySelector('button');
      if (button) {
        button.textContent = 'Connected';
        button.className = 'btn btn-sm btn-success';
      }
    }
    
    if (window.app) {
      window.app.showNotification(`${service} connected successfully`, 'success');
    }
  }
  
  disconnectIntegration(service) {
    this.settings.integrations[service] = false;
    this.saveSettings();
    
    // Update UI
    const integrationCard = document.querySelector(`[data-integration="${service}"]`);
    if (integrationCard) {
      const button = integrationCard.querySelector('button');
      if (button) {
        button.textContent = 'Connect';
        button.className = 'btn btn-sm';
      }
    }
    
    if (window.app) {
      window.app.showNotification(`${service} disconnected`, 'info');
    }
  }
}