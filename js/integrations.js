// Integrations Manager
class IntegrationsManager {
  constructor() {
    this.connectedServices = new Map();
    this.availableIntegrations = new Map();
    
    this.initializeIntegrations();
    this.setupEventListeners();
  }
  
  initializeIntegrations() {
    // Define available integrations
    this.availableIntegrations.set('google-calendar', {
      name: 'Google Calendar',
      description: 'Sync meetings and schedule transcription sessions',
      icon: '📅',
      category: 'calendar',
      features: ['meeting-sync', 'auto-schedule', 'reminders'],
      status: 'available'
    });
    
    this.availableIntegrations.set('outlook', {
      name: 'Microsoft Outlook',
      description: 'Integrate with Outlook calendar and email',
      icon: '📧',
      category: 'calendar',
      features: ['meeting-sync', 'email-sharing', 'calendar-integration'],
      status: 'available'
    });
    
    this.availableIntegrations.set('slack', {
      name: 'Slack',
      description: 'Share transcripts and get notifications in Slack',
      icon: '💬',
      category: 'communication',
      features: ['transcript-sharing', 'notifications', 'bot-commands'],
      status: 'available'
    });
    
    this.availableIntegrations.set('teams', {
      name: 'Microsoft Teams',
      description: 'Live meeting transcription and sharing',
      icon: '👥',
      category: 'communication',
      features: ['live-transcription', 'meeting-bot', 'file-sharing'],
      status: 'available'
    });
    
    this.availableIntegrations.set('zoom', {
      name: 'Zoom',
      description: 'Automatic transcription for Zoom meetings',
      icon: '🎥',
      category: 'video-conferencing',
      features: ['auto-transcription', 'recording-sync', 'participant-tracking'],
      status: 'available'
    });
    
    this.availableIntegrations.set('google-meet', {
      name: 'Google Meet',
      description: 'Real-time transcription for Google Meet',
      icon: '📹',
      category: 'video-conferencing',
      features: ['real-time-transcription', 'auto-join', 'summary-generation'],
      status: 'available'
    });
    
    this.availableIntegrations.set('dropbox', {
      name: 'Dropbox',
      description: 'Store and sync transcripts in Dropbox',
      icon: '📦',
      category: 'storage',
      features: ['auto-backup', 'file-sync', 'shared-folders'],
      status: 'available'
    });
    
    this.availableIntegrations.set('google-drive', {
      name: 'Google Drive',
      description: 'Save transcripts directly to Google Drive',
      icon: '💾',
      category: 'storage',
      features: ['auto-save', 'folder-organization', 'sharing'],
      status: 'available'
    });
    
    this.loadConnectedServices();
  }
  
  setupEventListeners() {
    // Integration cards
    document.addEventListener('click', (e) => {
      if (e.target.closest('.connect-integration-btn')) {
        const button = e.target.closest('.connect-integration-btn');
        const integrationId = button.getAttribute('data-integration');
        this.connectIntegration(integrationId);
      }
      
      if (e.target.closest('.disconnect-integration-btn')) {
        const button = e.target.closest('.disconnect-integration-btn');
        const integrationId = button.getAttribute('data-integration');
        this.disconnectIntegration(integrationId);
      }
      
      if (e.target.closest('.configure-integration-btn')) {
        const button = e.target.closest('.configure-integration-btn');
        const integrationId = button.getAttribute('data-integration');
        this.configureIntegration(integrationId);
      }
    });
    
    // Webhook setup
    const setupWebhookBtn = document.getElementById('setupWebhookBtn');
    if (setupWebhookBtn) {
      setupWebhookBtn.addEventListener('click', () => this.setupWebhook());
    }
    
    // API key management
    const generateApiKeyBtn = document.getElementById('generateApiKeyBtn');
    if (generateApiKeyBtn) {
      generateApiKeyBtn.addEventListener('click', () => this.generateApiKey());
    }
  }
  
  async connectIntegration(integrationId) {
    const integration = this.availableIntegrations.get(integrationId);
    if (!integration) return;
    
    try {
      if (window.app) {
        window.app.showNotification(`Connecting to ${integration.name}...`, 'info');
      }
      
      // Simulate OAuth flow
      const authResult = await this.simulateOAuthFlow(integration);
      
      if (authResult.success) {
        this.connectedServices.set(integrationId, {
          ...integration,
          connectedAt: new Date().toISOString(),
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken,
          settings: this.getDefaultSettings(integrationId)
        });
        
        this.saveConnectedServices();
        this.updateIntegrationsUI();
        
        if (window.app) {
          window.app.showNotification(`${integration.name} connected successfully`, 'success');
        }
        
        // Setup integration-specific features
        this.setupIntegrationFeatures(integrationId);
      } else {
        throw new Error(authResult.error);
      }
    } catch (error) {
      console.error('Integration connection failed:', error);
      if (window.app) {
        window.app.showNotification(`Failed to connect ${integration.name}`, 'error');
      }
    }
  }
  
