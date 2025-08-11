// Meetings Manager
class MeetingsManager {
  constructor() {
    this.meetings = [];
    this.currentFilter = 'all';
    this.currentTeamFilter = 'all';
    
    this.setupEventListeners();
    this.generateSampleMeetings();
  }
  
  setupEventListeners() {
    const scheduleMeetingBtn = document.getElementById('scheduleMeetingBtn');
    if (scheduleMeetingBtn) {
      scheduleMeetingBtn.addEventListener('click', () => {
        if (window.app) {
          window.app.openModal('scheduleMeetingModal');
        }
      });
    }
    
    // Filter event listeners
    const statusFilter = document.querySelector('.meetings-sidebar select');
    const teamFilter = document.querySelectorAll('.meetings-sidebar select')[1];
    
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.renderMeetings();
      });
    }
    
    if (teamFilter) {
      teamFilter.addEventListener('change', (e) => {
        this.currentTeamFilter = e.target.value;
        this.renderMeetings();
      });
    }
  }
  
  generateSampleMeetings() {
    const now = new Date();
    const teams = ['engineering', 'marketing', 'sales', 'design'];
    const statuses = ['upcoming', 'live', 'completed'];
    const titles = [
      'Weekly Team Standup',
      'Product Planning Session',
      'Client Presentation',
      'Sprint Retrospective',
      'Quarterly Review',
      'Design System Discussion',
      'Sales Strategy Meeting',
      'Technical Architecture Review',
      'User Research Findings',
      'Budget Planning Session'
    ];
    
    this.meetings = [];
    
    for (let i = 0; i < 12; i++) {
      const meeting = {
        id: this.generateId(),
        title: titles[Math.floor(Math.random() * titles.length)],
        date: new Date(now.getTime() + (Math.random() - 0.5) * 7 * 24 * 60 * 60 * 1000),
        duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
        team: teams[Math.floor(Math.random() * teams.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        participants: this.generateParticipants(),
        description: 'Discuss project progress and upcoming milestones.'
      };
      
      // Adjust status based on date
      if (meeting.date < now) {
        meeting.status = 'completed';
      } else if (Math.abs(meeting.date - now) < 60 * 60 * 1000) {
        meeting.status = 'live';
      } else {
        meeting.status = 'upcoming';
      }
      
      this.meetings.push(meeting);
    }
    
    // Sort meetings by date
    this.meetings.sort((a, b) => a.date - b.date);
  }
  
  generateParticipants() {
    const names = ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis', 'David Kim', 'Lisa Wang'];
    const count = Math.floor(Math.random() * 4) + 2;
    const participants = [];
    
    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      if (!participants.find(p => p.name === name)) {
        participants.push({
          name: name,
          avatar: name.split(' ').map(n => n[0]).join('')
        });
      }
    }
    
    return participants;
  }
  
  loadMeetings() {
    this.renderMeetings();
  }
  
  renderMeetings() {
    const meetingsGrid = document.getElementById('meetingsGrid');
    if (!meetingsGrid) return;
    
    let filteredMeetings = this.meetings;
    
    // Apply status filter
    if (this.currentFilter !== 'all') {
      filteredMeetings = filteredMeetings.filter(meeting => meeting.status === this.currentFilter);
    }
    
    // Apply team filter
    if (this.currentTeamFilter !== 'all') {
      filteredMeetings = filteredMeetings.filter(meeting => meeting.team === this.currentTeamFilter);
    }
    
    meetingsGrid.innerHTML = '';
    
    if (filteredMeetings.length === 0) {
      meetingsGrid.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
          <h3>No meetings found</h3>
          <p>Try adjusting your filters or schedule a new meeting.</p>
        </div>
      `;
      return;
    }
    
    filteredMeetings.forEach(meeting => {
      const meetingCard = this.createMeetingCard(meeting);
      meetingsGrid.appendChild(meetingCard);
    });
  }
  
  createMeetingCard(meeting) {
    const card = document.createElement('div');
    card.className = 'meeting-card';
    
    const statusClass = meeting.status;
    const statusText = meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1);
    
    const participantsHtml = meeting.participants.slice(0, 4).map(participant => 
      `<div class="participant-avatar">${participant.avatar}</div>`
    ).join('');
    
    const moreParticipants = meeting.participants.length > 4 ? 
      `<div class="participant-avatar">+${meeting.participants.length - 4}</div>` : '';
    
    card.innerHTML = `
      <div class="meeting-header">
        <div>
          <h3 class="meeting-title">${meeting.title}</h3>
          <div class="meeting-time">
            ${this.formatDate(meeting.date)} at ${this.formatTime(meeting.date)} • ${meeting.duration}min
          </div>
        </div>
        <span class="meeting-status ${statusClass}">${statusText}</span>
      </div>
      
      <div class="meeting-participants">
        ${participantsHtml}
        ${moreParticipants}
      </div>
      
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">${meeting.description}</p>
      
      <div class="meeting-actions">
        ${this.getMeetingActions(meeting)}
      </div>
    `;
    
    return card;
  }
  
  getMeetingActions(meeting) {
    switch (meeting.status) {
      case 'upcoming':
        return `
          <button class="btn btn-sm btn-primary" onclick="meetingsManager.joinMeeting('${meeting.id}')">Join Meeting</button>
          <button class="btn btn-sm" onclick="meetingsManager.editMeeting('${meeting.id}')">Edit</button>
        `;
      case 'live':
        return `
          <button class="btn btn-sm btn-success" onclick="meetingsManager.joinMeeting('${meeting.id}')">Join Live</button>
          <button class="btn btn-sm" onclick="meetingsManager.viewMeeting('${meeting.id}')">View Details</button>
        `;
      case 'completed':
        return `
          <button class="btn btn-sm" onclick="meetingsManager.viewRecording('${meeting.id}')">View Recording</button>
          <button class="btn btn-sm" onclick="meetingsManager.viewTranscript('${meeting.id}')">Transcript</button>
        `;
      default:
        return '';
    }
  }
  
  joinMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      if (window.app) {
        window.app.showNotification(`Joining "${meeting.title}"...`, 'info');
      }
      // Simulate joining meeting
      setTimeout(() => {
        if (window.app) {
          window.app.showNotification('Connected to meeting successfully', 'success');
        }
      }, 2000);
    }
  }
  
  editMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      if (window.app) {
        window.app.showNotification('Opening meeting editor...', 'info');
        window.app.openModal('scheduleMeetingModal');
      }
    }
  }
  
  viewMeeting(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      if (window.app) {
        window.app.showNotification(`Viewing details for "${meeting.title}"`, 'info');
      }
    }
  }
  
  viewRecording(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      if (window.app) {
        window.app.showNotification(`Opening recording for "${meeting.title}"`, 'info');
      }
    }
  }
  
  viewTranscript(meetingId) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (meeting) {
      if (window.app) {
        window.app.showNotification(`Opening transcript for "${meeting.title}"`, 'info');
      }
    }
  }
  
  formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
  
  formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
