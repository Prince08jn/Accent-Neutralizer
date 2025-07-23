
// Translation Manager
class TranslationManager {
  constructor() {
    this.isTranslating = false;
    this.sourceLanguage = 'auto';
    this.targetLanguage = 'es';
    this.parallelDisplay = true;
    this.contextualTranslation = true;
    this.culturalAdaptation = false;
    
    // TTS settings
    this.currentVoice = 'neutral';
    this.playbackSpeed = 1.0;
    this.speechSynthesis = window.speechSynthesis;
    
    // DOM elements
    this.sourceSelect = null;
    this.targetSelect = null;
    this.languageSwapBtn = null;
    this.startTranslationBtn = null;
    this.originalContent = null;
    this.translatedContent = null;
    this.detectedLanguageBadge = null;
    this.targetLanguageBadge = null;
    
    // Sample translations for demo
    this.sampleTranslations = {
      'en-es': {
        'Hello everyone, how are you today?': 'Hola a todos, ¿cómo están hoy?',
        'Let\'s start the meeting': 'Comencemos la reunión',
        'I agree with that proposal': 'Estoy de acuerdo con esa propuesta',
        'Can you repeat that please?': '¿Puedes repetir eso por favor?',
        'Thank you for your time': 'Gracias por su tiempo'
      },
      'en-fr': {
        'Hello everyone, how are you today?': 'Bonjour tout le monde, comment allez-vous aujourd\'hui?',
        'Let\'s start the meeting': 'Commençons la réunion',
        'I agree with that proposal': 'Je suis d\'accord avec cette proposition',
        'Can you repeat that please?': 'Pouvez-vous répéter s\'il vous plaît?',
        'Thank you for your time': 'Merci pour votre temps'
      },
      'es-en': {
        'Hola a todos': 'Hello everyone',
        'Buenos días': 'Good morning',
        'Muchas gracias': 'Thank you very much',
        '¿Cómo están?': 'How are you?',
        'Hasta luego': 'See you later'
      }
    };
    
    this.languageNames = {
      'auto': 'Auto-detect',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'ru': 'Russian'
    };
  }
  
  initialize() {
    this.setupDOMElements();
    this.setupEventListeners();
    this.updateLanguageBadges();
  }
  
  setupDOMElements() {
    this.sourceSelect = document.getElementById('sourceLanguage');
    this.targetSelect = document.getElementById('targetLanguage');
    this.languageSwapBtn = document.getElementById('languageSwap');
    this.startTranslationBtn = document.getElementById('startTranslation');
    this.originalContent = document.getElementById('originalContent');
    this.translatedContent = document.getElementById('translatedContent');
    this.detectedLanguageBadge = document.getElementById('detectedLanguage');
    this.targetLanguageBadge = document.getElementById('targetLanguageBadge');
    
    // TTS controls
    this.voiceSelect = document.getElementById('voiceSelect');
    this.speedSlider = document.getElementById('speedSlider');
    this.playOriginalBtn = document.getElementById('playOriginal');
    this.playTranslationBtn = document.getElementById('playTranslation');
  }
  
  setupEventListeners() {
    if (this.sourceSelect) {
      this.sourceSelect.addEventListener('change', (e) => {
        this.sourceLanguage = e.target.value;
        this.updateLanguageBadges();
      });
    }
    
    if (this.targetSelect) {
      this.targetSelect.addEventListener('change', (e) => {
        this.targetLanguage = e.target.value;
        this.updateLanguageBadges();
      });
    }
    
    if (this.languageSwapBtn) {
      this.languageSwapBtn.addEventListener('click', () => this.swapLanguages());
    }
    
    if (this.startTranslationBtn) {
      this.startTranslationBtn.addEventListener('click', () => this.toggleTranslation());
    }
    
    // Translation options
    const parallelToggle = document.getElementById('parallelDisplay');
    const contextualToggle = document.getElementById('contextualTranslation');
    const culturalToggle = document.getElementById('culturalAdaptation');
    
    if (parallelToggle) {
      parallelToggle.addEventListener('change', (e) => {
        this.parallelDisplay = e.target.checked;
      });
    }
    
    if (contextualToggle) {
      contextualToggle.addEventListener('change', (e) => {
        this.contextualTranslation = e.target.checked;
      });
    }
    
    if (culturalToggle) {
      culturalToggle.addEventListener('change', (e) => {
        this.culturalAdaptation = e.target.checked;
      });
    }
    
    // TTS controls
    if (this.voiceSelect) {
      this.voiceSelect.addEventListener('change', (e) => {
        this.currentVoice = e.target.value;
      });
    }
    
    if (this.speedSlider) {
      this.speedSlider.addEventListener('input', (e) => {
        this.playbackSpeed = parseFloat(e.target.value);
        const sliderValue = this.speedSlider.parentNode.querySelector('.slider-value');
        if (sliderValue) {
          sliderValue.textContent = `${this.playbackSpeed}x`;
        }
      });
    }
    
    if (this.playOriginalBtn) {
      this.playOriginalBtn.addEventListener('click', () => this.playOriginalText());
    }
    
    if (this.playTranslationBtn) {
      this.playTranslationBtn.addEventListener('click', () => this.playTranslatedText());
    }
  }
  