  async simulateOAuthFlow(integration) {
    // Simulate OAuth authorization flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
      return {
        success: true,
        accessToken: 'access_token_' + Date.now(),
        refreshToken: 'refresh_token_' + Date.now(),
        expiresIn: 3600
      };
    } else {
      return {
        success: false,
        error: 'Authorization denied'
      };
    }
  }
  
  disconnectIntegration(integrationId) {
    const integration = this.connectedServices.get(integrationId);
    if (!integration) return;
    
    if (confirm(`Disconnect ${integration.name}?`)) {
      this.connectedServices.delete(integrationId);
      this.saveConnectedServices();
      this.updateIntegrationsUI();
      
      if (window.app) {
        window.app.showNotification(`${integration.name} disconnected`, 'info');
      }
    }
  }
  
  configureIntegration(integrationId) {
    const integration = this.connectedServices.get(integrationId);
    if (!integration) return;
    
    this.showConfigurationModal(integrationId, integration);
  }
  
  showConfigurationModal(integrationId, integration) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'integrationConfigModal';
    
    const settingsHtml = this.generateSettingsHTML(integrationId, integration.settings);
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Configure ${integration.name}</h3>
          <button class="modal-close" onclick="closeModal('integrationConfigModal')">&times;</button>
        </div>
        <div class="modal-body">
          <form id="integrationConfigForm" data-integration="${integrationId}">
            ${settingsHtml}
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('integrationConfigModal')">Cancel</button>
          <button type="submit" form="integrationConfigForm" class="btn btn-primary">Save Settings</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('integrationConfigForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveIntegrationSettings(integrationId, new FormData(form));
    });
  }
  
  generateSettingsHTML(integrationId, currentSettings) {
    switch (integrationId) {
      case 'slack':
        return `
          <div class="form-group">
            <label>Default Channel</label>
            <input type="text" name="defaultChannel" value="${currentSettings.defaultChannel || '#general'}" class="form-input">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="autoShare" ${currentSettings.autoShare ? 'checked' : ''}>
              Automatically share transcripts
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="notifications" ${currentSettings.notifications ? 'checked' : ''}>
              Send notifications for new transcripts
            </label>
          </div>
        `;
        
      case 'google-calendar':
        return `
          <div class="form-group">
            <label>Calendar to sync</label>
            <select name="calendarId" class="select-input">
              <option value="primary" ${currentSettings.calendarId === 'primary' ? 'selected' : ''}>Primary Calendar</option>
              <option value="work" ${currentSettings.calendarId === 'work' ? 'selected' : ''}>Work Calendar</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="autoSchedule" ${currentSettings.autoSchedule ? 'checked' : ''}>
              Automatically schedule transcription sessions
            </label>
          </div>
          <div class="form-group">
            <label>Reminder time (minutes before)</label>
            <input type="number" name="reminderTime" value="${currentSettings.reminderTime || 15}" class="form-input">
          </div>
        `;
        
      case 'teams':
        return `
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="liveTranscription" ${currentSettings.liveTranscription ? 'checked' : ''}>
              Enable live transcription in meetings
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="autoJoin" ${currentSettings.autoJoin ? 'checked' : ''}>
              Automatically join scheduled meetings
            </label>
          </div>
          <div class="form-group">
            <label>Bot name</label>
            <input type="text" name="botName" value="${currentSettings.botName || 'Accent Neutralizer'}" class="form-input">
          </div>
        `;
        
      default:
        return `
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="enabled" ${currentSettings.enabled ? 'checked' : ''}>
              Enable integration
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="autoSync" ${currentSettings.autoSync ? 'checked' : ''}>
              Automatically sync data
            </label>
          </div>
        `;
    }
  }
  
  saveIntegrationSettings(integrationId, formData) {
    const integration = this.connectedServices.get(integrationId);
    if (!integration) return;
    
    const settings = {};
    for (const [key, value] of formData.entries()) {
      if (value === 'on') {
        settings[key] = true;
      } else {
        settings[key] = value;
      }
    }
    
    integration.settings = { ...integration.settings, ...settings };
    this.connectedServices.set(integrationId, integration);
    this.saveConnectedServices();
    
    if (window.app) {
      window.app.closeModal('integrationConfigModal');
      window.app.showNotification('Settings saved successfully', 'success');
    }
  }
  
  getDefaultSettings(integrationId) {
    const defaults = {
      'slack': {
        defaultChannel: '#general',
        autoShare: false,
        notifications: true
      },
      'teams': {
        liveTranscription: true,
        autoJoin: false,
        botName: 'Accent Neutralizer'
      },
      'google-calendar': {
        calendarId: 'primary',
        autoSchedule: false,
        reminderTime: 15
      },
      'zoom': {
        autoRecord: true,
        autoTranscribe: true,
        saveToCloud: false
      }
    };
    
    return defaults[integrationId] || { enabled: true, autoSync: false };
  }
  
  setupIntegrationFeatures(integrationId) {
    const integration = this.connectedServices.get(integrationId);
    if (!integration) return;
    
    switch (integrationId) {
      case 'slack':
        this.setupSlackBot();
        break;
      case 'teams':
        this.setupTeamsBot();
        break;
      case 'google-calendar':
        this.setupCalendarSync();
        break;
      case 'zoom':
        this.setupZoomIntegration();
        break;
    }
  }
  
  setupSlackBot() {
    // Simulate Slack bot setup
    console.log('Setting up Slack bot...');
    
    // Add Slack-specific functionality
    this.slackCommands = new Map([
      ['/transcribe', this.handleSlackTranscribeCommand.bind(this)],
      ['/share-transcript', this.handleSlackShareCommand.bind(this)],
      ['/meeting-summary', this.handleSlackSummaryCommand.bind(this)]
    ]);
  }
  
  setupTeamsBot() {
    // Simulate Teams bot setup
    console.log('Setting up Teams bot...');
    
    // Add Teams-specific functionality
    this.teamsCommands = new Map([
      ['start transcription', this.handleTeamsStartCommand.bind(this)],
      ['stop transcription', this.handleTeamsStopCommand.bind(this)],
      ['get summary', this.handleTeamsSummaryCommand.bind(this)]
    ]);
  }
  
  setupCalendarSync() {
    // Simulate calendar synchronization
    console.log('Setting up calendar sync...');
    
    // Start periodic sync
    this.calendarSyncInterval = setInterval(() => {
      this.syncCalendarEvents();
    }, 5 * 60 * 1000); // Every 5 minutes
  }
  
  setupZoomIntegration() {
    // Simulate Zoom integration setup
    console.log('Setting up Zoom integration...');
    
    // Setup webhook listeners for Zoom events
    this.zoomWebhooks = new Map([
      ['meeting.started', this.handleZoomMeetingStarted.bind(this)],
      ['meeting.ended', this.handleZoomMeetingEnded.bind(this)],
      ['recording.completed', this.handleZoomRecordingCompleted.bind(this)]
    ]);
  }
  
  // Slack command handlers
  handleSlackTranscribeCommand(command, user, channel) {
    // Start transcription and notify Slack
    if (window.transcriptionManager) {
      window.transcriptionManager.startRecording();
      return `Transcription started by ${user} in ${channel}`;
    }
    return 'Failed to start transcription';
  }
  
  handleSlackShareCommand(command, user, channel) {
    // Share current transcript to Slack
    const transcript = this.getCurrentTranscript();
    if (transcript) {
      this.shareToSlack(transcript, channel);
      return 'Transcript shared successfully';
    }
    return 'No transcript available to share';
  }
  
  handleSlackSummaryCommand(command, user, channel) {
    // Generate and share meeting summary
    const summary = this.generateMeetingSummary();
    if (summary) {
      this.shareToSlack(summary, channel);
      return 'Meeting summary shared';
    }
    return 'No meeting data available for summary';
  }
  
  // Teams command handlers
  handleTeamsStartCommand(command, user, meeting) {
    if (window.transcriptionManager) {
      window.transcriptionManager.startRecording();
      return 'Live transcription started';
    }
    return 'Failed to start transcription';
  }
  
  handleTeamsStopCommand(command, user, meeting) {
    if (window.transcriptionManager) {
      window.transcriptionManager.stopRecording();
      return 'Transcription stopped';
    }
    return 'No active transcription';
  }
  
  handleTeamsSummaryCommand(command, user, meeting) {
    const summary = this.generateMeetingSummary();
    return summary || 'No meeting data available';
  }
  
  // Zoom webhook handlers
  handleZoomMeetingStarted(event) {
    console.log('Zoom meeting started:', event);
    
    const settings = this.connectedServices.get('zoom')?.settings;
    if (settings?.autoTranscribe) {
      // Auto-start transcription
      if (window.transcriptionManager) {
        window.transcriptionManager.startRecording();
      }
    }
  }
  
  handleZoomMeetingEnded(event) {
    console.log('Zoom meeting ended:', event);
    
    // Auto-stop transcription
    if (window.transcriptionManager?.isRecording) {
      window.transcriptionManager.stopRecording();
    }
    
    // Generate summary
    setTimeout(() => {
      this.generateAndShareSummary();
    }, 5000);
  }
  
  handleZoomRecordingCompleted(event) {
    console.log('Zoom recording completed:', event);
    
    // Process recording for transcription
    this.processZoomRecording(event.recording_url);
  }
  
  // Calendar sync
  async syncCalendarEvents() {
    const calendarIntegration = this.connectedServices.get('google-calendar');
    if (!calendarIntegration) return;
    
    try {
      // Simulate fetching calendar events
      const events = await this.fetchCalendarEvents();
      
      // Process events for auto-scheduling
      events.forEach(event => {
        if (this.shouldAutoScheduleTranscription(event)) {
          this.scheduleTranscription(event);
        }
      });
    } catch (error) {
      console.error('Calendar sync failed:', error);
    }
  }
  
  async fetchCalendarEvents() {
    // Simulate API call to fetch calendar events
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'event1',
        title: 'Team Standup',
        start: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        end: new Date(Date.now() + 90 * 60 * 1000),   // 1.5 hours from now
        attendees: ['user1@example.com', 'user2@example.com']
      },
      {
        id: 'event2',
        title: 'Client Meeting',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        end: new Date(Date.now() + 3 * 60 * 60 * 1000),   // 3 hours from now
        attendees: ['client@example.com']
      }
    ];
  }
  
  shouldAutoScheduleTranscription(event) {
    const settings = this.connectedServices.get('google-calendar')?.settings;
    return settings?.autoSchedule && event.attendees.length > 1;
  }
  
  scheduleTranscription(event) {
    // Schedule automatic transcription for the event
    const reminderTime = this.connectedServices.get('google-calendar')?.settings?.reminderTime || 15;
    const startTime = new Date(event.start.getTime() - reminderTime * 60 * 1000);
    
    setTimeout(() => {
      this.sendMeetingReminder(event);
    }, startTime.getTime() - Date.now());
  }
  
  sendMeetingReminder(event) {
    if (window.notificationsManager) {
      window.notificationsManager.showNotification({
        title: 'Meeting Reminder',
        body: `"${event.title}" starts in 15 minutes. Transcription will be available.`,
        type: 'meeting-reminder',
        actions: [
          { action: 'join', title: 'Join Meeting' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    }
  }
  
  // Utility methods
  getCurrentTranscript() {
    const transcriptionArea = document.getElementById('transcriptionArea');
    if (transcriptionArea) {
      const messages = transcriptionArea.querySelectorAll('.message-bubble');
      return Array.from(messages).map(msg => msg.textContent).join('\n');
    }
    return null;
  }
  
  generateMeetingSummary() {
    const transcript = this.getCurrentTranscript();
    if (!transcript) return null;
    
    // Simple summary generation (in real app, use AI)
    const sentences = transcript.split('.').filter(s => s.trim());
    const summary = sentences.slice(0, 3).join('. ') + '.';
    
    return `Meeting Summary:\n${summary}\n\nKey Points:\n- Discussion about project progress\n- Action items identified\n- Next steps planned`;
  }
  
  shareToSlack(content, channel) {
    // Simulate sharing to Slack
    console.log(`Sharing to Slack channel ${channel}:`, content);
    
    if (window.app) {
      window.app.showNotification(`Shared to ${channel}`, 'success');
    }
  }
  
  processZoomRecording(recordingUrl) {
    // Simulate processing Zoom recording
    console.log('Processing Zoom recording:', recordingUrl);
    
    if (window.app) {
      window.app.showNotification('Processing Zoom recording for transcription', 'info');
    }
  }
  
  generateAndShareSummary() {
    const summary = this.generateMeetingSummary();
    if (summary) {
      // Share to connected services
      this.connectedServices.forEach((integration, id) => {
        if (integration.settings?.autoShare) {
          this.shareToService(id, summary);
        }
      });
    }
  }
  
  shareToService(serviceId, content) {
    switch (serviceId) {
      case 'slack':
        const slackSettings = this.connectedServices.get('slack')?.settings;
        this.shareToSlack(content, slackSettings?.defaultChannel || '#general');
        break;
      case 'teams':
        console.log('Sharing to Teams:', content);
        break;
      default:
        console.log(`Sharing to ${serviceId}:`, content);
    }
  }
  
  setupWebhook() {
    const webhookUrl = `${window.location.origin}/api/webhooks/${Date.now()}`;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'webhookModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Webhook Setup</h3>
          <button class="modal-close" onclick="closeModal('webhookModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="webhook-info">
            <p>Use this webhook URL to receive real-time notifications:</p>
            <div class="webhook-url">
              <input type="text" value="${webhookUrl}" readonly class="form-input">
              <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText('${webhookUrl}')">Copy</button>
            </div>
          </div>
          
          <div class="webhook-events">
            <h4>Available Events:</h4>
            <ul>
              <li>transcription.started</li>
              <li>transcription.completed</li>
              <li>meeting.summary_generated</li>
              <li>speaker.identified</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  generateApiKey() {
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'apiKeyModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>API Key Generated</h3>
          <button class="modal-close" onclick="closeModal('apiKeyModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="api-key-info">
            <p><strong>Your new API key:</strong></p>
            <div class="api-key">
              <input type="text" value="${apiKey}" readonly class="form-input">
              <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText('${apiKey}')">Copy</button>
            </div>
            <p class="warning">⚠️ Store this key securely. It won't be shown again.</p>
          </div>
          
          <div class="api-usage">
            <h4>Usage Example:</h4>
            <pre><code>curl -H "Authorization: Bearer ${apiKey}" \\
     -H "Content-Type: application/json" \\
     -d '{"text": "Hello world"}' \\
     ${window.location.origin}/api/transcribe</code></pre>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  updateIntegrationsUI() {
    const integrationsContainer = document.getElementById('integrationsContainer');
    if (!integrationsContainer) return;
    
    integrationsContainer.innerHTML = '';
    
    // Group integrations by category
    const categories = new Map();
    this.availableIntegrations.forEach((integration, id) => {
      const category = integration.category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push({ id, ...integration });
    });
    
    // Render each category
    categories.forEach((integrations, category) => {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'integration-category';
      
      categoryElement.innerHTML = `
        <h3>${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</h3>
        <div class="integrations-grid">
          ${integrations.map(integration => this.createIntegrationCard(integration)).join('')}
        </div>
      `;
      
      integrationsContainer.appendChild(categoryElement);
    });
  }
  
  createIntegrationCard(integration) {
    const isConnected = this.connectedServices.has(integration.id);
    const connectedData = this.connectedServices.get(integration.id);
    
    return `
      <div class="integration-card ${isConnected ? 'connected' : ''}">
        <div class="integration-header">
          <div class="integration-icon">${integration.icon}</div>
          <div class="integration-info">
            <h4>${integration.name}</h4>
            <p>${integration.description}</p>
          </div>
          <div class="integration-status">
            ${isConnected ? '<span class="status-badge connected">Connected</span>' : '<span class="status-badge">Available</span>'}
          </div>
        </div>
        
        <div class="integration-features">
          ${integration.features.map(feature => `<span class="feature-tag">${feature.replace('-', ' ')}</span>`).join('')}
        </div>
        
        ${isConnected ? `
          <div class="integration-details">
            <p>Connected on ${new Date(connectedData.connectedAt).toLocaleDateString()}</p>
          </div>
        ` : ''}
        
        <div class="integration-actions">
          ${isConnected ? `
            <button class="btn btn-sm configure-integration-btn" data-integration="${integration.id}">Configure</button>
            <button class="btn btn-sm btn-secondary disconnect-integration-btn" data-integration="${integration.id}">Disconnect</button>
          ` : `
            <button class="btn btn-sm btn-primary connect-integration-btn" data-integration="${integration.id}">Connect</button>
          `}
        </div>
      </div>
    `;
  }
  
  saveConnectedServices() {
    const data = Array.from(this.connectedServices.entries());
    localStorage.setItem('connected-integrations', JSON.stringify(data));
  }
  
  loadConnectedServices() {
    const saved = localStorage.getItem('connected-integrations');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.connectedServices = new Map(data);
        
        // Restart integration features
        this.connectedServices.forEach((integration, id) => {
          this.setupIntegrationFeatures(id);
        });
      } catch (error) {
        console.error('Error loading connected services:', error);
      }
    }
  }
}
