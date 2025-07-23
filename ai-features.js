// AI Features Manager
class AIFeaturesManager {
  constructor() {
    this.summaryGenerator = new SummaryGenerator();
    this.actionItemDetector = new ActionItemDetector();
    this.keywordHighlighter = new KeywordHighlighter();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.speakerIdentifier = new SpeakerIdentifier();
    this.dataRedactor = new DataRedactor();
  }
  
  initialize() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const summaryButton = document.getElementById('summaryButton');
    if (summaryButton) {
      summaryButton.addEventListener('click', () => this.generateSummary());
    }
    
    const refreshInsights = document.getElementById('refreshInsights');
    if (refreshInsights) {
      refreshInsights.addEventListener('click', () => this.refreshInsights());
    }
    
    const exportSummary = document.getElementById('exportSummary');
    if (exportSummary) {
      exportSummary.addEventListener('click', () => this.exportSummary());
    }
  }
  
  async generateSummary() {
    if (window.app) {
      window.app.showNotification('Generating AI summary...', 'info');
      window.app.openModal('summaryModal');
    }
    
    // Simulate AI processing delay
    setTimeout(() => {
      const summary = this.summaryGenerator.generateSummary();
      this.displaySummary(summary);
    }, 2000);
  }
  
  displaySummary(summary) {
    const keyPoints = document.getElementById('keyPoints');
    const actionItemsList = document.getElementById('actionItemsList');
    const nextSteps = document.getElementById('nextSteps');
    
    if (keyPoints) {
      keyPoints.innerHTML = summary.keyPoints.map(point => `<li>${point}</li>`).join('');
    }
    
    if (actionItemsList) {
      actionItemsList.innerHTML = summary.actionItems.map(item => `<li>${item}</li>`).join('');
    }
    
    if (nextSteps) {
      nextSteps.innerHTML = summary.nextSteps.map(step => `<li>${step}</li>`).join('');
    }
  }
  
  refreshInsights() {
    const actionItems = document.getElementById('actionItems');
    const keyTopics = document.getElementById('keyTopics');
    const sentiment = document.getElementById('sentiment');
    
    // Simulate real-time insights update
    if (actionItems) {
      actionItems.textContent = Math.floor(Math.random() * 5) + 1;
    }
    
    if (keyTopics) {
      const topics = ['Project Planning', 'Budget Review', 'Team Coordination', 'Client Feedback', 'Technical Discussion'];
      keyTopics.textContent = topics[Math.floor(Math.random() * topics.length)];
    }
    
    if (sentiment) {
      const sentiments = ['Positive', 'Neutral', 'Constructive', 'Enthusiastic'];
      sentiment.textContent = sentiments[Math.floor(Math.random() * sentiments.length)];
    }
    
    if (window.app) {
      window.app.showNotification('Insights refreshed', 'success');
    }
  }
  
  exportSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    
    let exportText = 'AI-Generated Meeting Summary\n';
    exportText += '============================\n\n';
    exportText += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    const sections = summaryContent.querySelectorAll('.summary-section');
    sections.forEach(section => {
      const title = section.querySelector('h4')?.textContent;
      const items = section.querySelectorAll('li');
      
      if (title && items.length > 0) {
        exportText += `${title}:\n`;
        items.forEach(item => {
          exportText += `- ${item.textContent}\n`;
        });
        exportText += '\n';
      }
    });
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Summary exported successfully', 'success');
    }
  }
}

// Summary Generator
class SummaryGenerator {
  generateSummary() {
    return {
      keyPoints: [
        'Discussed Q4 project milestones and deliverables',
        'Reviewed budget allocation for upcoming initiatives',
        'Identified potential risks and mitigation strategies',
        'Confirmed team roles and responsibilities',
        'Established communication protocols for remote work'
      ],
      actionItems: [
        'Alex to prepare budget proposal by Friday',
        'Sarah to schedule client presentation for next week',
        'Mike to update project timeline and share with team',
        'Emily to research new collaboration tools',
        'Team to review and approve final project scope'
      ],
      nextSteps: [
        'Schedule follow-up meeting for next Tuesday',
        'Distribute meeting notes to all stakeholders',
        'Begin implementation of discussed strategies',
        'Monitor progress and adjust plans as needed',
        'Prepare quarterly report for executive review'
      ]
    };
  }
}

