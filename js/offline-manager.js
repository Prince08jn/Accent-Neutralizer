// Offline Manager for Service Worker and Caching
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineQueue = [];
    this.syncInProgress = false;
    this.offlineData = {
      transcriptions: [],
      meetings: [],
      settings: {},
      analytics: {}
    };
    
    this.initialize();
  }
  
  async initialize() {
    // Register service worker only if supported and not on StackBlitz
    if ('serviceWorker' in navigator && !this.isUnsupportedEnvironment()) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else if (this.isUnsupportedEnvironment()) {
      console.log('Service Worker registration skipped: Running in unsupported environment');
    }
    
    // Setup offline/online event listeners
    this.setupNetworkListeners();
    
    // Initialize offline storage
    this.initializeOfflineStorage();
    
    // Setup UI indicators
    this.setupOfflineUI();
    
    // Load cached data
    this.loadOfflineData();
  }
  
  isUnsupportedEnvironment() {
    // Check for StackBlitz and other environments that don't support Service Workers
    const hostname = window.location.hostname;
    return hostname.includes('stackblitz.io') || 
           hostname.includes('webcontainer') ||
           hostname.includes('localhost') && window.location.port;
  }
  
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateConnectionStatus();
      this.syncOfflineData();
      
      if (window.app) {
        window.app.showNotification('Back online! Syncing data...', 'success');
      }
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateConnectionStatus();
      
      if (window.app) {
        window.app.showNotification('You are now offline. Data will be saved locally.', 'warning');
      }
    });
  }
  
  initializeOfflineStorage() {
    // Initialize IndexedDB for offline storage
    if ('indexedDB' in window) {
      const request = indexedDB.open('AccentNeutralizerDB', 1);
      
      request.onerror = () => {
        console.error('IndexedDB initialization failed');
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB initialized successfully');
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('transcriptions')) {
          const transcriptionStore = db.createObjectStore('transcriptions', { keyPath: 'id', autoIncrement: true });
          transcriptionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('meetings')) {
          const meetingStore = db.createObjectStore('meetings', { keyPath: 'id' });
          meetingStore.createIndex('date', 'date', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    }
  }
  
  setupOfflineUI() {
    // Add offline indicator to the page
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offlineIndicator';
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon">📡</span>
        <span class="offline-text">Offline Mode</span>
        <span class="offline-status">Data saved locally</span>
      </div>
    `;
    document.body.appendChild(offlineIndicator);
    
    // Add offline controls to navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      const offlineToggle = document.createElement('button');
      offlineToggle.id = 'offlineToggle';
      offlineToggle.className = 'offline-toggle';
      offlineToggle.innerHTML = '💾';
      offlineToggle.title = 'Offline Data Management';
      offlineToggle.addEventListener('click', () => this.showOfflineModal());
      navActions.appendChild(offlineToggle);
    }
    
    this.updateConnectionStatus();
  }
  
  updateConnectionStatus() {
    const indicator = document.getElementById('offlineIndicator');
    const connectionStatus = document.getElementById('connectionStatus');
    
    if (indicator) {
      if (this.isOnline) {
        indicator.classList.remove('active');
      } else {
        indicator.classList.add('active');
      }
    }
    
    if (connectionStatus) {
      const statusDot = connectionStatus.querySelector('.status-dot');
      const statusText = connectionStatus.querySelector('.status-text');
      
      if (statusDot && statusText) {
        if (this.isOnline) {
          statusDot.className = 'status-dot connected';
          statusText.textContent = 'Online';
        } else {
          statusDot.className = 'status-dot offline';
          statusText.textContent = 'Offline';
        }
      }
    }
  }
  
  // Save data offline
  async saveOfflineData(store, data) {
    if (!this.db) return false;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.add(data);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Load offline data
  async loadOfflineData() {
    if (!this.db) return;
    
    try {
      const transcriptions = await this.getOfflineData('transcriptions');
      const meetings = await this.getOfflineData('meetings');
      const settings = await this.getOfflineData('settings');
      
      this.offlineData = {
        transcriptions: transcriptions || [],
        meetings: meetings || [],
        settings: settings || {}
      };
      
      // Update UI with offline data
      this.populateOfflineUI();
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }
  
  async getOfflineData(store) {
    if (!this.db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Queue actions for when back online
  queueAction(action, data) {
    const queueItem = {
      id: Date.now(),
      action: action,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    this.offlineQueue.push(queueItem);
    
    // Save to IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['queue'], 'readwrite');
      const objectStore = transaction.objectStore('queue');
      objectStore.add(queueItem);
    }
  }
  
  // Sync offline data when back online
  async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline) return;
    
    this.syncInProgress = true;
    
    try {
      // Load queued actions from IndexedDB
      const queuedActions = await this.getOfflineData('queue');
      
      for (const item of queuedActions) {
        await this.processQueuedAction(item);
      }
      
      // Clear the queue
      await this.clearQueue();
      
      if (window.app) {
        window.app.showNotification('Offline data synced successfully', 'success');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      if (window.app) {
        window.app.showNotification('Sync failed. Will retry later.', 'error');
      }
    } finally {
      this.syncInProgress = false;
    }
  }
  
  async processQueuedAction(item) {
    // Simulate API calls for different actions
    switch (item.action) {
      case 'save_transcription':
        console.log('Syncing transcription:', item.data);
        break;
      case 'save_meeting':
        console.log('Syncing meeting:', item.data);
        break;
      case 'update_settings':
        console.log('Syncing settings:', item.data);
        break;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  async clearQueue() {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['queue'], 'readwrite');
      const objectStore = transaction.objectStore('queue');
      const request = objectStore.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  populateOfflineUI() {
    // Update UI components with offline data
    if (this.offlineData.transcriptions.length > 0) {
      console.log('Loaded offline transcriptions:', this.offlineData.transcriptions.length);
    }
    
    if (this.offlineData.meetings.length > 0) {
      console.log('Loaded offline meetings:', this.offlineData.meetings.length);
    }
  }
  
  showOfflineModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'offlineModal';
    
    modal.innerHTML = `
      <div class="modal-content offline-modal">
        <div class="modal-header">
          <h3>Offline Data Management</h3>
          <button class="modal-close" onclick="closeModal('offlineModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="offline-stats">
            <div class="offline-stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-info">
                <h4>${this.offlineData.transcriptions.length}</h4>
                <p>Offline Transcriptions</p>
              </div>
            </div>
            <div class="offline-stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <h4>${this.offlineData.meetings.length}</h4>
                <p>Offline Meetings</p>
              </div>
            </div>
            <div class="offline-stat-card">
              <div class="stat-icon">⏳</div>
              <div class="stat-info">
                <h4>${this.offlineQueue.length}</h4>
                <p>Pending Sync</p>
              </div>
            </div>
          </div>
          
          <div class="offline-actions">
            <button class="btn btn-primary" onclick="offlineManager.syncOfflineData()">
              <span class="btn-icon">🔄</span>
              Sync Now
            </button>
            <button class="btn btn-secondary" onclick="offlineManager.exportOfflineData()">
              <span class="btn-icon">📤</span>
              Export Data
            </button>
            <button class="btn btn-danger" onclick="offlineManager.clearOfflineData()">
              <span class="btn-icon">🗑️</span>
              Clear Offline Data
            </button>
          </div>
          
          <div class="offline-info">
            <h4>Offline Features Available:</h4>
            <ul>
              <li>✅ Voice transcription (local processing)</li>
              <li>✅ Meeting notes and recordings</li>
              <li>✅ Settings and preferences</li>
              <li>✅ Analytics data</li>
              <li>❌ Real-time translation (requires internet)</li>
              <li>❌ AI summaries (requires internet)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  async exportOfflineData() {
    const exportData = {
      transcriptions: this.offlineData.transcriptions,
      meetings: this.offlineData.meetings,
      settings: this.offlineData.settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accent-neutralizer-offline-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Offline data exported successfully', 'success');
    }
  }
  
  async clearOfflineData() {
    if (confirm('Are you sure you want to clear all offline data? This action cannot be undone.')) {
      try {
        if (this.db) {
          const stores = ['transcriptions', 'meetings', 'settings', 'queue'];
          for (const store of stores) {
            const transaction = this.db.transaction([store], 'readwrite');
            const objectStore = transaction.objectStore(store);
            await new Promise((resolve, reject) => {
              const request = objectStore.clear();
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }
        }
        
        this.offlineData = {
          transcriptions: [],
          meetings: [],
          settings: {},
          analytics: {}
        };
        
        this.offlineQueue = [];
        
        if (window.app) {
          window.app.showNotification('Offline data cleared successfully', 'success');
        }
        
        // Close modal and refresh UI
        closeModal('offlineModal');
      } catch (error) {
        console.error('Failed to clear offline data:', error);
        if (window.app) {
          window.app.showNotification('Failed to clear offline data', 'error');
        }
      }
    }
  }
  
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span class="update-icon">🔄</span>
        <span class="update-text">New version available!</span>
        <button class="update-btn" onclick="location.reload()">Update</button>
        <button class="update-dismiss" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }
  
  // Save transcription offline
  saveTranscriptionOffline(transcriptionData) {
    const data = {
      ...transcriptionData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    this.offlineData.transcriptions.push(data);
    
    if (this.isOnline) {
      this.queueAction('save_transcription', data);
    } else {
      this.saveOfflineData('transcriptions', data);
    }
  }
  
  // Save meeting offline
  saveMeetingOffline(meetingData) {
    const data = {
      ...meetingData,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    this.offlineData.meetings.push(data);
    
    if (this.isOnline) {
      this.queueAction('save_meeting', data);
    } else {
      this.saveOfflineData('meetings', data);
    }
  }
}