  updateLanguageBadges() {
    if (this.detectedLanguageBadge) {
      this.detectedLanguageBadge.textContent = this.languageNames[this.sourceLanguage] || this.sourceLanguage;
    }
    
    if (this.targetLanguageBadge) {
      this.targetLanguageBadge.textContent = this.languageNames[this.targetLanguage] || this.targetLanguage;
    }
  }
  
  swapLanguages() {
    if (this.sourceLanguage === 'auto') {
      if (window.app) {
        window.app.showNotification('Cannot swap from auto-detect', 'warning');
      }
      return;
    }
    
    const temp = this.sourceLanguage;
    this.sourceLanguage = this.targetLanguage;
    this.targetLanguage = temp;
    
    // Update UI
    if (this.sourceSelect) this.sourceSelect.value = this.sourceLanguage;
    if (this.targetSelect) this.targetSelect.value = this.targetLanguage;
    
    this.updateLanguageBadges();
    
    if (window.app) {
      window.app.showNotification('Languages swapped', 'success');
    }
  }
  
  toggleTranslation() {
    if (this.isTranslating) {
      this.stopTranslation();
    } else {
      this.startTranslation();
    }
  }
  
  startTranslation() {
    this.isTranslating = true;
    
    // Update UI
    if (this.startTranslationBtn) {
      this.startTranslationBtn.innerHTML = `
        <span class="btn-icon">⏹️</span>
        Stop Translation
      `;
      this.startTranslationBtn.classList.add('recording');
    }
    
    // Clear placeholder messages
    this.clearPlaceholders();
    
    // Start simulated translation
    this.startTranslationSimulation();
    
    if (window.app) {
      window.app.showNotification('Translation started', 'success');
    }
  }
  
  stopTranslation() {
    this.isTranslating = false;
    
    // Update UI
    if (this.startTranslationBtn) {
      this.startTranslationBtn.innerHTML = `
        <span class="btn-icon">🌍</span>
        Start Translation
      `;
      this.startTranslationBtn.classList.remove('recording');
    }
    
    // Stop simulation
    this.stopTranslationSimulation();
    
    if (window.app) {
      window.app.showNotification('Translation stopped', 'info');
    }
  }
  
  clearPlaceholders() {
    if (this.originalContent) {
      this.originalContent.innerHTML = '';
    }
    
    if (this.translatedContent) {
      this.translatedContent.innerHTML = '';
    }
  }
  
  startTranslationSimulation() {
    const sampleTexts = [
      'Hello everyone, how are you today?',
      'Let\'s start the meeting and discuss our progress.',
      'I agree with that proposal and think we should move forward.',
      'Can you repeat that please? I want to make sure I understand.',
      'Thank you for your time and valuable input on this project.',
      'The quarterly results look very promising this year.',
      'We need to focus on improving customer satisfaction.',
      'I have some concerns about the timeline for delivery.',
      'Great work on the presentation, it was very informative.',
      'Let\'s schedule a follow-up meeting next week.'
    ];
    
    this.translationInterval = setInterval(() => {
      if (this.isTranslating) {
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        this.simulateTranslation(randomText);
      }
    }, Math.random() * 4000 + 3000); // 3-7 seconds
  }
  
  stopTranslationSimulation() {
    if (this.translationInterval) {
      clearInterval(this.translationInterval);
      this.translationInterval = null;
    }
  }
  
  simulateTranslation(originalText) {
    // Detect language (simulate)
    const detectedLang = this.sourceLanguage === 'auto' ? 'en' : this.sourceLanguage;
    
    // Get translation
    const translationKey = `${detectedLang}-${this.targetLanguage}`;
    const translations = this.sampleTranslations[translationKey] || {};
    const translatedText = translations[originalText] || this.generateFallbackTranslation(originalText);
    
    // Add to display
    this.addTranslationPair(originalText, translatedText, detectedLang);
    
    // Update detected language badge
    if (this.sourceLanguage === 'auto' && this.detectedLanguageBadge) {
      this.detectedLanguageBadge.textContent = this.languageNames[detectedLang];
    }
  }
  
  generateFallbackTranslation(text) {
    // Simple fallback for demo purposes
    const fallbacks = {
      'es': `[ES] ${text}`,
      'fr': `[FR] ${text}`,
      'de': `[DE] ${text}`,
      'zh': `[中文] ${text}`,
      'ja': `[日本語] ${text}`,
      'ko': `[한국어] ${text}`,
      'ar': `[العربية] ${text}`,
      'hi': `[हिंदी] ${text}`,
      'ru': `[Русский] ${text}`
    };
    
    return fallbacks[this.targetLanguage] || `[${this.targetLanguage.toUpperCase()}] ${text}`;
  }
  