// Action Item Detector
class ActionItemDetector {
  detectActionItems(text) {
    const actionKeywords = [
      'need to', 'should', 'will', 'must', 'action item',
      'todo', 'follow up', 'schedule', 'prepare', 'review'
    ];
    
    const sentences = text.split(/[.!?]+/);
    const actionItems = [];
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (actionKeywords.some(keyword => lowerSentence.includes(keyword))) {
        actionItems.push(sentence.trim());
      }
    });
    
    return actionItems;
  }
}

// Keyword Highlighter
class KeywordHighlighter {
  constructor() {
    this.keywords = [
      'important', 'urgent', 'deadline', 'priority', 'critical',
      'action', 'decision', 'budget', 'timeline', 'milestone'
    ];
  }
  
  highlightKeywords(text) {
    let highlightedText = text;
    
    this.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="keyword-highlight">${keyword}</mark>`);
    });
    
    return highlightedText;
  }
}

// Sentiment Analyzer
class SentimentAnalyzer {
  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'happy', 'success'];
    const negativeWords = ['bad', 'terrible', 'negative', 'problem', 'issue', 'concern'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'Positive';
    if (negativeScore > positiveScore) return 'Negative';
    return 'Neutral';
  }
}

// Speaker Identifier
class SpeakerIdentifier {
  constructor() {
    this.speakers = new Map();
    this.currentSpeaker = null;
  }
  
  identifySpeaker(audioFeatures) {
    // Simulate speaker identification based on voice characteristics
    const speakerProfiles = [
      { id: 'speaker1', name: 'Alex Chen', voiceprint: 'profile1' },
      { id: 'speaker2', name: 'Sarah Johnson', voiceprint: 'profile2' },
      { id: 'speaker3', name: 'Mike Rodriguez', voiceprint: 'profile3' },
      { id: 'speaker4', name: 'Emily Davis', voiceprint: 'profile4' }
    ];
    
    // Random speaker selection for demo
    const randomSpeaker = speakerProfiles[Math.floor(Math.random() * speakerProfiles.length)];
    this.currentSpeaker = randomSpeaker;
    
    return randomSpeaker;
  }
  
  getCurrentSpeaker() {
    return this.currentSpeaker;
  }
}

// Data Redactor
class DataRedactor {
  constructor() {
    this.sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, // Phone number
    ];
    
    this.sensitiveKeywords = [
      'password', 'confidential', 'secret', 'private',
      'salary', 'ssn', 'social security', 'credit card'
    ];
  }
  
  redactSensitiveData(text) {
    let redactedText = text;
    
    // Redact patterns
    this.sensitivePatterns.forEach(pattern => {
      redactedText = redactedText.replace(pattern, '[REDACTED]');
    });
    
    // Redact sensitive keywords
    this.sensitiveKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      redactedText = redactedText.replace(regex, '[REDACTED]');
    });
    
    return redactedText;
  }
}

// Live Caption Overlay Manager
class LiveCaptionManager {
  constructor() {
    this.isActive = false;
    this.overlay = null;
    this.captionText = null;
  }
  
  initialize() {
    this.overlay = document.getElementById('captionOverlay');
    this.captionText = document.getElementById('captionText');
    
    const closeCaptions = document.getElementById('closeCaptions');
    if (closeCaptions) {
      closeCaptions.addEventListener('click', () => this.hideCaptions());
    }
  }
  
  showCaptions() {
    if (this.overlay) {
      this.overlay.classList.add('active');
      this.isActive = true;
    }
  }
  
  hideCaptions() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.isActive = false;
    }
  }
  
  updateCaption(text) {
    if (this.captionText && this.isActive) {
      this.captionText.textContent = text;
    }
  }
}