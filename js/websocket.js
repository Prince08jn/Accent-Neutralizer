// WebSocket Manager for Real-time Communication
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    this.eventHandlers = new Map();
    this.messageQueue = [];
  }
  
  initialize() {
    this.connect();
    this.setupConnectionStatus();
  }
  
  connect() {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate the connection
      this.simulateConnection();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleConnectionError();
    }
  }
  
  simulateConnection() {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.updateConnectionStatus('connected');
      
      if (window.app) {
        window.app.showNotification('Connected to AI services', 'success');
      }
      
      // Process queued messages
      this.processMessageQueue();
      
      // Simulate periodic connection status
      this.startHeartbeat();
      
      // Emit connection event
      this.emit('connected');
    }, 2000);
  }
  
  setupConnectionStatus() {
    const statusIndicator = document.getElementById('connectionStatus');
    if (statusIndicator) {
      this.connectionStatusElement = statusIndicator;
      this.updateConnectionStatus('connecting');
    }
  }
  
  updateConnectionStatus(status) {
    if (!this.connectionStatusElement) return;
    
    const statusDot = this.connectionStatusElement.querySelector('.status-dot');
    const statusText = this.connectionStatusElement.querySelector('.status-text');
    
    if (statusDot && statusText) {
      statusDot.className = `status-dot ${status}`;
      
      switch (status) {
        case 'connected':
          statusText.textContent = 'Connected';
          break;
        case 'connecting':
          statusText.textContent = 'Connecting...';
          break;
        case 'disconnected':
          statusText.textContent = 'Disconnected';
          break;
        case 'error':
          statusText.textContent = 'Connection Error';
          break;
        default:
          statusText.textContent = 'Unknown';
      }
    }
  }
  
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        // Simulate heartbeat
        this.emit('heartbeat', { timestamp: Date.now() });
      }
    }, 30000); // 30 seconds
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  handleConnectionError() {
    this.isConnected = false;
    this.updateConnectionStatus('error');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      if (window.app) {
        window.app.showNotification(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`, 'warning');
      }
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      if (window.app) {
        window.app.showNotification('Connection failed. Please refresh the page.', 'error');
      }
    }
  }
  
  disconnect() {
    this.isConnected = false;
    this.stopHeartbeat();
    this.updateConnectionStatus('disconnected');
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.emit('disconnected');
  }
  
  send(event, data) {
    const message = {
      event: event,
      data: data,
      timestamp: Date.now()
    };
    
    if (this.isConnected) {
      // In a real implementation, this would send via WebSocket
      this.simulateMessageSend(message);
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }
  
  simulateMessageSend(message) {
    console.log('Sending message:', message);
    
    // Simulate server response based on message type
    setTimeout(() => {
      this.handleServerResponse(message);
    }, Math.random() * 1000 + 500);
  }
  
  handleServerResponse(originalMessage) {
    switch (originalMessage.event) {
      case 'transcribe_audio':
        this.simulateTranscriptionResponse(originalMessage.data);
        break;
      case 'translate_text':
        this.simulateTranslationResponse(originalMessage.data);
        break;
      case 'generate_summary':
        this.simulateSummaryResponse(originalMessage.data);
        break;
      case 'identify_speaker':
        this.simulateSpeakerResponse(originalMessage.data);
        break;
    }
  }
  
  simulateTranscriptionResponse(data) {
    const sampleResponses = [
      {
        text: "Hello everyone, I hope you're all doing well today.",
        confidence: 0.95,
        speaker: 'Speaker 1',
        language: 'en'
      },
      {
        text: "Let's start with our quarterly review and discuss the progress.",
        confidence: 0.92,
        speaker: 'Speaker 2',
        language: 'en'
      },
      {
        text: "I think we should focus on improving customer satisfaction metrics.",
        confidence: 0.88,
        speaker: 'Speaker 1',
        language: 'en'
      }
    ];
    
    const response = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    this.emit('transcription_result', response);
  }
  
  simulateTranslationResponse(data) {
    const response = {
      originalText: data.text,
      translatedText: `[Translated] ${data.text}`,
      sourceLanguage: data.sourceLanguage || 'en',
      targetLanguage: data.targetLanguage || 'es',
      confidence: 0.91
    };
    
    this.emit('translation_result', response);
  }
  
  simulateSummaryResponse(data) {
    const response = {
      summary: "The team discussed quarterly goals and identified key action items for the upcoming sprint.",
      keyPoints: [
        "Quarterly review completed",
        "Action items identified",
        "Next steps defined"
      ],
      actionItems: [
        "Prepare budget proposal",
        "Schedule client meeting",
        "Update project timeline"
      ]
    };
    
    this.emit('summary_result', response);
  }
  
  simulateSpeakerResponse(data) {
    const speakers = ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis'];
    const response = {
      speakerId: Math.floor(Math.random() * speakers.length),
      speakerName: speakers[Math.floor(Math.random() * speakers.length)],
      confidence: 0.87
    };
    
    this.emit('speaker_identified', response);
  }
  
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.simulateMessageSend(message);
    }
  }
  
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }
  
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }
  
  // Audio streaming methods
  startAudioStream() {
    if (!this.isConnected) {
      console.warn('Cannot start audio stream: not connected');
      return false;
    }
    
    this.send('start_audio_stream', {
      sampleRate: 44100,
      channels: 1,
      format: 'pcm'
    });
    
    return true;
  }
  
  sendAudioChunk(audioData) {
    if (!this.isConnected) {
      console.warn('Cannot send audio: not connected');
      return;
    }
    
    this.send('audio_chunk', {
      data: audioData,
      timestamp: Date.now()
    });
  }
  
  stopAudioStream() {
    if (this.isConnected) {
      this.send('stop_audio_stream', {
        timestamp: Date.now()
      });
    }
  }
  
  // Translation methods
  requestTranslation(text, sourceLanguage, targetLanguage) {
    this.send('translate_text', {
      text: text,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    });
  }
  
  // Summary methods
  requestSummary(conversationData) {
    this.send('generate_summary', {
      messages: conversationData,
      type: 'meeting_summary'
    });
  }
  
  // Speaker identification methods
  requestSpeakerIdentification(audioFeatures) {
    this.send('identify_speaker', {
      features: audioFeatures,
      timestamp: Date.now()
    });
  }
}

// Audio Processing Manager
class AudioProcessingManager {
  constructor(websocketManager) {
    this.ws = websocketManager;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.isRecording = false;
    
    this.audioChunks = [];
    this.visualizerBars = [];
  }
  
  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.setupVisualizer();
      return true;
    } catch (error) {
      console.error('Audio context initialization failed:', error);
      return false;
    }
  }
  
  setupVisualizer() {
    this.visualizerBars = document.querySelectorAll('.visualizer-bar');
  }
  
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.microphone.connect(this.analyser);
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.processAudioChunk(event.data);
        }
      };
      
      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;
      
      // Start audio visualization
      this.startVisualization();
      
      // Start WebSocket audio stream
      this.ws.startAudioStream();
      
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }
  
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Stop visualization
      this.stopVisualization();
      
      // Stop WebSocket audio stream
      this.ws.stopAudioStream();
      
      // Clean up
      if (this.microphone) {
        this.microphone.disconnect();
      }
      
      return true;
    }
    return false;
  }
  
  processAudioChunk(audioBlob) {
    // Convert blob to array buffer for processing
    audioBlob.arrayBuffer().then(buffer => {
      // In a real implementation, you would process the audio data here
      // and send it to the WebSocket for transcription
      this.ws.sendAudioChunk(buffer);
    });
  }
  
  startVisualization() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualizer = () => {
      if (!this.isRecording) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Update visualizer bars
      this.visualizerBars.forEach((bar, index) => {
        const value = dataArray[index * 10] || 0;
        const height = (value / 255) * 100;
        bar.style.height = `${Math.max(height, 5)}%`;
      });
      
      requestAnimationFrame(updateVisualizer);
    };
    
    updateVisualizer();
  }
  
  stopVisualization() {
    // Reset visualizer bars
    this.visualizerBars.forEach(bar => {
      bar.style.height = '5%';
    });
  }
  
  getAudioLevel() {
    if (!this.analyser) return 0;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    
    return sum / bufferLength / 255;
  }
}
