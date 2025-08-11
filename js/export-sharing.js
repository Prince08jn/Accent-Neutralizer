// Export and Sharing Manager
class ExportSharingManager {
  constructor() {
    this.exportFormats = ['pdf', 'docx', 'txt', 'json'];
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Export buttons
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportDocxBtn = document.getElementById('exportDocxBtn');
    const exportTxtBtn = document.getElementById('exportTxtBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => this.exportToPDF());
    if (exportDocxBtn) exportDocxBtn.addEventListener('click', () => this.exportToDocx());
    if (exportTxtBtn) exportTxtBtn.addEventListener('click', () => this.exportToTxt());
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', () => this.exportToJson());
    
    // Share buttons
    const shareEmailBtn = document.getElementById('shareEmailBtn');
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    
    if (shareEmailBtn) shareEmailBtn.addEventListener('click', () => this.shareViaEmail());
    if (shareLinkBtn) shareLinkBtn.addEventListener('click', () => this.generateShareLink());
  }
  
  async exportToPDF() {
    try {
      if (window.app) {
        window.app.showNotification('Generating PDF...', 'info');
      }
      
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to export');
      }
      
      // Create PDF content
      const pdfContent = this.generatePDFContent(transcriptData);
      
      // Simulate PDF generation (in real app, use jsPDF or similar)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      this.downloadFile(blob, `transcript-${new Date().toISOString().split('T')[0]}.pdf`);
      
      if (window.app) {
        window.app.showNotification('PDF exported successfully', 'success');
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  async exportToDocx() {
    try {
      if (window.app) {
        window.app.showNotification('Generating DOCX...', 'info');
      }
      
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to export');
      }
      
      // Create DOCX content
      const docxContent = this.generateDocxContent(transcriptData);
      
      // Simulate DOCX generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create blob and download
      const blob = new Blob([docxContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      this.downloadFile(blob, `transcript-${new Date().toISOString().split('T')[0]}.docx`);
      
      if (window.app) {
        window.app.showNotification('DOCX exported successfully', 'success');
      }
    } catch (error) {
      console.error('DOCX export failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  async exportToTxt() {
    try {
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to export');
      }
      
      const txtContent = this.generateTxtContent(transcriptData);
      
      const blob = new Blob([txtContent], { type: 'text/plain' });
      this.downloadFile(blob, `transcript-${new Date().toISOString().split('T')[0]}.txt`);
      
      if (window.app) {
        window.app.showNotification('TXT exported successfully', 'success');
      }
    } catch (error) {
      console.error('TXT export failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  async exportToJson() {
    try {
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to export');
      }
      
      const jsonContent = this.generateJsonContent(transcriptData);
      
      const blob = new Blob([jsonContent], { type: 'application/json' });
      this.downloadFile(blob, `transcript-${new Date().toISOString().split('T')[0]}.json`);
      
      if (window.app) {
        window.app.showNotification('JSON exported successfully', 'success');
      }
    } catch (error) {
      console.error('JSON export failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  getTranscriptData() {
    // Get transcript from current context
    if (window.collaborationManager?.currentRoom) {
      return window.collaborationManager.currentRoom.transcript;
    }
    
    // Get from transcription manager
    const transcriptionArea = document.getElementById('transcriptionArea');
    if (transcriptionArea) {
      const messages = transcriptionArea.querySelectorAll('.message');
      return Array.from(messages).map(message => {
        const bubble = message.querySelector('.message-bubble');
        const time = message.querySelector('.message-time');
        const speaker = message.classList.contains('user') ? 'You' : 'Speaker';
        
        return {
          speaker: speaker,
          text: bubble?.textContent || '',
          timestamp: time?.textContent || new Date().toLocaleTimeString(),
          type: message.classList.contains('user') ? 'user' : 'system'
        };
      });
    }
    
    return [];
  }
  
  generatePDFContent(transcriptData) {
    // Simplified PDF content (in real app, use proper PDF library)
    let content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length ${this.generateTxtContent(transcriptData).length}
>>
stream
BT
/F1 12 Tf
72 720 Td
(Accent Neutralizer Transcript) Tj
0 -20 Td
(Generated: ${new Date().toLocaleString()}) Tj
0 -40 Td
`;

    transcriptData.forEach((entry, index) => {
      content += `(${entry.speaker}: ${entry.text}) Tj\n0 -15 Td\n`;
    });

    content += `ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${content.length}
%%EOF`;

    return content;
  }
  
  generateDocxContent(transcriptData) {
    // Simplified DOCX content (in real app, use proper DOCX library)
    const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>Accent Neutralizer Transcript</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Generated: ${new Date().toLocaleString()}</w:t>
      </w:r>
    </w:p>
    ${transcriptData.map(entry => `
    <w:p>
      <w:r>
        <w:t>${entry.speaker}: ${entry.text}</w:t>
      </w:r>
    </w:p>
    `).join('')}
  </w:body>
</w:document>`;
    
    return xmlContent;
  }
  
  generateTxtContent(transcriptData) {
    let content = 'Accent Neutralizer Transcript\n';
    content += '=====================================\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    transcriptData.forEach(entry => {
      content += `[${entry.timestamp}] ${entry.speaker}: ${entry.text}\n`;
    });
    
    return content;
  }
  
  generateJsonContent(transcriptData) {
    const exportData = {
      metadata: {
        title: 'Accent Neutralizer Transcript',
        generatedAt: new Date().toISOString(),
        version: '1.0',
        totalEntries: transcriptData.length
      },
      transcript: transcriptData,
      settings: {
        language: 'auto',
        format: 'json',
        includeTimestamps: true
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  async shareViaEmail() {
    try {
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to share');
      }
      
      const txtContent = this.generateTxtContent(transcriptData);
      const subject = encodeURIComponent('Shared Transcript from Accent Neutralizer');
      const body = encodeURIComponent(`Please find the transcript below:\n\n${txtContent}`);
      
      window.open(`mailto:?subject=${subject}&body=${body}`);
      
      if (window.app) {
        window.app.showNotification('Email client opened', 'success');
      }
    } catch (error) {
      console.error('Email sharing failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  async generateShareLink() {
    try {
      const transcriptData = this.getTranscriptData();
      if (!transcriptData || transcriptData.length === 0) {
        throw new Error('No transcript data to share');
      }
      
      // Generate unique share ID
      const shareId = 'share-' + Math.random().toString(36).substr(2, 12);
      
      // Store transcript data (in real app, send to server)
      const shareData = {
        id: shareId,
        transcript: transcriptData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdBy: window.authManager?.getCurrentUser()?.name || 'Anonymous'
      };
      
      // Store in localStorage for demo
      localStorage.setItem(`shared-transcript-${shareId}`, JSON.stringify(shareData));
      
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      if (window.app) {
        window.app.showNotification('Share link copied to clipboard', 'success');
      }
      
      // Show share modal
      this.showShareLinkModal(shareUrl, shareData);
      
    } catch (error) {
      console.error('Share link generation failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
  
  showShareLinkModal(shareUrl, shareData) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'shareLinkModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Share Transcript</h3>
          <button class="modal-close" onclick="closeModal('shareLinkModal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="share-info">
            <p><strong>Created:</strong> ${new Date(shareData.createdAt).toLocaleString()}</p>
            <p><strong>Expires:</strong> ${new Date(shareData.expiresAt).toLocaleString()}</p>
            <p><strong>Entries:</strong> ${shareData.transcript.length}</p>
          </div>
          
          <div class="share-url-container">
            <label>Share URL:</label>
            <div class="url-input-group">
              <input type="text" value="${shareUrl}" readonly class="form-input">
              <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${shareUrl}'); this.textContent='Copied!'">
                Copy
              </button>
            </div>
          </div>
          
          <div class="share-options">
            <h4>Share via:</h4>
            <div class="share-buttons">
              <button class="btn btn-sm" onclick="window.open('mailto:?subject=Shared Transcript&body=${encodeURIComponent(shareUrl)}')">
                📧 Email
              </button>
              <button class="btn btn-sm" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this transcript: ' + shareUrl)}')">
                🐦 Twitter
              </button>
              <button class="btn btn-sm" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}')">
                💼 LinkedIn
              </button>
            </div>
          </div>
          
          <div class="share-settings">
            <h4>Privacy Settings:</h4>
            <label class="checkbox-label">
              <input type="checkbox" checked> Allow public access
            </label>
            <label class="checkbox-label">
              <input type="checkbox"> Require password
            </label>
            <label class="checkbox-label">
              <input type="checkbox"> Allow downloads
            </label>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  // Batch export functionality
  async exportBatch(transcripts, format) {
    try {
      if (window.app) {
        window.app.showNotification(`Exporting ${transcripts.length} transcripts as ${format.toUpperCase()}...`, 'info');
      }
      
      for (let i = 0; i < transcripts.length; i++) {
        const transcript = transcripts[i];
        const filename = `transcript-${i + 1}-${new Date().toISOString().split('T')[0]}.${format}`;
        
        let content;
        let mimeType;
        
        switch (format) {
          case 'pdf':
            content = this.generatePDFContent(transcript.data);
            mimeType = 'application/pdf';
            break;
          case 'docx':
            content = this.generateDocxContent(transcript.data);
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
          case 'txt':
            content = this.generateTxtContent(transcript.data);
            mimeType = 'text/plain';
            break;
          case 'json':
            content = this.generateJsonContent(transcript.data);
            mimeType = 'application/json';
            break;
          default:
            throw new Error('Unsupported format');
        }
        
        const blob = new Blob([content], { type: mimeType });
        this.downloadFile(blob, filename);
        
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (window.app) {
        window.app.showNotification('Batch export completed', 'success');
      }
    } catch (error) {
      console.error('Batch export failed:', error);
      if (window.app) {
        window.app.showNotification(error.message, 'error');
      }
    }
  }
}