  addTranslationPair(originalText, translatedText, detectedLang) {
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Add original text
    if (this.originalContent) {
      const originalElement = document.createElement('div');
      originalElement.className = 'translation-message';
      originalElement.innerHTML = `
        <div class="message-content">${this.escapeHtml(originalText)}</div>
        <div class="message-meta">
          <span class="message-time">${timestamp}</span>
          <span class="message-lang">${this.languageNames[detectedLang]}</span>
        </div>
      `;
      this.originalContent.appendChild(originalElement);
    }
    
    // Add translated text with delay
    setTimeout(() => {
      if (this.translatedContent) {
        const translatedElement = document.createElement('div');
        translatedElement.className = 'translation-message translated';
        translatedElement.innerHTML = `
          <div class="message-content">${this.escapeHtml(translatedText)}</div>
          <div class="message-meta">
            <span class="message-time">${timestamp}</span>
            <span class="message-lang">${this.languageNames[this.targetLanguage]}</span>
            <button class="play-btn" onclick="translationManager.playText('${translatedText}', '${this.targetLanguage}')">🔊</button>
          </div>
        `;
        this.translatedContent.appendChild(translatedElement);
      }
      
      this.scrollToBottom();
    }, Math.random() * 1000 + 500); // 0.5-1.5 second delay
  }
  
  scrollToBottom() {
    if (this.originalContent) {
      this.originalContent.scrollTop = this.originalContent.scrollHeight;
    }
    if (this.translatedContent) {
      this.translatedContent.scrollTop = this.translatedContent.scrollHeight;
    }
  }
  
  playOriginalText() {
    const messages = this.originalContent?.querySelectorAll('.translation-message');
    if (!messages || messages.length === 0) {
      if (window.app) {
        window.app.showNotification('No original text to play', 'warning');
      }
      return;
    }
    
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.querySelector('.message-content')?.textContent;
    
    if (text) {
      this.playText(text, this.sourceLanguage === 'auto' ? 'en' : this.sourceLanguage);
    }
  }
  
  playTranslatedText() {
    const messages = this.translatedContent?.querySelectorAll('.translation-message');
    if (!messages || messages.length === 0) {
      if (window.app) {
        window.app.showNotification('No translated text to play', 'warning');
      }
      return;
    }
    
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.querySelector('.message-content')?.textContent;
    
    if (text) {
      this.playText(text, this.targetLanguage);
    }
  }
  
  playText(text, language) {
    if (!this.speechSynthesis) {
      if (window.app) {
        window.app.showNotification('Text-to-speech not supported', 'error');
      }
      return;
    }
    
    // Stop any current speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLanguageCode(language);
    utterance.rate = this.playbackSpeed;
    
    // Try to find a voice for the language
    const voices = this.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang)) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => {
      if (window.app) {
        window.app.showNotification('Playing text...', 'info');
      }
    };
    
    utterance.onend = () => {
      console.log('Text-to-speech finished');
    };
    
    utterance.onerror = (event) => {
      console.error('Text-to-speech error:', event);
      if (window.app) {
        window.app.showNotification('Text-to-speech error', 'error');
      }
    };
    
    this.speechSynthesis.speak(utterance);
  }
  
  getLanguageCode(language) {
    const languageCodes = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'ru': 'ru-RU'
    };
    
    return languageCodes[language] || 'en-US';
  }
  
  exportTranslation() {
    const originalMessages = this.originalContent?.querySelectorAll('.translation-message');
    const translatedMessages = this.translatedContent?.querySelectorAll('.translation-message');
    
    if (!originalMessages || !translatedMessages || originalMessages.length === 0) {
      if (window.app) {
        window.app.showNotification('No translations to export', 'warning');
      }
      return;
    }
    
    let exportText = 'Accent Neutralizer Translation Export\n';
    exportText += '=====================================\n\n';
    exportText += `Source Language: ${this.languageNames[this.sourceLanguage]}\n`;
    exportText += `Target Language: ${this.languageNames[this.targetLanguage]}\n`;
    exportText += `Export Date: ${new Date().toLocaleString()}\n\n`;
    
    for (let i = 0; i < originalMessages.length; i++) {
      const originalText = originalMessages[i].querySelector('.message-content')?.textContent;
      const translatedText = translatedMessages[i]?.querySelector('.message-content')?.textContent;
      const time = originalMessages[i].querySelector('.message-time')?.textContent;
      
      if (originalText) {
        exportText += `[${time}]\n`;
        exportText += `Original: ${originalText}\n`;
        if (translatedText) {
          exportText += `Translation: ${translatedText}\n`;
        }
        exportText += '\n';
      }
    }
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Translation exported successfully', 'success');
    }
  }
  
  clearTranslations() {
    if (this.originalContent) {
      this.originalContent.innerHTML = `
        <div class="placeholder-message">
          <div class="placeholder-icon">🎤</div>
          <p>Start speaking to see real-time transcription</p>
        </div>
      `;
    }
    
    if (this.translatedContent) {
      this.translatedContent.innerHTML = `
        <div class="placeholder-message">
          <div class="placeholder-icon">🌍</div>
          <p>Translations will appear here</p>
        </div>
      `;
    }
    
    if (window.app) {
      window.app.showNotification('Translations cleared', 'info');
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

fetch('http://localhost:5000/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + yourToken
  },
  body: JSON.stringify({ text, target_language })
})
  .then(res => res.json())
  .then(data => { /* display translation */ });