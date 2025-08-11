// Team Collaboration Manager
class CollaborationManager {
  constructor() {
    this.activeRooms = new Map();
    this.currentRoom = null;
    this.participants = new Map();
    this.chatMessages = [];
    this.sharedTranscripts = new Map();
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Room creation
    const createRoomBtn = document.getElementById('createRoomBtn');
    if (createRoomBtn) {
      createRoomBtn.addEventListener('click', () => this.createRoom());
    }
    
    // Join room
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    if (joinRoomBtn) {
      joinRoomBtn.addEventListener('click', () => this.joinRoom());
    }
    
    // Chat form
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => this.sendChatMessage(e));
    }
    
    // Share transcript
    const shareTranscriptBtn = document.getElementById('shareTranscriptBtn');
    if (shareTranscriptBtn) {
      shareTranscriptBtn.addEventListener('click', () => this.shareTranscript());
    }
  }
  
  async createRoom() {
    if (!window.authManager?.requireAuth()) return;
    
    const roomName = prompt('Enter room name:');
    if (!roomName) return;
    
    try {
      const roomId = this.generateRoomId();
      const room = {
        id: roomId,
        name: roomName,
        creator: window.authManager.getCurrentUser(),
        participants: new Map(),
        transcript: [],
        chat: [],
        settings: {
          language: 'auto',
          targetLanguage: 'en',
          speakerDiarization: true,
          realTimeTranslation: false
        },
        createdAt: new Date().toISOString()
      };
      
      this.activeRooms.set(roomId, room);
      await this.joinRoomById(roomId);
      
      if (window.app) {
        window.app.showNotification(`Room "${roomName}" created successfully`, 'success');
      }
      
      this.updateRoomsList();
    } catch (error) {
      console.error('Failed to create room:', error);
      if (window.app) {
        window.app.showNotification('Failed to create room', 'error');
      }
    }
  }
  
  async joinRoom() {
    const roomId = prompt('Enter room ID:');
    if (!roomId) return;
    
    await this.joinRoomById(roomId);
  }
  
  async joinRoomById(roomId) {
    if (!window.authManager?.requireAuth()) return;
    
    try {
      // Simulate room lookup
      let room = this.activeRooms.get(roomId);
      
      if (!room) {
        // Simulate fetching room from server
        room = await this.fetchRoom(roomId);
        if (room) {
          this.activeRooms.set(roomId, room);
        }
      }
      
      if (!room) {
        throw new Error('Room not found');
      }
      
      const user = window.authManager.getCurrentUser();
      room.participants.set(user.id, {
        ...user,
        joinedAt: new Date().toISOString(),
        isActive: true
      });
      
      this.currentRoom = room;
      this.updateCollaborationUI();
      
      if (window.app) {
        window.app.showNotification(`Joined room "${room.name}"`, 'success');
        window.app.showSection('collaboration');
      }
      
      // Simulate real-time updates
      this.startRealTimeUpdates();
      
    } catch (error) {
      console.error('Failed to join room:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  async fetchRoom(roomId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return demo room if specific ID
    if (roomId === 'demo-room') {
      return {
        id: 'demo-room',
        name: 'Demo Collaboration Room',
        creator: { id: 'demo', name: 'Demo User', avatar: 'DU' },
        participants: new Map(),
        transcript: [
          {
            id: '1',
            speaker: 'Demo User',
            text: 'Welcome to the collaboration room!',
            timestamp: new Date().toISOString(),
            language: 'en'
          }
        ],
        chat: [],
        settings: {
          language: 'auto',
          targetLanguage: 'en',
          speakerDiarization: true,
          realTimeTranslation: false
        },
        createdAt: new Date().toISOString()
      };
    }
    
    return null;
  }
  
  leaveRoom() {
    if (!this.currentRoom) return;
    
    const user = window.authManager.getCurrentUser();
    if (user && this.currentRoom.participants.has(user.id)) {
      this.currentRoom.participants.delete(user.id);
    }
    
    this.currentRoom = null;
    this.stopRealTimeUpdates();
    this.updateCollaborationUI();
    
    if (window.app) {
      window.app.showNotification('Left the room', 'info');
    }
  }
  
  sendChatMessage(event) {
    event.preventDefault();
    
    if (!this.currentRoom) return;
    
    const formData = new FormData(event.target);
    const messageText = formData.get('message');
    
    if (!messageText.trim()) return;
    
    const user = window.authManager.getCurrentUser();
    const message = {
      id: Date.now().toString(),
      user: user,
      text: messageText,
      timestamp: new Date().toISOString(),
      type: 'message'
    };
    
    this.currentRoom.chat.push(message);
    this.updateChatUI();
    
    // Clear form
    event.target.reset();
    
    // Simulate sending to other participants
    this.broadcastMessage(message);
  }
  
  addTranscriptComment(transcriptId, comment) {
    if (!this.currentRoom) return;
    
    const user = window.authManager.getCurrentUser();
    const commentObj = {
      id: Date.now().toString(),
      transcriptId: transcriptId,
      user: user,
      text: comment,
      timestamp: new Date().toISOString(),
      type: 'comment'
    };
    
    this.currentRoom.chat.push(commentObj);
    this.updateChatUI();
    this.broadcastMessage(commentObj);
  }
  
  shareTranscript() {
    if (!this.currentRoom) return;
    
    const transcript = this.currentRoom.transcript;
    if (transcript.length === 0) {
      if (window.app) {
        window.app.showNotification('No transcript to share', 'warning');
      }
      return;
    }
    
    const shareId = this.generateShareId();
    const shareData = {
      id: shareId,
      roomId: this.currentRoom.id,
      roomName: this.currentRoom.name,
      transcript: transcript,
      sharedBy: window.authManager.getCurrentUser(),
      sharedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    this.sharedTranscripts.set(shareId, shareData);
    
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      if (window.app) {
        window.app.showNotification('Share link copied to clipboard', 'success');
      }
    });
    
    // Show share modal
    this.showShareModal(shareUrl, shareData);
  }
  
  showShareModal(shareUrl, shareData) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'shareModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Share Transcript</h3>
          <button class="modal-close" onclick="closeModal('shareModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="share-info">
            <h4>${shareData.roomName}</h4>
            <p>Shared by ${shareData.sharedBy.name}</p>
            <p>Expires: ${new Date(shareData.expiresAt).toLocaleDateString()}</p>
          </div>
          
          <div class="share-url">
            <label>Share URL:</label>
            <div class="url-container">
              <input type="text" value="${shareUrl}" readonly class="form-input">
              <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText('${shareUrl}')">Copy</button>
            </div>
          </div>
          
          <div class="share-options">
            <h4>Share via:</h4>
            <div class="share-buttons">
              <button class="btn btn-sm" onclick="collaborationManager.shareViaEmail('${shareUrl}')">
                <span class="btn-icon">📧</span> Email
              </button>
              <button class="btn btn-sm" onclick="collaborationManager.shareViaSlack('${shareUrl}')">
                <span class="btn-icon">💬</span> Slack
              </button>
              <button class="btn btn-sm" onclick="collaborationManager.shareViaTeams('${shareUrl}')">
                <span class="btn-icon">👥</span> Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  shareViaEmail(shareUrl) {
    const subject = encodeURIComponent('Shared Transcript from Accent Neutralizer');
    const body = encodeURIComponent(`Check out this shared transcript: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }
  
  shareViaSlack(shareUrl) {
    const text = encodeURIComponent(`Shared transcript: ${shareUrl}`);
    window.open(`https://slack.com/intl/en-in/help/articles/201330736-Add-apps-to-your-Slack-workspace?text=${text}`);
  }
  
  shareViaTeams(shareUrl) {
    const text = encodeURIComponent(`Shared transcript: ${shareUrl}`);
    window.open(`https://teams.microsoft.com/share?href=${encodeURIComponent(shareUrl)}&msgText=${text}`);
  }
  
  startRealTimeUpdates() {
    this.realTimeInterval = setInterval(() => {
      this.simulateRealTimeUpdates();
    }, 5000);
  }
  
  stopRealTimeUpdates() {
    if (this.realTimeInterval) {
      clearInterval(this.realTimeInterval);
      this.realTimeInterval = null;
    }
  }
  
  simulateRealTimeUpdates() {
    if (!this.currentRoom) return;
    
    // Simulate new transcript entries
    if (Math.random() < 0.3) {
      const speakers = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const messages = [
        'I think we should focus on the quarterly goals.',
        'The new feature is working well in testing.',
        'Can we schedule a follow-up meeting?',
        'The client feedback has been positive.',
        'We need to address the performance issues.'
      ];
      
      const newEntry = {
        id: Date.now().toString(),
        speaker: speakers[Math.floor(Math.random() * speakers.length)],
        text: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date().toISOString(),
        language: 'en'
      };
      
      this.currentRoom.transcript.push(newEntry);
      this.updateTranscriptUI();
    }
    
    // Simulate participant activity
    this.updateParticipantsUI();
  }
  
  updateCollaborationUI() {
    this.updateRoomInfo();
    this.updateParticipantsUI();
    this.updateTranscriptUI();
    this.updateChatUI();
  }
  
  updateRoomInfo() {
    const roomName = document.getElementById('currentRoomName');
    const roomId = document.getElementById('currentRoomId');
    const participantCount = document.getElementById('participantCount');
    
    if (this.currentRoom) {
      if (roomName) roomName.textContent = this.currentRoom.name;
      if (roomId) roomId.textContent = this.currentRoom.id;
      if (participantCount) participantCount.textContent = this.currentRoom.participants.size;
    }
  }
  
  updateParticipantsUI() {
    const participantsList = document.getElementById('participantsList');
    if (!participantsList || !this.currentRoom) return;
    
    participantsList.innerHTML = '';
    
    this.currentRoom.participants.forEach(participant => {
      const participantElement = document.createElement('div');
      participantElement.className = 'participant-item';
      participantElement.innerHTML = `
        <div class="participant-avatar">${participant.avatar}</div>
        <div class="participant-info">
          <div class="participant-name">${participant.name}</div>
          <div class="participant-status ${participant.isActive ? 'active' : 'inactive'}">
            ${participant.isActive ? 'Active' : 'Away'}
          </div>
        </div>
      `;
      participantsList.appendChild(participantElement);
    });
  }
  
  updateTranscriptUI() {
    const transcriptContainer = document.getElementById('collaborationTranscript');
    if (!transcriptContainer || !this.currentRoom) return;
    
    transcriptContainer.innerHTML = '';
    
    this.currentRoom.transcript.forEach(entry => {
      const entryElement = document.createElement('div');
      entryElement.className = 'transcript-entry';
      entryElement.innerHTML = `
        <div class="entry-header">
          <span class="speaker-name">${entry.speaker}</span>
          <span class="entry-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
          <button class="btn btn-sm comment-btn" onclick="collaborationManager.promptComment('${entry.id}')">
            💬 Comment
          </button>
        </div>
        <div class="entry-text">${entry.text}</div>
      `;
      transcriptContainer.appendChild(entryElement);
    });
    
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
  }
  
  updateChatUI() {
    const chatContainer = document.getElementById('collaborationChat');
    if (!chatContainer || !this.currentRoom) return;
    
    chatContainer.innerHTML = '';
    
    this.currentRoom.chat.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${message.type}`;
      
      if (message.type === 'comment') {
        messageElement.innerHTML = `
          <div class="message-header">
            <span class="message-user">${message.user.name}</span>
            <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
            <span class="comment-badge">Comment</span>
          </div>
          <div class="message-text">${message.text}</div>
        `;
      } else {
        messageElement.innerHTML = `
          <div class="message-header">
            <span class="message-user">${message.user.name}</span>
            <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="message-text">${message.text}</div>
        `;
      }
      
      chatContainer.appendChild(messageElement);
    });
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  promptComment(transcriptId) {
    const comment = prompt('Add a comment:');
    if (comment) {
      this.addTranscriptComment(transcriptId, comment);
    }
  }
  
  broadcastMessage(message) {
    // Simulate broadcasting to other participants
    console.log('Broadcasting message:', message);
  }
  
  generateRoomId() {
    return 'room-' + Math.random().toString(36).substr(2, 9);
  }
  
  generateShareId() {
    return 'share-' + Math.random().toString(36).substr(2, 12);
  }
  
  updateRoomsList() {
    const roomsList = document.getElementById('roomsList');
    if (!roomsList) return;
    
    roomsList.innerHTML = '';
    
    this.activeRooms.forEach(room => {
      const roomElement = document.createElement('div');
      roomElement.className = 'room-item';
      roomElement.innerHTML = `
        <div class="room-info">
          <h4>${room.name}</h4>
          <p>${room.participants.size} participants</p>
        </div>
        <button class="btn btn-sm btn-primary" onclick="collaborationManager.joinRoomById('${room.id}')">
          Join
        </button>
      `;
      roomsList.appendChild(roomElement);
    });
  }
}
