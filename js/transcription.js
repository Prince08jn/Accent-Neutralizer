
// ... rest of the code// Transcription Manager
class TranscriptionManager {
  constructor() {
    this.isRecording = false;
    this.isListening = false;
    this.messageCounter = 0;
    this.transcriptionInterval = null;
    
    // DOM elements
    this.micButton = null;
    this.micText = null;
    this.statusIndicator = null;
    this.statusText = null;
    this.transcriptionArea = null;
    this.clearButton = null;
    this.exportButton = null;
    this.shareButton = null;
    this.confidenceSlider = null;
    
    // Sample transcription data for simulation
    this.sampleTranscriptions = [
      "Hello everyone, I hope you're all doing well today.",
      "Let's start with the quarterly review and discuss our progress.",
      "I think we should focus on improving our customer satisfaction metrics.",
      "The new feature rollout went smoothly, and we received positive feedback.",
      "Can everyone please share their updates for this week?",
      "I'd like to schedule a follow-up meeting to discuss the implementation details.",
      "The client presentation is scheduled for next Tuesday at 2 PM.",
      "We need to address the performance issues in the mobile application.",
      "Great work on the project delivery, the team exceeded expectations.",
      "Let's wrap up today's meeting and continue this discussion tomorrow.",
      "I have some concerns about the timeline for the next sprint.",
      "The budget allocation looks good for the upcoming quarter.",
      "We should consider implementing automated testing for better quality assurance.",
      "The user feedback has been overwhelmingly positive about the new interface.",
      "I'll send out the meeting notes and action items after this call."
    ];
    
    this.userResponses = [
      "That sounds great, thank you for the update.",
      "I agree with that approach.",
      "Could you provide more details on that?",
      "Yes, I can work on that this week.",
      "That's a good point, let me think about it.",
      "I'll follow up with the team on this.",
      "Perfect, let's move forward with that plan.",
      "I have a few questions about the implementation.",
      "The timeline looks reasonable to me.",
      "I'll need to check with my team first.",
      "That aligns with our current priorities.",
      "I can help with the testing phase."
    ];
  }
  
  initialize() {
    this.setupDOMElements();
    this.setupEventListeners();
    this.setupSliderUpdates();
  }
  
  setupDOMElements() {
    this.micButton = document.getElementById('micButton');
    this.micText = this.micButton?.querySelector('.mic-text');
    this.statusIndicator = document.getElementById('statusIndicator');
    this.statusText = this.statusIndicator?.querySelector('.status-text');
    this.transcriptionArea = document.getElementById('transcriptionArea');
    this.clearButton = document.getElementById('clearButton');
    this.exportButton = document.getElementById('exportButton');
    this.shareButton = document.getElementById('shareButton');
    this.confidenceSlider = document.getElementById('confidenceSlider');
  }
  
