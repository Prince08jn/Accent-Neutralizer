// Speaker Diarization Manager
class SpeakerDiarizationManager {
  constructor() {
    this.speakers = new Map();
    this.currentSpeaker = null;
    this.speakerProfiles = new Map();
    this.isEnabled = true;
    this.confidenceThreshold = 0.7;
    
    this.setupEventListeners();
    this.initializeDefaultProfiles();
  }
  
  setupEventListeners() {
    // Enable/disable toggle
    const enableToggle = document.getElementById('speakerDiarizationToggle');
    if (enableToggle) {
      enableToggle.addEventListener('change', (e) => {
        this.isEnabled = e.target.checked;
        this.updateUI();
      });
    }
    
    // Confidence threshold slider
    const confidenceSlider = document.getElementById('confidenceThreshold');
    if (confidenceSlider) {
      confidenceSlider.addEventListener('input', (e) => {
        this.confidenceThreshold = parseFloat(e.target.value);
        this.updateConfidenceDisplay();
      });
    }
    
    // Add speaker button
    const addSpeakerBtn = document.getElementById('addSpeakerBtn');
    if (addSpeakerBtn) {
      addSpeakerBtn.addEventListener('click', () => this.addNewSpeaker());
    }
    
    // Train speaker button
    const trainSpeakerBtn = document.getElementById('trainSpeakerBtn');
    if (trainSpeakerBtn) {
      trainSpeakerBtn.addEventListener('click', () => this.trainSpeaker());
    }
  }
  
  initializeDefaultProfiles() {
    // Initialize with some default speaker profiles
    const defaultSpeakers = [
      {
        id: 'speaker1',
        name: 'Speaker 1',
        color: '#3b82f6',
        voiceprint: this.generateVoiceprint(),
        confidence: 0.9,
        totalSpeakTime: 0,
        lastActive: null
      },
      {
        id: 'speaker2',
        name: 'Speaker 2',
        color: '#10b981',
        voiceprint: this.generateVoiceprint(),
        confidence: 0.85,
        totalSpeakTime: 0,
        lastActive: null
      },
      {
        id: 'speaker3',
        name: 'Speaker 3',
        color: '#f59e0b',
        voiceprint: this.generateVoiceprint(),
        confidence: 0.8,
        totalSpeakTime: 0,
        lastActive: null
      }
    ];
    
    defaultSpeakers.forEach(speaker => {
      this.speakerProfiles.set(speaker.id, speaker);
    });
    
    this.updateSpeakersUI();
  }
  
  generateVoiceprint() {
    // Simulate voice characteristics
    return {
      pitch: Math.random() * 200 + 100, // 100-300 Hz
      formants: [
        Math.random() * 500 + 500,  // F1: 500-1000 Hz
        Math.random() * 1000 + 1000, // F2: 1000-2000 Hz
        Math.random() * 1000 + 2000  // F3: 2000-3000 Hz
      ],
      spectralCentroid: Math.random() * 2000 + 1000,
      mfcc: Array.from({ length: 13 }, () => Math.random() * 2 - 1),
      tempo: Math.random() * 100 + 100 // words per minute
    };
  }
  
  async identifySpeaker(audioFeatures) {
    if (!this.isEnabled) {
      return null;
    }
    
    try {
      // Simulate speaker identification process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let bestMatch = null;
      let highestConfidence = 0;
      
      this.speakerProfiles.forEach(speaker => {
        const confidence = this.calculateSimilarity(audioFeatures, speaker.voiceprint);
        
        if (confidence > highestConfidence && confidence > this.confidenceThreshold) {
          highestConfidence = confidence;
          bestMatch = speaker;
        }
      });
      
      if (bestMatch) {
        bestMatch.lastActive = new Date().toISOString();
        bestMatch.confidence = highestConfidence;
        this.currentSpeaker = bestMatch;
        
        this.updateSpeakerActivity(bestMatch.id);
        return bestMatch;
      }
      
      // If no match found, create new speaker
      return this.createUnknownSpeaker(audioFeatures);
      
    } catch (error) {
      console.error('Speaker identification failed:', error);
      return null;
    }
  }
  
  calculateSimilarity(features1, features2) {
    // Simplified similarity calculation
    let similarity = 0;
    let factors = 0;
    
    // Pitch similarity
    const pitchDiff = Math.abs(features1.pitch - features2.pitch);
    similarity += Math.max(0, 1 - pitchDiff / 200);
    factors++;
    
    // Formant similarity
    if (features1.formants && features2.formants) {
      for (let i = 0; i < Math.min(features1.formants.length, features2.formants.length); i++) {
        const formantDiff = Math.abs(features1.formants[i] - features2.formants[i]);
        similarity += Math.max(0, 1 - formantDiff / 1000);
        factors++;
      }
    }
    
    // MFCC similarity
    if (features1.mfcc && features2.mfcc) {
      let mfccSimilarity = 0;
      for (let i = 0; i < Math.min(features1.mfcc.length, features2.mfcc.length); i++) {
        mfccSimilarity += 1 - Math.abs(features1.mfcc[i] - features2.mfcc[i]) / 2;
      }
      similarity += mfccSimilarity / Math.min(features1.mfcc.length, features2.mfcc.length);
      factors++;
    }
    
    return factors > 0 ? similarity / factors : 0;
  }
  
