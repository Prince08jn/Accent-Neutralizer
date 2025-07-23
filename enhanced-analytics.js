// Enhanced Analytics Manager
class EnhancedAnalyticsManager extends AnalyticsManager {
  constructor() {
    super();
    
    this.wordClouds = new Map();
    this.speakerAnalytics = new Map();
    this.sentimentHistory = [];
    this.topicAnalysis = new Map();
    this.engagementMetrics = new Map();
    
    this.setupEnhancedEventListeners();
    this.initializeEnhancedData();
  }
  
  setupEnhancedEventListeners() {
    // Word cloud generation
    const generateWordCloudBtn = document.getElementById('generateWordCloudBtn');
    if (generateWordCloudBtn) {
      generateWordCloudBtn.addEventListener('click', () => this.generateWordCloud());
    }
    
    // Speaker analytics
    const speakerAnalyticsBtn = document.getElementById('speakerAnalyticsBtn');
    if (speakerAnalyticsBtn) {
      speakerAnalyticsBtn.addEventListener('click', () => this.showSpeakerAnalytics());
    }
    
    // Sentiment analysis
    const sentimentAnalysisBtn = document.getElementById('sentimentAnalysisBtn');
    if (sentimentAnalysisBtn) {
      sentimentAnalysisBtn.addEventListener('click', () => this.showSentimentAnalysis());
    }
    
    // Topic analysis
    const topicAnalysisBtn = document.getElementById('topicAnalysisBtn');
    if (topicAnalysisBtn) {
      topicAnalysisBtn.addEventListener('click', () => this.showTopicAnalysis());
    }
    
    // Export analytics
    const exportAnalyticsBtn = document.getElementById('exportAnalyticsBtn');
    if (exportAnalyticsBtn) {
      exportAnalyticsBtn.addEventListener('click', () => this.exportAnalytics());
    }
    
    // Time range selector
    const timeRangeSelect = document.getElementById('analyticsTimeRange');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => this.updateTimeRange(e.target.value));
    }
  }
  
  initializeEnhancedData() {
    // Generate sample speaker analytics
    this.generateSampleSpeakerData();
    
    // Generate sample sentiment history
    this.generateSampleSentimentData();
    
    // Generate sample topic analysis
    this.generateSampleTopicData();
    
    // Generate sample engagement metrics
    this.generateSampleEngagementData();
  }
  
  generateSampleSpeakerData() {
    const speakers = ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis', 'David Kim'];
    
    speakers.forEach(speaker => {
      this.speakerAnalytics.set(speaker, {
        totalSpeakTime: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        wordCount: Math.floor(Math.random() * 2000) + 500,
        averageWordsPerMinute: Math.floor(Math.random() * 50) + 120,
        sentimentScore: Math.random() * 2 - 1, // -1 to 1
        topWords: this.generateTopWords(),
        interruptionCount: Math.floor(Math.random() * 10),
        questionCount: Math.floor(Math.random() * 15),
        engagementScore: Math.random() * 100,
        topics: this.generateSpeakerTopics()
      });
    });
  }
  
  generateTopWords() {
    const words = [
      'project', 'team', 'development', 'client', 'deadline',
      'budget', 'meeting', 'progress', 'issue', 'solution',
      'feature', 'testing', 'deployment', 'feedback', 'review'
    ];
    
    return words
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(word => ({
        word: word,
        count: Math.floor(Math.random() * 50) + 5,
        sentiment: Math.random() * 2 - 1
      }));
  }
  
  generateSpeakerTopics() {
    const topics = [
      'Project Management', 'Technical Discussion', 'Budget Planning',
      'Team Coordination', 'Client Relations', 'Quality Assurance',
      'Timeline Planning', 'Risk Management', 'Innovation', 'Training'
    ];
    
    return topics
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(topic => ({
        topic: topic,
        relevance: Math.random(),
        timeSpent: Math.floor(Math.random() * 300) + 60
      }));
  }
  
  generateSampleSentimentData() {
    const timePoints = 20;
    const now = new Date();
    
    for (let i = 0; i < timePoints; i++) {
      const timestamp = new Date(now.getTime() - (timePoints - i) * 5 * 60 * 1000); // 5-minute intervals
      
      this.sentimentHistory.push({
        timestamp: timestamp,
        positive: Math.random() * 0.4 + 0.3, // 0.3-0.7
        neutral: Math.random() * 0.3 + 0.2,  // 0.2-0.5
        negative: Math.random() * 0.2 + 0.1, // 0.1-0.3
        overall: Math.random() * 2 - 1,      // -1 to 1
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      });
    }
  }
  
  generateSampleTopicData() {
    const topics = [
      'Project Planning', 'Budget Discussion', 'Technical Implementation',
      'Team Coordination', 'Client Feedback', 'Quality Assurance',
      'Timeline Management', 'Risk Assessment', 'Innovation Ideas',
      'Training & Development', 'Process Improvement', 'Market Analysis'
    ];
    
    topics.forEach(topic => {
      this.topicAnalysis.set(topic, {
        frequency: Math.floor(Math.random() * 50) + 10,
        totalTime: Math.floor(Math.random() * 1200) + 300,
        averageSentiment: Math.random() * 2 - 1,
        keyPhrases: this.generateKeyPhrases(),
        speakers: this.generateTopicSpeakers(),
        trend: Math.random() * 0.4 - 0.2 // -0.2 to 0.2
      });
    });
  }
  
  generateKeyPhrases() {
    const phrases = [
      'need to focus on', 'important to consider', 'should prioritize',
      'key challenge is', 'opportunity to improve', 'critical for success',
      'must address', 'potential solution', 'next steps include',
      'recommend that we', 'significant impact', 'worth exploring'
    ];
    
    return phrases
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(phrase => ({
        phrase: phrase,
        frequency: Math.floor(Math.random() * 20) + 3,
        sentiment: Math.random() * 2 - 1
      }));
  }
  
  generateTopicSpeakers() {
    const speakers = ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis'];
    
    return speakers
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(speaker => ({
        name: speaker,
        contribution: Math.random(),
        sentiment: Math.random() * 2 - 1
      }));
  }
  
  generateSampleEngagementData() {
    const metrics = [
      'participation_rate', 'interruption_frequency', 'question_rate',
      'response_time', 'topic_diversity', 'sentiment_stability'
    ];
    
    metrics.forEach(metric => {
      this.engagementMetrics.set(metric, {
        current: Math.random() * 100,
        previous: Math.random() * 100,
        trend: Math.random() * 20 - 10,
        benchmark: Math.random() * 100,
        history: Array.from({ length: 10 }, () => Math.random() * 100)
      });
    });
  }
  
  generateWordCloud() {
    if (window.app) {
      window.app.showNotification('Generating word cloud...', 'info');
    }
    
    // Simulate word cloud generation
    setTimeout(() => {
      const wordCloudData = this.createWordCloudData();
      this.displayWordCloud(wordCloudData);
      
      if (window.app) {
        window.app.showNotification('Word cloud generated', 'success');
      }
    }, 2000);
  }
  
  createWordCloudData() {
    const words = [
      { text: 'project', size: 40, color: '#3b82f6' },
      { text: 'team', size: 35, color: '#10b981' },
      { text: 'development', size: 30, color: '#f59e0b' },
      { text: 'client', size: 28, color: '#ef4444' },
      { text: 'deadline', size: 25, color: '#8b5cf6' },
      { text: 'budget', size: 23, color: '#06b6d4' },
      { text: 'meeting', size: 20, color: '#84cc16' },
      { text: 'progress', size: 18, color: '#f97316' },
      { text: 'feature', size: 16, color: '#ec4899' },
      { text: 'testing', size: 15, color: '#6366f1' },
      { text: 'feedback', size: 14, color: '#14b8a6' },
      { text: 'review', size: 12, color: '#a855f7' },
      { text: 'deployment', size: 11, color: '#f43f5e' },
      { text: 'solution', size: 10, color: '#22c55e' },
      { text: 'issue', size: 9, color: '#eab308' }
    ];
    
    return words;
  }
  
  displayWordCloud(wordData) {
    const wordCloudContainer = document.getElementById('wordCloudContainer');
    if (!wordCloudContainer) return;
    
    wordCloudContainer.innerHTML = '';
    
    // Create word cloud visualization
    const cloudElement = document.createElement('div');
    cloudElement.className = 'word-cloud';
    
    wordData.forEach(word => {
      const wordElement = document.createElement('span');
      wordElement.className = 'word-cloud-item';
      wordElement.textContent = word.text;
      wordElement.style.fontSize = `${word.size}px`;
      wordElement.style.color = word.color;
      wordElement.style.fontWeight = Math.floor(word.size / 10) * 100 + 300;
      
      // Add click handler for word details
      wordElement.addEventListener('click', () => {
        this.showWordDetails(word);
      });
      
      cloudElement.appendChild(wordElement);
    });
    
    wordCloudContainer.appendChild(cloudElement);
  }
  
  showWordDetails(word) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'wordDetailsModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Word Analysis: "${word.text}"</h3>
          <button class="modal-close" onclick="closeModal('wordDetailsModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="word-stats">
            <div class="stat-item">
              <span class="stat-label">Frequency:</span>
              <span class="stat-value">${Math.floor(word.size * 2)} times</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Sentiment:</span>
              <span class="stat-value">${(Math.random() * 2 - 1).toFixed(2)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Context:</span>
              <span class="stat-value">Project Management</span>
            </div>
          </div>
          
          <div class="word-context">
            <h4>Common Phrases:</h4>
            <ul>
              <li>"${word.text} management"</li>
              <li>"${word.text} planning"</li>
              <li>"${word.text} discussion"</li>
            </ul>
          </div>
          
          <div class="word-speakers">
            <h4>Top Speakers:</h4>
            <div class="speaker-list">
              <div class="speaker-item">Alex Chen (45%)</div>
              <div class="speaker-item">Sarah Johnson (30%)</div>
              <div class="speaker-item">Mike Rodriguez (25%)</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  showSpeakerAnalytics() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'speakerAnalyticsModal';
    
    let speakersHtml = '';
    this.speakerAnalytics.forEach((data, speaker) => {
      speakersHtml += `
        <div class="speaker-analytics-card">
          <div class="speaker-header">
            <div class="speaker-avatar">${speaker.split(' ').map(n => n[0]).join('')}</div>
            <div class="speaker-info">
              <h4>${speaker}</h4>
              <p>Engagement Score: ${data.engagementScore.toFixed(1)}%</p>
            </div>
          </div>
          
          <div class="speaker-metrics">
            <div class="metric">
              <span class="metric-label">Talk Time:</span>
              <span class="metric-value">${Math.floor(data.totalSpeakTime / 60)}:${(data.totalSpeakTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Words:</span>
              <span class="metric-value">${data.wordCount.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">WPM:</span>
              <span class="metric-value">${data.averageWordsPerMinute}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Questions:</span>
              <span class="metric-value">${data.questionCount}</span>
            </div>
          </div>
          
          <div class="speaker-sentiment">
            <span class="sentiment-label">Sentiment:</span>
            <div class="sentiment-bar">
              <div class="sentiment-fill" style="width: ${(data.sentimentScore + 1) * 50}%; background: ${data.sentimentScore > 0 ? '#10b981' : '#ef4444'}"></div>
            </div>
            <span class="sentiment-value">${data.sentimentScore.toFixed(2)}</span>
          </div>
          
          <div class="speaker-topics">
            <h5>Top Topics:</h5>
            <div class="topic-tags">
              ${data.topics.slice(0, 3).map(topic => 
                `<span class="topic-tag">${topic.topic}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      `;
    });
    
    modal.innerHTML = `
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h3>Speaker Analytics</h3>
          <button class="modal-close" onclick="closeModal('speakerAnalyticsModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="speakers-grid">
            ${speakersHtml}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  showSentimentAnalysis() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'sentimentAnalysisModal';
    
    modal.innerHTML = `
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h3>Sentiment Analysis Over Time</h3>
          <button class="modal-close" onclick="closeModal('sentimentAnalysisModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="sentiment-chart-container">
            <div class="sentiment-chart" id="sentimentChart"></div>
          </div>
          
          <div class="sentiment-summary">
            <div class="sentiment-stats">
              <div class="sentiment-stat positive">
                <span class="stat-icon">😊</span>
                <span class="stat-label">Positive</span>
                <span class="stat-value">${(this.calculateAverageSentiment('positive') * 100).toFixed(1)}%</span>
              </div>
              <div class="sentiment-stat neutral">
                <span class="stat-icon">😐</span>
                <span class="stat-label">Neutral</span>
                <span class="stat-value">${(this.calculateAverageSentiment('neutral') * 100).toFixed(1)}%</span>
              </div>
              <div class="sentiment-stat negative">
                <span class="stat-icon">😞</span>
                <span class="stat-label">Negative</span>
                <span class="stat-value">${(this.calculateAverageSentiment('negative') * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div class="sentiment-insights">
              <h4>Key Insights:</h4>
              <ul>
                <li>Overall sentiment trend is ${this.getSentimentTrend()}</li>
                <li>Peak positive sentiment occurred at ${this.getPeakSentimentTime('positive')}</li>
                <li>Most neutral discussion period was ${this.getPeakSentimentTime('neutral')}</li>
                <li>Sentiment confidence average: ${(this.getAverageConfidence() * 100).toFixed(1)}%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render sentiment chart
    this.renderSentimentChart();
  }
  
  renderSentimentChart() {
    const chartContainer = document.getElementById('sentimentChart');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '';
    
    // Create simple line chart
    const chart = document.createElement('div');
    chart.className = 'sentiment-line-chart';
    
    const maxHeight = 200;
    const width = chartContainer.offsetWidth || 600;
    const pointWidth = width / this.sentimentHistory.length;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', maxHeight);
    svg.setAttribute('viewBox', `0 0 ${width} ${maxHeight}`);
    
    // Draw sentiment lines
    ['positive', 'neutral', 'negative'].forEach((sentiment, index) => {
      const color = sentiment === 'positive' ? '#10b981' : 
                   sentiment === 'neutral' ? '#6b7280' : '#ef4444';
      
      const points = this.sentimentHistory.map((data, i) => {
        const x = i * pointWidth;
        const y = maxHeight - (data[sentiment] * maxHeight);
        return `${x},${y}`;
      }).join(' ');
      
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points);
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', color);
      polyline.setAttribute('stroke-width', '2');
      
      svg.appendChild(polyline);
    });
    
    chart.appendChild(svg);
    chartContainer.appendChild(chart);
  }
  
  showTopicAnalysis() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'topicAnalysisModal';
    
    let topicsHtml = '';
    Array.from(this.topicAnalysis.entries())
      .sort(([, a], [, b]) => b.frequency - a.frequency)
      .slice(0, 8)
      .forEach(([topic, data]) => {
        const trendIcon = data.trend > 0 ? '📈' : data.trend < 0 ? '📉' : '➡️';
        const trendColor = data.trend > 0 ? '#10b981' : data.trend < 0 ? '#ef4444' : '#6b7280';
        
        topicsHtml += `
          <div class="topic-analysis-card">
            <div class="topic-header">
              <h4>${topic}</h4>
              <div class="topic-trend" style="color: ${trendColor}">
                ${trendIcon} ${(data.trend * 100).toFixed(1)}%
              </div>
            </div>
            
            <div class="topic-metrics">
              <div class="topic-metric">
                <span class="metric-label">Frequency:</span>
                <span class="metric-value">${data.frequency} mentions</span>
              </div>
              <div class="topic-metric">
                <span class="metric-label">Total Time:</span>
                <span class="metric-value">${Math.floor(data.totalTime / 60)}:${(data.totalTime % 60).toString().padStart(2, '0')}</span>
              </div>
              <div class="topic-metric">
                <span class="metric-label">Avg Sentiment:</span>
                <span class="metric-value" style="color: ${data.averageSentiment > 0 ? '#10b981' : '#ef4444'}">
                  ${data.averageSentiment.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div class="topic-phrases">
              <h5>Key Phrases:</h5>
              <div class="phrase-tags">
                ${data.keyPhrases.slice(0, 3).map(phrase => 
                  `<span class="phrase-tag">"${phrase.phrase}"</span>`
                ).join('')}
              </div>
            </div>
            
            <div class="topic-speakers">
              <h5>Top Contributors:</h5>
              <div class="contributor-list">
                ${data.speakers.map(speaker => 
                  `<div class="contributor-item">
                    <span class="contributor-name">${speaker.name}</span>
                    <span class="contributor-percentage">${(speaker.contribution * 100).toFixed(0)}%</span>
                  </div>`
                ).join('')}
              </div>
            </div>
          </div>
        `;
      });
    
    modal.innerHTML = `
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h3>Topic Analysis</h3>
          <button class="modal-close" onclick="closeModal('topicAnalysisModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="topics-grid">
            ${topicsHtml}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  exportAnalytics() {
    const analyticsData = {
      metadata: {
        title: 'Enhanced Analytics Report',
        generatedAt: new Date().toISOString(),
        timeRange: '30 days',
        version: '2.0'
      },
      speakerAnalytics: Object.fromEntries(this.speakerAnalytics),
      sentimentHistory: this.sentimentHistory,
      topicAnalysis: Object.fromEntries(this.topicAnalysis),
      engagementMetrics: Object.fromEntries(this.engagementMetrics),
      wordCloud: this.createWordCloudData(),
      summary: {
        totalSpeakers: this.speakerAnalytics.size,
        totalTopics: this.topicAnalysis.size,
        averageSentiment: this.calculateOverallSentiment(),
        engagementScore: this.calculateOverallEngagement()
      }
    };
    
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Enhanced analytics exported', 'success');
    }
  }
  
  updateTimeRange(range) {
    // Simulate updating data based on time range
    if (window.app) {
      window.app.showNotification(`Analytics updated for ${range}`, 'info');
    }
    
    // Regenerate data based on range
    this.initializeEnhancedData();
    this.updateCharts();
  }
  
  // Helper methods
  calculateAverageSentiment(type) {
    return this.sentimentHistory.reduce((sum, data) => sum + data[type], 0) / this.sentimentHistory.length;
  }
  
  getSentimentTrend() {
    const recent = this.sentimentHistory.slice(-5);
    const earlier = this.sentimentHistory.slice(0, 5);
    
    const recentAvg = recent.reduce((sum, data) => sum + data.overall, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, data) => sum + data.overall, 0) / earlier.length;
    
    return recentAvg > earlierAvg ? 'improving' : recentAvg < earlierAvg ? 'declining' : 'stable';
  }
  
  getPeakSentimentTime(type) {
    const peak = this.sentimentHistory.reduce((max, data) => 
      data[type] > max[type] ? data : max
    );
    
    return peak.timestamp.toLocaleTimeString();
  }
  
  getAverageConfidence() {
    return this.sentimentHistory.reduce((sum, data) => sum + data.confidence, 0) / this.sentimentHistory.length;
  }
  
  calculateOverallSentiment() {
    return this.sentimentHistory.reduce((sum, data) => sum + data.overall, 0) / this.sentimentHistory.length;
  }
  
  calculateOverallEngagement() {
    const engagementValues = Array.from(this.engagementMetrics.values());
    return engagementValues.reduce((sum, metric) => sum + metric.current, 0) / engagementValues.length;
  }
}