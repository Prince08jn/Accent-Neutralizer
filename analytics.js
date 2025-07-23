// Analytics Manager
class AnalyticsManager {
  constructor() {
    this.chartData = {
      usage: [60, 80, 45, 90, 70, 85, 95],
      languages: [
        { name: 'English', percentage: 65 },
        { name: 'Spanish', percentage: 20 },
        { name: 'French', percentage: 10 },
        { name: 'Other', percentage: 5 }
      ]
    };
    
    this.stats = {
      totalTranscriptions: 2847,
      timeSaved: 156,
      accuracyRate: 97.3,
      activeMembers: 24
    };
  }
  
  updateCharts() {
    this.animateStats();
    this.animateCharts();
  }
  
  animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
        
        // Animate the number
        const numberElement = card.querySelector('h3');
        if (numberElement) {
          this.animateNumber(numberElement, this.getStatValue(index));
        }
      }, index * 100);
    });
  }
  
  getStatValue(index) {
    switch (index) {
      case 0: return this.stats.totalTranscriptions;
      case 1: return this.stats.timeSaved;
      case 2: return this.stats.accuracyRate;
      case 3: return this.stats.activeMembers;
      default: return 0;
    }
  }
  
  animateNumber(element, targetValue) {
    const startValue = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
      
      if (element.textContent.includes('%')) {
        element.textContent = `${currentValue.toFixed(1)}%`;
      } else if (element.textContent.includes('h')) {
        element.textContent = `${Math.floor(currentValue)}h`;
      } else if (targetValue > 1000) {
        element.textContent = Math.floor(currentValue).toLocaleString();
      } else {
        element.textContent = Math.floor(currentValue).toString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);
  }
  
  animateCharts() {
    this.animateUsageChart();
    this.animateLanguageChart();
  }
  
  animateUsageChart() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transform = 'scaleY(1)';
        bar.style.transformOrigin = 'bottom';
        
        // Add hover effect
        bar.addEventListener('mouseenter', () => {
          bar.style.background = 'var(--accent-hover)';
          
          // Show tooltip
          this.showTooltip(bar, `Day ${index + 1}: ${this.chartData.usage[index]}%`);
        });
        
        bar.addEventListener('mouseleave', () => {
          bar.style.background = 'var(--accent-primary)';
          this.hideTooltip();
        });
      }, index * 100);
    });
  }
  
  animateLanguageChart() {
    const languageProgress = document.querySelectorAll('.language-progress');
    
    languageProgress.forEach((progress, index) => {
      setTimeout(() => {
        const targetWidth = this.chartData.languages[index].percentage;
        progress.style.width = `${targetWidth}%`;
        progress.style.transition = 'width 1s ease-out';
      }, index * 200);
    });
  }
  
  showTooltip(element, text) {
    // Remove existing tooltip
    this.hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-primary);
      box-shadow: var(--shadow-md);
      z-index: 1000;
      pointer-events: none;
      transform: translateX(-50%);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
  }
  
  hideTooltip() {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
  
  generateReport() {
    const reportData = {
      period: 'Last 30 days',
      stats: this.stats,
      usage: this.chartData.usage,
      languages: this.chartData.languages,
      insights: [
        'Transcription accuracy has improved by 0.5% this month',
        'Spanish usage increased by 15% compared to last month',
        'Peak usage hours are between 2-4 PM EST',
        'Team collaboration efficiency improved by 12%'
      ]
    };
    
    // Create downloadable report
    const reportText = this.formatReport(reportData);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Analytics report downloaded', 'success');
    }
  }
  
  formatReport(data) {
    let report = 'Accent Neutralizer Analytics Report\n';
    report += '=====================================\n\n';
    report += `Report Period: ${data.period}\n\n`;
    
    report += 'Key Statistics:\n';
    report += `- Total Transcriptions: ${data.stats.totalTranscriptions.toLocaleString()}\n`;
    report += `- Time Saved: ${data.stats.timeSaved} hours\n`;
    report += `- Accuracy Rate: ${data.stats.accuracyRate}%\n`;
    report += `- Active Team Members: ${data.stats.activeMembers}\n\n`;
    
    report += 'Language Distribution:\n';
    data.languages.forEach(lang => {
      report += `- ${lang.name}: ${lang.percentage}%\n`;
    });
    
    report += '\nKey Insights:\n';
    data.insights.forEach(insight => {
      report += `- ${insight}\n`;
    });
    
    return report;
  }
  
  refreshData() {
    // Simulate data refresh
    this.stats.totalTranscriptions += Math.floor(Math.random() * 50);
    this.stats.timeSaved += Math.floor(Math.random() * 5);
    this.stats.accuracyRate += (Math.random() - 0.5) * 0.2;
    
    // Update usage data
    this.chartData.usage = this.chartData.usage.map(() => 
      Math.floor(Math.random() * 50) + 50
    );
    
    this.updateCharts();
    
    if (window.app) {
      window.app.showNotification('Analytics data refreshed', 'success');
    }
  }
}