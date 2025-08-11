// Notifications Manager
class NotificationsManager {
  constructor() {
    this.isEnabled = true;
    this.browserNotifications = true;
    this.emailNotifications = false;
    this.notificationQueue = [];
    this.activeNotifications = new Map();
    
    this.setupEventListeners();
    this.requestPermission();
    this.loadSettings();
  }
  
  setupEventListeners() {
    // Enable/disable toggles
    const browserNotifToggle = document.getElementById('browserNotificationsToggle');
    const emailNotifToggle = document.getElementById('emailNotificationsToggle');
    
    if (browserNotifToggle) {
      browserNotifToggle.addEventListener('change', (e) => {
        this.browserNotifications = e.target.checked;
        if (e.target.checked) {
          this.requestPermission();
        }
        this.saveSettings();
      });
    }
    
    if (emailNotifToggle) {
      emailNotifToggle.addEventListener('change', (e) => {
        this.emailNotifications = e.target.checked;
        this.saveSettings();
      });
    }
    
    // Notification preferences
    const notificationTypes = document.querySelectorAll('.notification-type-toggle');
    notificationTypes.forEach(toggle => {
      toggle.addEventListener('change', () => this.saveSettings());
    });
    
    // Test notification button
    const testNotifBtn = document.getElementById('testNotificationBtn');
    if (testNotifBtn) {
      testNotifBtn.addEventListener('click', () => this.testNotification());
    }
  }
  
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission === 'denied') {
      return false;
    }
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  showNotification(options) {
    if (!this.isEnabled) return;
    
    const notification = {
      id: Date.now().toString(),
      title: options.title,
      body: options.body,
      type: options.type || 'info',
      actions: options.actions || [],
      timestamp: new Date().toISOString(),
      persistent: options.persistent || false,
      ...options
    };
    
    // Show browser notification
    if (this.browserNotifications && this.shouldShowBrowserNotification(notification.type)) {
      this.showBrowserNotification(notification);
    }
    
    // Show in-app notification
    this.showInAppNotification(notification);
    
    // Send email notification if enabled
    if (this.emailNotifications && this.shouldSendEmailNotification(notification.type)) {
      this.sendEmailNotification(notification);
    }
    
    // Store notification
    this.activeNotifications.set(notification.id, notification);
    
    // Auto-dismiss if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        this.dismissNotification(notification.id);
      }, 5000);
    }
    
    return notification.id;
  }
  
  showBrowserNotification(notification) {
    if (Notification.permission !== 'granted') return;
    
    const browserNotif = new Notification(notification.title, {
      body: notification.body,
      icon: this.getNotificationIcon(notification.type),
      badge: '/icon-72x72.png',
      tag: notification.type,
      requireInteraction: notification.persistent,
      actions: notification.actions.map(action => ({
        action: action.action,
        title: action.title,
        icon: action.icon
      }))
    });
    
    browserNotif.onclick = () => {
      window.focus();
      if (notification.onClick) {
        notification.onClick();
      }
      browserNotif.close();
    };
    
    browserNotif.onclose = () => {
      this.dismissNotification(notification.id);
    };
    
    // Handle action clicks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('notificationclick', (event) => {
        if (event.notification.tag === notification.type) {
          const action = notification.actions.find(a => a.action === event.action);
          if (action && action.handler) {
            action.handler();
          }
          event.notification.close();
        }
      });
    }
  }
  
  showInAppNotification(notification) {
    const container = this.getNotificationContainer();
    
    const notifElement = document.createElement('div');
    notifElement.className = `in-app-notification ${notification.type}`;
    notifElement.id = `notification-${notification.id}`;
    
    notifElement.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${this.getNotificationEmoji(notification.type)}</div>
        <div class="notification-text">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-body">${notification.body}</div>
        </div>
        <div class="notification-actions">
          ${notification.actions.map(action => 
            `<button class="notification-action-btn" data-action="${action.action}" data-notification="${notification.id}">
              ${action.title}
            </button>`
          ).join('')}
          <button class="notification-close" data-notification="${notification.id}">&times;</button>
        </div>
      </div>
      <div class="notification-progress"></div>
    `;
    
    // Add event listeners
    notifElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification-close')) {
        this.dismissNotification(notification.id);
      } else if (e.target.classList.contains('notification-action-btn')) {
        const actionName = e.target.getAttribute('data-action');
        const action = notification.actions.find(a => a.action === actionName);
        if (action && action.handler) {
          action.handler();
        }
        this.dismissNotification(notification.id);
      } else if (notification.onClick) {
        notification.onClick();
        this.dismissNotification(notification.id);
      }
    });
    
    container.appendChild(notifElement);
    
    // Animate in
    setTimeout(() => {
      notifElement.classList.add('show');
    }, 100);
    
    // Progress bar animation
    if (!notification.persistent) {
      const progressBar = notifElement.querySelector('.notification-progress');
      progressBar.style.animation = 'notificationProgress 5s linear';
    }
  }
  
  getNotificationContainer() {
    let container = document.getElementById('notificationContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notificationContainer';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    return container;
  }
  
  dismissNotification(notificationId) {
    const notification = this.activeNotifications.get(notificationId);
    if (!notification) return;
    
    // Remove from active notifications
    this.activeNotifications.delete(notificationId);
    
    // Remove in-app notification
    const notifElement = document.getElementById(`notification-${notificationId}`);
    if (notifElement) {
      notifElement.classList.add('hide');
      setTimeout(() => {
        if (notifElement.parentNode) {
          notifElement.parentNode.removeChild(notifElement);
        }
      }, 300);
    }
  }
  
  sendEmailNotification(notification) {
    // Simulate email notification
    console.log('Sending email notification:', notification);
    
    // In a real implementation, this would call your email service
    const emailData = {
      to: window.authManager?.getCurrentUser()?.email,
      subject: notification.title,
      body: notification.body,
      type: notification.type
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log('Email notification sent:', emailData);
    }, 1000);
  }
  
  getNotificationIcon(type) {
    const icons = {
      'info': '/icon-192x192.png',
      'success': '/icon-192x192.png',
      'warning': '/icon-192x192.png',
      'error': '/icon-192x192.png',
      'meeting-reminder': '/icon-192x192.png',
      'transcript-ready': '/icon-192x192.png'
    };
    
    return icons[type] || '/icon-192x192.png';
  }
  
  getNotificationEmoji(type) {
    const emojis = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'meeting-reminder': '📅',
      'transcript-ready': '📝',
      'speaker-identified': '🎤',
      'translation-complete': '🌍'
    };
    
    return emojis[type] || 'ℹ️';
  }
  
  shouldShowBrowserNotification(type) {
    const browserNotifTypes = document.getElementById('browserNotificationTypes');
    if (!browserNotifTypes) return true;
    
    const checkbox = browserNotifTypes.querySelector(`input[value="${type}"]`);
    return checkbox ? checkbox.checked : true;
  }
  
  shouldSendEmailNotification(type) {
    const emailNotifTypes = document.getElementById('emailNotificationTypes');
    if (!emailNotifTypes) return false;
    
    const checkbox = emailNotifTypes.querySelector(`input[value="${type}"]`);
    return checkbox ? checkbox.checked : false;
  }
  
  testNotification() {
    this.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify your settings.',
      type: 'info',
      actions: [
        {
          action: 'ok',
          title: 'OK',
          handler: () => {
            if (window.app) {
              window.app.showNotification('Test notification acknowledged', 'success');
            }
          }
        }
      ]
    });
  }
  
  // Meeting reminder notifications
  scheduleMeetingReminder(meeting, reminderTime = 15) {
    const reminderDate = new Date(meeting.date.getTime() - reminderTime * 60 * 1000);
    const now = new Date();
    
    if (reminderDate > now) {
      setTimeout(() => {
        this.showNotification({
          title: 'Meeting Reminder',
          body: `"${meeting.title}" starts in ${reminderTime} minutes`,
          type: 'meeting-reminder',
          persistent: true,
          actions: [
            {
              action: 'join',
              title: 'Join Meeting',
              handler: () => {
                if (window.meetingsManager) {
                  window.meetingsManager.joinMeeting(meeting.id);
                }
              }
            },
            {
              action: 'snooze',
              title: 'Snooze 5min',
              handler: () => {
                setTimeout(() => {
                  this.showNotification({
                    title: 'Meeting Reminder',
                    body: `"${meeting.title}" starts in 5 minutes`,
                    type: 'meeting-reminder'
                  });
                }, 5 * 60 * 1000);
              }
            }
          ]
        });
      }, reminderDate.getTime() - now.getTime());
    }
  }
  
  // Transcript completion notifications
  notifyTranscriptReady(transcriptId, summary) {
    this.showNotification({
      title: 'Transcript Ready',
      body: `Your transcript is ready. ${summary.wordCount} words transcribed.`,
      type: 'transcript-ready',
      actions: [
        {
          action: 'view',
          title: 'View Transcript',
          handler: () => {
            if (window.app) {
              window.app.showSection('transcribe');
            }
          }
        },
        {
          action: 'export',
          title: 'Export',
          handler: () => {
            if (window.exportSharingManager) {
              window.exportSharingManager.exportToTxt();
            }
          }
        }
      ]
    });
  }
  
  // Speaker identification notifications
  notifySpeakerIdentified(speaker) {
    this.showNotification({
      title: 'Speaker Identified',
      body: `${speaker.name} is now speaking (${(speaker.confidence * 100).toFixed(1)}% confidence)`,
      type: 'speaker-identified'
    });
  }
  
  // Translation completion notifications
  notifyTranslationComplete(sourceLanguage, targetLanguage, wordCount) {
    this.showNotification({
      title: 'Translation Complete',
      body: `${wordCount} words translated from ${sourceLanguage} to ${targetLanguage}`,
      type: 'translation-complete',
      actions: [
        {
          action: 'view',
          title: 'View Translation',
          handler: () => {
            if (window.app) {
              window.app.showSection('translate');
            }
          }
        }
      ]
    });
  }
  
  // Collaboration notifications
  notifyCollaborationEvent(event, user, room) {
    const messages = {
      'user-joined': `${user.name} joined the room`,
      'user-left': `${user.name} left the room`,
      'message-received': `New message from ${user.name}`,
      'transcript-shared': `${user.name} shared a transcript`
    };
    
    this.showNotification({
      title: `${room.name}`,
      body: messages[event] || `${user.name} performed an action`,
      type: 'info',
      onClick: () => {
        if (window.app) {
          window.app.showSection('collaboration');
        }
      }
    });
  }
  
  // System notifications
  notifySystemEvent(event, details) {
    const messages = {
      'offline': 'You are now offline. Data will be saved locally.',
      'online': 'Back online! Syncing data...',
      'sync-complete': 'Data synchronization completed',
      'update-available': 'A new version is available',
      'storage-full': 'Local storage is almost full'
    };
    
    this.showNotification({
      title: 'System Notification',
      body: messages[event] || details,
      type: event === 'offline' || event === 'storage-full' ? 'warning' : 'info'
    });
  }
  
  saveSettings() {
    const settings = {
      isEnabled: this.isEnabled,
      browserNotifications: this.browserNotifications,
      emailNotifications: this.emailNotifications,
      types: {}
    };
    
    // Save notification type preferences
    const typeToggles = document.querySelectorAll('.notification-type-toggle');
    typeToggles.forEach(toggle => {
      settings.types[toggle.value] = toggle.checked;
    });
    
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('notification-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        
        this.isEnabled = settings.isEnabled !== false;
        this.browserNotifications = settings.browserNotifications !== false;
        this.emailNotifications = settings.emailNotifications || false;
        
        // Apply settings to UI
        const browserToggle = document.getElementById('browserNotificationsToggle');
        const emailToggle = document.getElementById('emailNotificationsToggle');
        
        if (browserToggle) browserToggle.checked = this.browserNotifications;
        if (emailToggle) emailToggle.checked = this.emailNotifications;
        
        // Apply type preferences
        if (settings.types) {
          Object.entries(settings.types).forEach(([type, enabled]) => {
            const toggle = document.querySelector(`.notification-type-toggle[value="${type}"]`);
            if (toggle) toggle.checked = enabled;
          });
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }
  
  // Batch notifications
  showBatchNotification(notifications) {
    if (notifications.length === 1) {
      this.showNotification(notifications[0]);
      return;
    }
    
    this.showNotification({
      title: `${notifications.length} New Notifications`,
      body: notifications.map(n => n.title).join(', '),
      type: 'info',
      actions: [
        {
          action: 'view-all',
          title: 'View All',
          handler: () => {
            this.showNotificationHistory();
          }
        }
      ]
    });
  }
  
  showNotificationHistory() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'notificationHistoryModal';
    
    const historyHtml = Array.from(this.activeNotifications.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(notification => `
        <div class="notification-history-item">
          <div class="notification-icon">${this.getNotificationEmoji(notification.type)}</div>
          <div class="notification-details">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-body">${notification.body}</div>
            <div class="notification-time">${new Date(notification.timestamp).toLocaleString()}</div>
          </div>
        </div>
      `).join('');
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Notification History</h3>
          <button class="modal-close" onclick="closeModal('notificationHistoryModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="notification-history">
            ${historyHtml || '<p>No notifications</p>'}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  clearAllNotifications() {
    this.activeNotifications.forEach((notification, id) => {
      this.dismissNotification(id);
    });
  }
}

// Animate notification in/out
function animateNotificationIn(el) {
  el.classList.add('notif-anim-in');
  setTimeout(() => el.classList.remove('notif-anim-in'), 600);
}
function animateNotificationOut(el) {
  el.classList.add('notif-anim-out');
  setTimeout(() => el.remove(), 600);
}

// Patch showInAppNotification to animate
const origShowInAppNotification = NotificationsManager.prototype.showInAppNotification;
NotificationsManager.prototype.showInAppNotification = function(notification) {
  const container = this.getNotificationContainer();
  const notifElement = document.createElement('div');
  notifElement.className = `in-app-notification ${notification.type}`;
  notifElement.id = `notification-${notification.id}`;
  notifElement.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon pulse-anim">${this.getNotificationEmoji(notification.type)}</div>
      <div class="notification-text">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-body">${notification.body}</div>
      </div>
      <div class="notification-actions">
        ${notification.actions.map(action => 
          `<button class="notification-action-btn" data-action="${action.action}" data-notification="${notification.id}">
            ${action.title}
          </button>`
        ).join('')}
        <button class="notification-close" data-notification="${notification.id}">&times;</button>
      </div>
    </div>
    <div class="notification-progress"></div>
  `;
  // Add event listeners
  notifElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('notification-close')) {
      animateNotificationOut(notifElement);
    } else if (e.target.classList.contains('notification-action-btn')) {
      animateNotificationOut(notifElement);
    }
  });
  container.appendChild(notifElement);
  setTimeout(() => animateNotificationIn(notifElement), 100);
  // Progress bar animation
  const progress = notifElement.querySelector('.notification-progress');
  if (progress) {
    progress.style.transition = 'width 5s linear';
    progress.style.width = '100%';
    setTimeout(() => progress.style.width = '0%', 50);
  }
  // Sound feedback for important notifications
  if (notification.type === 'success' || notification.type === 'error') {
    const audio = new Audio('/sounds/notify.mp3');
    audio.volume = 0.2;
    audio.play();
  }
};