  setupEventListeners() {
    if (this.micButton) {
      this.micButton.addEventListener('click', () => this.toggleRecording());
    }
    
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearTranscription());
    }
    
    if (this.exportButton) {
      this.exportButton.addEventListener('click', () => this.exportTranscription());
    }
    
    if (this.shareButton) {
      this.shareButton.addEventListener('click', () => this.shareTranscription());
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        this.toggleRecording();
      }
      if (e.code === 'KeyC' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        this.clearTranscription();
      }
    });
  }
  
  setupSliderUpdates() {
    if (this.confidenceSlider) {
      const sliderValue = document.querySelector('.slider-value');
      this.confidenceSlider.addEventListener('input', (e) => {
        const value = Math.round(e.target.value * 100);
        if (sliderValue) {
          sliderValue.textContent = `${value}%`;
        }
      });
    }
  }
  
  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
  
  startRecording() {
    this.isRecording = true;
    this.isListening = true;
    
    // Update UI
    if (this.micButton) this.micButton.classList.add('recording');
    if (this.micText) this.micText.textContent = 'Stop Speaking';
    if (this.statusIndicator) this.statusIndicator.classList.add('listening');
    if (this.statusText) this.statusText.textContent = 'Listening...';
    
    // Clear welcome message if present
    this.clearWelcomeMessage();
    
    // Start simulated transcription
    this.startTranscriptionSimulation();
    
    // Show notification
    if (window.app) {
      window.app.showNotification('Recording started', 'success');
    }
    
    console.log('Recording started');
  }
  
  stopRecording() {
    this.isRecording = false;
    this.isListening = false;
    
    // Update UI
    if (this.micButton) this.micButton.classList.remove('recording');
    if (this.micText) this.micText.textContent = 'Start Speaking';
    if (this.statusIndicator) this.statusIndicator.classList.remove('listening');
    if (this.statusText) this.statusText.textContent = 'Ready to listen';
    
    // Stop simulated transcription
    this.stopTranscriptionSimulation();
    
    // Show notification
    if (window.app) {
      window.app.showNotification('Recording stopped', 'info');
    }
    
    console.log('Recording stopped');
  }
  
  startTranscriptionSimulation() {
    // Simulate receiving transcribed messages at random intervals
    this.transcriptionInterval = setInterval(() => {
      if (this.isRecording) {
        this.simulateIncomingMessage();
      }
    }, Math.random() * 4000 + 2000); // Random interval between 2-6 seconds
  }
  
  stopTranscriptionSimulation() {
    if (this.transcriptionInterval) {
      clearInterval(this.transcriptionInterval);
      this.transcriptionInterval = null;
    }
  }
  
  simulateIncomingMessage() {
    // Show typing indicator
    this.showTypingIndicator();
    
    // After a short delay, show the actual message
    setTimeout(() => {
      this.hideTypingIndicator();
      
      const randomMessage = this.sampleTranscriptions[
        Math.floor(Math.random() * this.sampleTranscriptions.length)
      ];
      
      this.addMessage(randomMessage, 'system');
    }, Math.random() * 2000 + 1000); // 1-3 seconds typing delay
  }
  
  showTypingIndicator() {
    // Remove existing typing indicator
    this.hideTypingIndicator();
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typingIndicator';
    
    typingIndicator.innerHTML = `
      <span>Transcribing</span>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    if (this.transcriptionArea) {
      this.transcriptionArea.appendChild(typingIndicator);
      this.scrollToBottom();
    }
  }
  
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  addMessage(text, type = 'system') {
    this.messageCounter++;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
      <div class="message-bubble">${this.escapeHtml(text)}</div>
      <div class="message-time">${currentTime}</div>
    `;
    
    if (this.transcriptionArea) {
      this.transcriptionArea.appendChild(messageElement);
      this.scrollToBottom();
    }
    
    // Simulate user response occasionally
    if (type === 'system' && Math.random() < 0.3) {
      setTimeout(() => {
        this.addUserResponse();
      }, Math.random() * 3000 + 1000);
    }
  }
  
  addUserResponse() {
    const randomResponse = this.userResponses[
      Math.floor(Math.random() * this.userResponses.length)
    ];
    
    this.addMessage(randomResponse, 'user');
  }
  
  clearWelcomeMessage() {
    if (this.transcriptionArea) {
      const welcomeMessage = this.transcriptionArea.querySelector('.welcome-message');
      if (welcomeMessage) {
        welcomeMessage.remove();
      }
    }
  }
  
  clearTranscription() {
    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording();
    }
    
    // Clear all messages
    if (this.transcriptionArea) {
      this.transcriptionArea.innerHTML = `
        <div class="welcome-message">
          <div class="welcome-icon">🎤</div>
          <h3>Ready to Transcribe</h3>
          <p>Click "Start Speaking" to begin real-time transcription. Your speech will be converted to clear, neutral text.</p>
        </div>
      `;
    }
    
    this.messageCounter = 0;
    
    // Show notification
    if (window.app) {
      window.app.showNotification('Transcription cleared', 'info');
    }
    
    console.log('Transcription cleared');
  }
  
  exportTranscription() {
    const messages = this.transcriptionArea?.querySelectorAll('.message');
    if (!messages || messages.length === 0) {
      if (window.app) {
        window.app.showNotification('No transcription to export', 'warning');
      }
      return;
    }
    
    let exportText = 'Accent Neutralizer Transcription\n';
    exportText += '=====================================\n\n';
    
    messages.forEach(message => {
      const bubble = message.querySelector('.message-bubble');
      const time = message.querySelector('.message-time');
      const type = message.classList.contains('user') ? 'You' : 'Speaker';
      
      if (bubble && time) {
        exportText += `[${time.textContent}] ${type}: ${bubble.textContent}\n`;
      }
    });
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show notification
    if (window.app) {
      window.app.showNotification('Transcription exported successfully', 'success');
    }
  }
  
  shareTranscription() {
    const messages = this.transcriptionArea?.querySelectorAll('.message');
    if (!messages || messages.length === 0) {
      if (window.app) {
        window.app.showNotification('No transcription to share', 'warning');
      }
      return;
    }
    
    let shareText = 'Accent Neutralizer Transcription:\n\n';
    
    messages.forEach(message => {
      const bubble = message.querySelector('.message-bubble');
      const type = message.classList.contains('user') ? 'You' : 'Speaker';
      
      if (bubble) {
        shareText += `${type}: ${bubble.textContent}\n`;
      }
    });
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Accent Neutralizer Transcription',
        text: shareText
      }).then(() => {
        if (window.app) {
          window.app.showNotification('Transcription shared successfully', 'success');
        }
      }).catch(err => {
        console.log('Error sharing:', err);
        this.fallbackShare(shareText);
      });
    } else {
      this.fallbackShare(shareText);
    }
  }
  
  fallbackShare(text) {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(text).then(() => {
      if (window.app) {
        window.app.showNotification('Transcription copied to clipboard', 'success');
      }
    }).catch(err => {
      console.log('Error copying to clipboard:', err);
      if (window.app) {
        window.app.showNotification('Unable to share transcription', 'error');
      }
    });
  }
  
  scrollToBottom() {
    if (this.transcriptionArea) {
      this.transcriptionArea.scrollTop = this.transcriptionArea.scrollHeight;
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Method for real audio recording setup (for future implementation)
  async setupAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Send audio data to server for transcription
          this.sendAudioData(event.data);
        }
      };
      
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (this.statusText) {
        this.statusText.textContent = 'Microphone access denied';
      }
      return false;
    }
  }
  
  sendAudioData(audioBlob) {
    // Convert audio blob to appropriate format and send to server
    // This would be implemented based on your backend requirements
    console.log('Audio data ready to send:', audioBlob);
  }
}

// Example using fetch
const formData = new FormData();
formData.append('audio', audioBlob);
fetch('http://localhost:5000/api/transcribe', {
  method: 'POST',
  body: formData,
  headers: { 'Authorization': 'Bearer ' + yourToken }
})
  .then(res => res.json())
  .then(data => { /* display transcription */ });
