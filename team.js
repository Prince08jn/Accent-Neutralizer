// Team Manager
class TeamManager {
  constructor() {
    this.teamMembers = [];
    this.generateSampleTeam();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const inviteBtn = document.getElementById('inviteTeamBtn');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => this.inviteTeamMember());
    }
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterTeamMembers(e.target.value));
    }
  }
  
  generateSampleTeam() {
    const roles = ['Product Manager', 'Software Engineer', 'UX Designer', 'Data Analyst', 'Marketing Manager', 'Sales Representative'];
    const names = [
      'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Davis', 
      'David Kim', 'Lisa Wang', 'James Wilson', 'Maria Garcia',
      'Ryan Thompson', 'Jessica Lee', 'Daniel Brown', 'Amanda Taylor'
    ];
    
    this.teamMembers = names.map((name, index) => ({
      id: this.generateId(),
      name: name,
      role: roles[index % roles.length],
      avatar: name.split(' ').map(n => n[0]).join(''),
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      status: Math.random() > 0.3 ? 'active' : 'offline',
      transcriptions: Math.floor(Math.random() * 200) + 50,
      accuracy: (Math.random() * 5 + 95).toFixed(1),
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
  }
  
  loadTeamMembers() {
    this.renderTeamMembers();
  }
  
  renderTeamMembers(filteredMembers = null) {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    
    const members = filteredMembers || this.teamMembers;
    teamGrid.innerHTML = '';
    
    if (members.length === 0) {
      teamGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
          <h3>No team members found</h3>
          <p>Try adjusting your search or invite new team members.</p>
        </div>
      `;
      return;
    }
    
    members.forEach(member => {
      const memberCard = this.createMemberCard(member);
      teamGrid.appendChild(memberCard);
    });
  }
  
  createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'team-member-card';
    
    const statusIndicator = member.status === 'active' ? 
      '<div style="width: 8px; height: 8px; background: var(--success-color); border-radius: 50%; position: absolute; top: -2px; right: -2px;"></div>' : '';
    
    card.innerHTML = `
      <div class="member-avatar" style="position: relative;">
        ${member.avatar}
        ${statusIndicator}
      </div>
      
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      
      <div class="member-stats">
        <div class="member-stat">
          <div class="member-stat-value">${member.transcriptions}</div>
          <div class="member-stat-label">Transcriptions</div>
        </div>
        <div class="member-stat">
          <div class="member-stat-value">${member.accuracy}%</div>
          <div class="member-stat-label">Accuracy</div>
        </div>
      </div>
      
      <div class="member-actions">
        <button class="btn btn-sm" onclick="teamManager.viewMember('${member.id}')">View Profile</button>
        <button class="btn btn-sm" onclick="teamManager.messageMember('${member.id}')">Message</button>
      </div>
    `;
    
    return card;
  }
  
  filterTeamMembers(searchTerm) {
    if (!searchTerm.trim()) {
      this.renderTeamMembers();
      return;
    }
    
    const filtered = this.teamMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    this.renderTeamMembers(filtered);
  }
  
  inviteTeamMember() {
    // Create a simple prompt for demo purposes
    const email = prompt('Enter email address to invite:');
    if (email && this.isValidEmail(email)) {
      const newMember = {
        id: this.generateId(),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'Team Member',
        avatar: email.substring(0, 2).toUpperCase(),
        email: email,
        status: 'offline',
        transcriptions: 0,
        accuracy: 0,
        joinDate: new Date(),
        lastActive: new Date()
      };
      
      this.teamMembers.push(newMember);
      this.renderTeamMembers();
      
      if (window.app) {
        window.app.showNotification(`Invitation sent to ${email}`, 'success');
      }
    } else if (email) {
      if (window.app) {
        window.app.showNotification('Please enter a valid email address', 'error');
      }
    }
  }
  
  viewMember(memberId) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      if (window.app) {
        window.app.showNotification(`Viewing profile for ${member.name}`, 'info');
      }
      
      // In a real app, this would open a detailed profile modal
      console.log('Member details:', member);
    }
  }
  
  messageMember(memberId) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      if (window.app) {
        window.app.showNotification(`Opening chat with ${member.name}`, 'info');
      }
      
      // In a real app, this would open a messaging interface
      console.log('Starting conversation with:', member);
    }
  }
  
  removeMember(memberId) {
    const memberIndex = this.teamMembers.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      const member = this.teamMembers[memberIndex];
      
      if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
        this.teamMembers.splice(memberIndex, 1);
        this.renderTeamMembers();
        
        if (window.app) {
          window.app.showNotification(`${member.name} removed from team`, 'info');
        }
      }
    }
  }
  
  updateMemberRole(memberId, newRole) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.role = newRole;
      this.renderTeamMembers();
      
      if (window.app) {
        window.app.showNotification(`${member.name}'s role updated to ${newRole}`, 'success');
      }
    }
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  exportTeamData() {
    const csvContent = this.teamMembers.map(member => 
      `"${member.name}","${member.role}","${member.email}","${member.status}","${member.transcriptions}","${member.accuracy}%","${member.joinDate.toLocaleDateString()}"`
    ).join('\n');
    
    const header = '"Name","Role","Email","Status","Transcriptions","Accuracy","Join Date"\n';
    const fullContent = header + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Team data exported successfully', 'success');
    }
  }
}