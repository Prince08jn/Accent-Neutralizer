// Voice Commands Manager
class VoiceCommandsManager {
  constructor() {
    this.isListening = false;
    this.isEnabled = true;
    this.recognition = null;
    this.commands = new Map();
    this.wakeWord = 'hey accent';
    this.confidence = 0.8;
    
    this.setupSpeechRecognition();
    this.initializeCommands();
    this.setupEventListeners();
  }
  
  setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUI();
        console.log('Voice commands listening started');
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.updateUI();
        
        // Restart if enabled
        if (this.isEnabled) {
          setTimeout(() => this.startListening(), 1000);
        }
      };
      
      this.recognition.onresult = (event) => {
        this.processResults(event);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          this.isEnabled = false;
          this.updateUI();
          
          if (window.app) {
            window.app.showNotification('Microphone access denied for voice commands', 'error');
          }
        }
      };
    } else {
      console.warn('Speech recognition not supported');
      this.isEnabled = false;
    }
  }
  
  initializeCommands() {
    // Basic control commands
    this.addCommand('start recording', () => {
      if (window.transcriptionManager && !window.transcriptionManager.isRecording) {
        window.transcriptionManager.startRecording();
        this.speak('Recording started');
      }
    });
    
    this.addCommand('stop recording', () => {
      if (window.transcriptionManager && window.transcriptionManager.isRecording) {
        window.transcriptionManager.stopRecording();
        this.speak('Recording stopped');
      }
    });
    
    this.addCommand('clear transcript', () => {
      if (window.transcriptionManager) {
        window.transcriptionManager.clearTranscription();
        this.speak('Transcript cleared');
      }
    });
    
    // Navigation commands
    this.addCommand('go to home', () => {
      if (window.app) {
        window.app.showSection('home');
        this.speak('Navigating to home');
      }
    });
    
    this.addCommand('go to transcribe', () => {
      if (window.app) {
        window.app.showSection('transcribe');
        this.speak('Opening transcription');
      }
    });
    
    this.addCommand('go to translate', () => {
      if (window.app) {
        window.app.showSection('translate');
        this.speak('Opening translation');
      }
    });
    
    this.addCommand('go to meetings', () => {
      if (window.app) {
        window.app.showSection('meetings');
        this.speak('Opening meetings');
      }
    });
    
    this.addCommand('go to analytics', () => {
      if (window.app) {
        window.app.showSection('analytics');
        this.speak('Opening analytics');
      }
    });
    
    this.addCommand('go to settings', () => {
      if (window.app) {
        window.app.showSection('settings');
        this.speak('Opening settings');
      }
    });
    
    // Translation commands
    this.addCommand('translate to spanish', () => {
      this.setTranslationLanguage('es');
      this.speak('Translation set to Spanish');
    });
    
    this.addCommand('translate to french', () => {
      this.setTranslationLanguage('fr');
      this.speak('Translation set to French');
    });
    
    this.addCommand('translate to german', () => {
      this.setTranslationLanguage('de');
      this.speak('Translation set to German');
    });
    
    this.addCommand('start translation', () => {
      if (window.translationManager && !window.translationManager.isTranslating) {
        window.translationManager.startTranslation();
        this.speak('Translation started');
      }
    });
    
    this.addCommand('stop translation', () => {
      if (window.translationManager && window.translationManager.isTranslating) {
        window.translationManager.stopTranslation();
        this.speak('Translation stopped');
      }
    });
    
    // Export commands
    this.addCommand('export transcript', () => {
      if (window.exportSharingManager) {
        window.exportSharingManager.exportToTxt();
        this.speak('Exporting transcript');
      }
    });
    
    this.addCommand('export as pdf', () => {
      if (window.exportSharingManager) {
        window.exportSharingManager.exportToPDF();
        this.speak('Exporting as PDF');
      }
    });
    
    // Theme commands
    this.addCommand('switch to dark mode', () => {
      if (window.app) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('accent-neutralizer-theme', 'dark');
        this.speak('Switched to dark mode');
      }
    });
    
    this.addCommand('switch to light mode', () => {
      if (window.app) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('accent-neutralizer-theme', 'light');
        this.speak('Switched to light mode');
      }
    });
    
    // Help command
    this.addCommand('help', () => {
      this.showAvailableCommands();
    });
    
    this.addCommand('what can you do', () => {
      this.showAvailableCommands();
    });
    
    // Status commands
    this.addCommand('what time is it', () => {
      const time = new Date().toLocaleTimeString();
      this.speak(`The time is ${time}`);
    });
    
    this.addCommand('how many words', () => {
      const wordCount = this.getTranscriptWordCount();
      this.speak(`The transcript contains ${wordCount} words`);
    });
  }
  
  setupEventListeners() {
    // Enable/disable toggle
    const enableVoiceToggle = document.getElementById('enableVoiceToggle');
    if (enableVoiceToggle) {
      enableVoiceToggle.addEventListener('change', (e) => {
        this.isEnabled = e.target.checked;
        
        if (this.isEnabled) {
          this.startListening();
        } else {
          this.stopListening();
        }
        
        this.updateUI();
      });
    }
    
    // Wake word input
    const wakeWordInput = document.getElementById('wakeWordInput');
    if (wakeWordInput) {
      wakeWordInput.addEventListener('change', (e) => {
        this.wakeWord = e.target.value.toLowerCase();
        this.saveSettings();
      });
    }
    
    // Confidence slider
    const confidenceSlider = document.getElementById('voiceConfidenceSlider');
    if (confidenceSlider) {
      confidenceSlider.addEventListener('input', (e) => {
        this.confidence = parseFloat(e.target.value);
        this.updateConfidenceDisplay();
        this.saveSettings();
      });
    }
    
    // Test voice command
    const testVoiceBtn = document.getElementById('testVoiceBtn');
    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => this.testVoiceCommand());
    }
    
    // Add custom command
    const addCommandForm = document.getElementById('addCommandForm');
    if (addCommandForm) {
      addCommandForm.addEventListener('submit', (e) => this.addCustomCommand(e));
    }
  }
  
  addCommand(phrase, action, description = '') {
    this.commands.set(phrase.toLowerCase(), {
      phrase: phrase,
      action: action,
      description: description,
      usageCount: 0,
      addedAt: new Date().toISOString()
    });
  }
  
  removeCommand(phrase) {
    this.commands.delete(phrase.toLowerCase());
    this.updateCommandsList();
  }
  
  processResults(event) {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    const fullTranscript = (finalTranscript + interimTranscript).toLowerCase().trim();
    
    // Check for wake word
    if (fullTranscript.includes(this.wakeWord)) {
      this.processCommand(fullTranscript);
    }
    
    // Update voice command display
    this.updateVoiceDisplay(fullTranscript);
  }
  
  processCommand(transcript) {
    // Remove wake word from transcript
    const commandText = transcript.replace(this.wakeWord, '').trim();
    
    // Find matching command
    let bestMatch = null;
    let highestSimilarity = 0;
    
    this.commands.forEach((command, phrase) => {
      const similarity = this.calculateSimilarity(commandText, phrase);
      
      if (similarity > highestSimilarity && similarity >= this.confidence) {
        highestSimilarity = similarity;
        bestMatch = command;
      }
    });
    
    if (bestMatch) {
      console.log('Executing command:', bestMatch.phrase);
      
      // Update usage count
      bestMatch.usageCount++;
      
      // Execute command
      try {
        bestMatch.action();
        
        // Show visual feedback
        this.showCommandFeedback(bestMatch.phrase, true);
        
      } catch (error) {
        console.error('Command execution failed:', error);
        this.speak('Sorry, I could not execute that command');
        this.showCommandFeedback(bestMatch.phrase, false);
      }
    } else {
      console.log('No matching command found for:', commandText);
      this.speak('Sorry, I did not understand that command');
      this.showCommandFeedback(commandText, false);
    }
  }
  
  calculateSimilarity(text1, text2) {
    // Simple word-based similarity
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    let matches = 0;
    const totalWords = Math.max(words1.length, words2.length);
    
    words1.forEach(word => {
      if (words2.includes(word)) {
        matches++;
      }
    });
    
    return matches / totalWords;
  }
  
  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  }
  
  startListening() {
    if (this.recognition && this.isEnabled && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
  
  updateUI() {
    const voiceStatus = document.getElementById('voiceStatus');
    const enableToggle = document.getElementById('enableVoiceToggle');
    
    if (voiceStatus) {
      if (this.isEnabled && this.isListening) {
        voiceStatus.textContent = 'Listening for commands...';
        voiceStatus.className = 'voice-status listening';
      } else if (this.isEnabled) {
        voiceStatus.textContent = 'Voice commands enabled';
        voiceStatus.className = 'voice-status enabled';
      } else {
        voiceStatus.textContent = 'Voice commands disabled';
        voiceStatus.className = 'voice-status disabled';
      }
    }
    
    if (enableToggle) {
      enableToggle.checked = this.isEnabled;
    }
    
    this.updateCommandsList();
  }
  
  updateVoiceDisplay(transcript) {
    const voiceDisplay = document.getElementById('voiceDisplay');
    if (voiceDisplay) {
      voiceDisplay.textContent = transcript || 'Listening...';
    }
  }
  
  updateConfidenceDisplay() {
    const confidenceValue = document.getElementById('voiceConfidenceValue');
    if (confidenceValue) {
      confidenceValue.textContent = `${(this.confidence * 100).toFixed(0)}%`;
    }
  }
  
  updateCommandsList() {
    const commandsList = document.getElementById('commandsList');
    if (!commandsList) return;
    
    commandsList.innerHTML = '';
    
    // Sort commands by usage count
    const sortedCommands = Array.from(this.commands.entries())
      .sort(([, a], [, b]) => b.usageCount - a.usageCount);
    
    sortedCommands.forEach(([phrase, command]) => {
      const commandElement = document.createElement('div');
      commandElement.className = 'command-item';
      
      commandElement.innerHTML = `
        <div class="command-info">
          <div class="command-phrase">"${command.phrase}"</div>
          ${command.description ? `<div class="command-description">${command.description}</div>` : ''}
          <div class="command-meta">
            <span class="usage-count">Used ${command.usageCount} times</span>
          </div>
        </div>
        <div class="command-actions">
          <button class="btn btn-sm" onclick="voiceCommandsManager.testCommand('${phrase}')" title="Test">
            🔊
          </button>
          <button class="btn btn-sm" onclick="voiceCommandsManager.removeCommand('${phrase}')" title="Remove">
            🗑️
          </button>
        </div>
      `;
      
      commandsList.appendChild(commandElement);
    });
  }
  
  showCommandFeedback(command, success) {
    const feedback = document.createElement('div');
    feedback.className = `voice-feedback ${success ? 'success' : 'error'}`;
    feedback.innerHTML = `
      <div class="feedback-content">
        <span class="feedback-icon">${success ? '✅' : '❌'}</span>
        <span class="feedback-text">${success ? 'Executed' : 'Failed'}: "${command}"</span>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }
  
  testCommand(phrase) {
    const command = this.commands.get(phrase);
    if (command) {
      this.speak(`Testing command: ${phrase}`);
      setTimeout(() => {
        command.action();
      }, 1000);
    }
  }
  
  testVoiceCommand() {
    this.speak('Voice commands are working correctly');
    this.showCommandFeedback('Test command', true);
  }
  
  addCustomCommand(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const phrase = formData.get('phrase').toLowerCase().trim();
    const actionType = formData.get('actionType');
    const actionValue = formData.get('actionValue').trim();
    const description = formData.get('description').trim();
    
    if (!phrase || !actionType || !actionValue) {
      if (window.app) {
        window.app.showNotification('Please fill in all required fields', 'error');
      }
      return;
    }
    
    // Create action function based on type
    let action;
    
    switch (actionType) {
      case 'navigate':
        action = () => {
          if (window.app) {
            window.app.showSection(actionValue);
          }
        };
        break;
      case 'speak':
        action = () => {
          this.speak(actionValue);
        };
        break;
      case 'notification':
        action = () => {
          if (window.app) {
            window.app.showNotification(actionValue, 'info');
          }
        };
        break;
      case 'javascript':
        action = () => {
          try {
            eval(actionValue);
          } catch (error) {
            console.error('Custom command error:', error);
          }
        };
        break;
      default:
        if (window.app) {
          window.app.showNotification('Invalid action type', 'error');
        }
        return;
    }
    
    this.addCommand(phrase, action, description);
    this.updateCommandsList();
    this.saveSettings();
    
    // Clear form
    event.target.reset();
    
    if (window.app) {
      window.app.showNotification(`Command "${phrase}" added`, 'success');
    }
  }
  
  showAvailableCommands() {
    const commandList = Array.from(this.commands.keys()).slice(0, 10).join(', ');
    this.speak(`Available commands include: ${commandList}`);
    
    if (window.app) {
      window.app.showNotification('Check the voice commands panel for full list', 'info');
    }
  }
  
  setTranslationLanguage(languageCode) {
    if (window.translationManager) {
      window.translationManager.targetLanguage = languageCode;
      
      const targetSelect = document.getElementById('targetLanguage');
      if (targetSelect) {
        targetSelect.value = languageCode;
      }
    }
  }
  
  getTranscriptWordCount() {
    const transcriptionArea = document.getElementById('transcriptionArea');
    if (transcriptionArea) {
      const messages = transcriptionArea.querySelectorAll('.message-bubble');
      let wordCount = 0;
      
      messages.forEach(message => {
        const text = message.textContent || '';
        wordCount += text.split(/\s+/).filter(word => word.length > 0).length;
      });
      
      return wordCount;
    }
    
    return 0;
  }
  
  saveSettings() {
    const settings = {
      enabled: this.isEnabled,
      wakeWord: this.wakeWord,
      confidence: this.confidence,
      customCommands: Array.from(this.commands.entries())
        .filter(([, command]) => command.addedAt) // Only save custom commands
        .map(([phrase, command]) => ({ phrase, ...command }))
    };
    
    localStorage.setItem('voice-commands-settings', JSON.stringify(settings));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('voice-commands-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        
        this.isEnabled = settings.enabled !== false;
        this.wakeWord = settings.wakeWord || 'hey accent';
        this.confidence = settings.confidence || 0.8;
        
        // Load custom commands
        if (settings.customCommands) {
          settings.customCommands.forEach(command => {
            // Recreate action function (simplified for demo)
            const action = () => {
              console.log('Custom command executed:', command.phrase);
            };
            
            this.addCommand(command.phrase, action, command.description);
          });
        }
        
        this.updateUI();
      } catch (error) {
        console.error('Error loading voice command settings:', error);
      }
    }
  }
}