  createUnknownSpeaker(audioFeatures) {
    const speakerId = 'speaker' + (this.speakerProfiles.size + 1);
    const colors = ['#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    
    const newSpeaker = {
      id: speakerId,
      name: `Speaker ${this.speakerProfiles.size + 1}`,
      color: colors[this.speakerProfiles.size % colors.length],
      voiceprint: audioFeatures,
      confidence: 0.6,
      totalSpeakTime: 0,
      lastActive: new Date().toISOString(),
      isNew: true
    };
    
    this.speakerProfiles.set(speakerId, newSpeaker);
    this.currentSpeaker = newSpeaker;
    
    this.updateSpeakersUI();
    
    if (window.app) {
      window.app.showNotification(`New speaker detected: ${newSpeaker.name}`, 'info');
    }
    
    return newSpeaker;
  }
  
  updateSpeakerActivity(speakerId) {
    const speaker = this.speakerProfiles.get(speakerId);
    if (speaker) {
      speaker.totalSpeakTime += 1; // Increment by 1 second (simplified)
      this.updateSpeakersUI();
    }
  }
  
  addNewSpeaker() {
    const name = prompt('Enter speaker name:');
    if (!name) return;
    
    const speakerId = 'custom-' + Date.now();
    const colors = ['#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    
    const newSpeaker = {
      id: speakerId,
      name: name,
      color: colors[this.speakerProfiles.size % colors.length],
      voiceprint: this.generateVoiceprint(),
      confidence: 0.5,
      totalSpeakTime: 0,
      lastActive: null,
      isCustom: true
    };
    
    this.speakerProfiles.set(speakerId, newSpeaker);
    this.updateSpeakersUI();
    
    if (window.app) {
      window.app.showNotification(`Speaker "${name}" added`, 'success');
    }
  }
  
  trainSpeaker() {
    if (!this.currentSpeaker) {
      if (window.app) {
        window.app.showNotification('No active speaker to train', 'warning');
      }
      return;
    }
    
    if (window.app) {
      window.app.showNotification('Training speaker model...', 'info');
    }
    
    // Simulate training process
    setTimeout(() => {
      this.currentSpeaker.confidence = Math.min(0.95, this.currentSpeaker.confidence + 0.1);
      this.updateSpeakersUI();
      
      if (window.app) {
        window.app.showNotification(`${this.currentSpeaker.name} training completed`, 'success');
      }
    }, 3000);
  }
  
  renameSpeaker(speakerId, newName) {
    const speaker = this.speakerProfiles.get(speakerId);
    if (speaker) {
      speaker.name = newName;
      this.updateSpeakersUI();
      
      if (window.app) {
        window.app.showNotification('Speaker renamed', 'success');
      }
    }
  }
  
  removeSpeaker(speakerId) {
    if (this.speakerProfiles.has(speakerId)) {
      const speaker = this.speakerProfiles.get(speakerId);
      
      if (confirm(`Remove speaker "${speaker.name}"?`)) {
        this.speakerProfiles.delete(speakerId);
        
        if (this.currentSpeaker?.id === speakerId) {
          this.currentSpeaker = null;
        }
        
        this.updateSpeakersUI();
        
        if (window.app) {
          window.app.showNotification('Speaker removed', 'info');
        }
      }
    }
  }
  
  updateSpeakersUI() {
    this.updateSpeakersList();
    this.updateSpeakerStats();
    this.updateCurrentSpeakerDisplay();
  }
  
  updateSpeakersList() {
    const speakersList = document.getElementById('speakersList');
    if (!speakersList) return;
    
    speakersList.innerHTML = '';
    
    this.speakerProfiles.forEach(speaker => {
      const speakerElement = document.createElement('div');
      speakerElement.className = 'speaker-item';
      speakerElement.innerHTML = `
        <div class="speaker-info">
          <div class="speaker-avatar" style="background-color: ${speaker.color}">
            ${speaker.name.charAt(0)}
          </div>
          <div class="speaker-details">
            <div class="speaker-name">${speaker.name}</div>
            <div class="speaker-meta">
              <span class="confidence">Confidence: ${(speaker.confidence * 100).toFixed(1)}%</span>
              <span class="speak-time">Time: ${this.formatSpeakTime(speaker.totalSpeakTime)}</span>
            </div>
          </div>
        </div>
        <div class="speaker-actions">
          <button class="btn btn-sm" onclick="speakerDiarizationManager.renameSpeaker('${speaker.id}', prompt('New name:', '${speaker.name}'))">
            ✏️
          </button>
          <button class="btn btn-sm" onclick="speakerDiarizationManager.removeSpeaker('${speaker.id}')">
            🗑️
          </button>
        </div>
      `;
      
      if (this.currentSpeaker?.id === speaker.id) {
        speakerElement.classList.add('active');
      }
      
      speakersList.appendChild(speakerElement);
    });
  }
  
  updateSpeakerStats() {
    const totalSpeakers = document.getElementById('totalSpeakers');
    const activeSpeaker = document.getElementById('activeSpeaker');
    const averageConfidence = document.getElementById('averageConfidence');
    
    if (totalSpeakers) {
      totalSpeakers.textContent = this.speakerProfiles.size;
    }
    
    if (activeSpeaker) {
      activeSpeaker.textContent = this.currentSpeaker?.name || 'None';
    }
    
    if (averageConfidence) {
      const avgConfidence = Array.from(this.speakerProfiles.values())
        .reduce((sum, speaker) => sum + speaker.confidence, 0) / this.speakerProfiles.size;
      averageConfidence.textContent = `${(avgConfidence * 100).toFixed(1)}%`;
    }
  }
  
  updateCurrentSpeakerDisplay() {
    const currentSpeakerDisplay = document.getElementById('currentSpeakerDisplay');
    if (!currentSpeakerDisplay) return;
    
    if (this.currentSpeaker) {
      currentSpeakerDisplay.innerHTML = `
        <div class="current-speaker-info">
          <div class="speaker-avatar" style="background-color: ${this.currentSpeaker.color}">
            ${this.currentSpeaker.name.charAt(0)}
          </div>
          <div class="speaker-details">
            <div class="speaker-name">${this.currentSpeaker.name}</div>
            <div class="speaker-confidence">
              Confidence: ${(this.currentSpeaker.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      `;
    } else {
      currentSpeakerDisplay.innerHTML = `
        <div class="no-speaker">
          <div class="speaker-icon">🎤</div>
          <div class="speaker-text">No active speaker</div>
        </div>
      `;
    }
  }
  
  updateConfidenceDisplay() {
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceValue) {
      confidenceValue.textContent = `${(this.confidenceThreshold * 100).toFixed(0)}%`;
    }
  }
  
  updateUI() {
    const diarizationStatus = document.getElementById('diarizationStatus');
    if (diarizationStatus) {
      diarizationStatus.textContent = this.isEnabled ? 'Enabled' : 'Disabled';
      diarizationStatus.className = `status ${this.isEnabled ? 'enabled' : 'disabled'}`;
    }
    
    // Enable/disable related controls
    const controls = document.querySelectorAll('.diarization-control');
    controls.forEach(control => {
      control.disabled = !this.isEnabled;
    });
  }
  
  formatSpeakTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  exportSpeakerData() {
    const speakerData = {
      speakers: Array.from(this.speakerProfiles.values()),
      settings: {
        enabled: this.isEnabled,
        confidenceThreshold: this.confidenceThreshold
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(speakerData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speaker-profiles-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Speaker data exported', 'success');
    }
  }
  
  importSpeakerData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.speakers && Array.isArray(data.speakers)) {
          // Clear existing speakers
          this.speakerProfiles.clear();
          
          // Import speakers
          data.speakers.forEach(speaker => {
            this.speakerProfiles.set(speaker.id, speaker);
          });
          
          // Import settings
          if (data.settings) {
            this.isEnabled = data.settings.enabled;
            this.confidenceThreshold = data.settings.confidenceThreshold;
          }
          
          this.updateSpeakersUI();
          this.updateUI();
          
          if (window.app) {
            window.app.showNotification('Speaker data imported successfully', 'success');
          }
        } else {
          throw new Error('Invalid speaker data format');
        }
      } catch (error) {
        console.error('Import failed:', error);
        if (window.app) {
          window.app.showNotification('Failed to import speaker data', 'error');
        }
      }
    };
    reader.readAsText(file);
  }
  
  // Get speaker for transcript entry
  getSpeakerForEntry(audioFeatures) {
    if (!this.isEnabled) {
      return { id: 'unknown', name: 'Speaker', color: '#64748b' };
    }
    
    return this.identifySpeaker(audioFeatures);
  }
  
  // Real-time speaker detection simulation
  startRealTimeDetection() {
    this.detectionInterval = setInterval(() => {
      if (this.isEnabled && window.transcriptionManager?.isRecording) {
        // Simulate audio features
        const audioFeatures = {
          pitch: Math.random() * 200 + 100,
          formants: [
            Math.random() * 500 + 500,
            Math.random() * 1000 + 1000,
            Math.random() * 1000 + 2000
          ],
          mfcc: Array.from({ length: 13 }, () => Math.random() * 2 - 1),
          tempo: Math.random() * 100 + 100
        };
        
        this.identifySpeaker(audioFeatures);
      }
    }, 2000);
  }
  
  stopRealTimeDetection() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }
}