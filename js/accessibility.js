// Accessibility Manager
class AccessibilityManager {
  constructor() {
    this.isHighContrast = false;
    this.fontSize = 'normal';
    this.isScreenReaderMode = false;
    this.keyboardNavigation = true;
    this.reducedMotion = false;
    this.focusIndicators = true;
    
    this.loadAccessibilitySettings();
    this.setupEventListeners();
    this.initializeAccessibilityFeatures();
  }
  
  setupEventListeners() {
    // High contrast toggle
    const highContrastToggle = document.getElementById('highContrastToggle');
    if (highContrastToggle) {
      highContrastToggle.addEventListener('change', (e) => {
        this.toggleHighContrast(e.target.checked);
      });
    }
    
    // Font size controls
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        this.setFontSize(e.target.value);
      });
    }
    
    // Screen reader mode
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    if (screenReaderToggle) {
      screenReaderToggle.addEventListener('change', (e) => {
        this.toggleScreenReaderMode(e.target.checked);
      });
    }
    
    // Reduced motion
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    if (reducedMotionToggle) {
      reducedMotionToggle.addEventListener('change', (e) => {
        this.toggleReducedMotion(e.target.checked);
      });
    }
    
    // Keyboard navigation
    const keyboardNavToggle = document.getElementById('keyboardNavToggle');
    if (keyboardNavToggle) {
      keyboardNavToggle.addEventListener('change', (e) => {
        this.toggleKeyboardNavigation(e.target.checked);
      });
    }
    
    // Focus indicators
    const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
    if (focusIndicatorsToggle) {
      focusIndicatorsToggle.addEventListener('change', (e) => {
        this.toggleFocusIndicators(e.target.checked);
      });
    }
    
    // Accessibility shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleAccessibilityShortcuts(e);
    });
    
    // Skip links
    this.setupSkipLinks();
    
    // ARIA live regions
    this.setupLiveRegions();
  }
  
  initializeAccessibilityFeatures() {
    // Apply saved settings
    this.applyAccessibilitySettings();
    
    // Add ARIA labels and roles
    this.enhanceARIA();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Add screen reader announcements
    this.setupScreenReaderAnnouncements();
    
    // Check for system preferences
    this.checkSystemPreferences();
  }
  
  toggleHighContrast(enabled) {
    this.isHighContrast = enabled;
    
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    this.saveAccessibilitySettings();
    this.announceChange('High contrast mode ' + (enabled ? 'enabled' : 'disabled'));
  }
  
  setFontSize(size) {
    this.fontSize = size;
    
    // Remove existing font size classes
    document.documentElement.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    
    // Add new font size class
    if (size !== 'normal') {
      document.documentElement.classList.add(`font-${size}`);
    }
    
    this.saveAccessibilitySettings();
    this.announceChange(`Font size changed to ${size}`);
  }
  
  toggleScreenReaderMode(enabled) {
    this.isScreenReaderMode = enabled;
    
    if (enabled) {
      document.documentElement.classList.add('screen-reader-mode');
      this.enhanceForScreenReaders();
    } else {
      document.documentElement.classList.remove('screen-reader-mode');
    }
    
    this.saveAccessibilitySettings();
    this.announceChange('Screen reader mode ' + (enabled ? 'enabled' : 'disabled'));
  }
  
  toggleReducedMotion(enabled) {
    this.reducedMotion = enabled;
    
    if (enabled) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    this.saveAccessibilitySettings();
    this.announceChange('Reduced motion ' + (enabled ? 'enabled' : 'disabled'));
  }
  
  toggleKeyboardNavigation(enabled) {
    this.keyboardNavigation = enabled;
    
    if (enabled) {
      document.documentElement.classList.add('keyboard-navigation');
      this.setupKeyboardNavigation();
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }
    
    this.saveAccessibilitySettings();
    this.announceChange('Keyboard navigation ' + (enabled ? 'enabled' : 'disabled'));
  }
  
  toggleFocusIndicators(enabled) {
    this.focusIndicators = enabled;
    
    if (enabled) {
      document.documentElement.classList.add('enhanced-focus');
    } else {
      document.documentElement.classList.remove('enhanced-focus');
    }
    
    this.saveAccessibilitySettings();
    this.announceChange('Focus indicators ' + (enabled ? 'enhanced' : 'standard'));
  }
  
  setupSkipLinks() {
    // Create skip navigation links
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
    }
    
    // Add navigation landmark
    const navigation = document.querySelector('.navbar');
    if (navigation) {
      navigation.id = 'navigation';
      navigation.setAttribute('role', 'navigation');
      navigation.setAttribute('aria-label', 'Main navigation');
    }
  }
  
  setupLiveRegions() {
    // Create ARIA live regions for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'aria-live-assertive';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    document.body.appendChild(assertiveRegion);
  }
  
  enhanceARIA() {
    // Add ARIA labels to buttons without text
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      const icon = button.querySelector('.btn-icon');
      if (icon && !button.textContent.trim()) {
        // Try to determine button purpose from context
        const purpose = this.determineButtonPurpose(button);
        if (purpose) {
          button.setAttribute('aria-label', purpose);
        }
      }
    });
    
    // Add ARIA labels to form inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const label = input.closest('.form-group')?.querySelector('label');
      if (label && !label.getAttribute('for')) {
        const id = input.id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        input.id = id;
        label.setAttribute('for', id);
      }
    });
    
    // Add ARIA expanded to collapsible elements
    const collapsibles = document.querySelectorAll('[data-toggle="collapse"]');
    collapsibles.forEach(trigger => {
      if (!trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Add ARIA roles to semantic elements
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      if (!card.hasAttribute('role')) {
        card.setAttribute('role', 'article');
      }
    });
    
    // Add ARIA labels to modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      
      const title = modal.querySelector('.modal-header h3');
      if (title) {
        const titleId = `modal-title-${modal.id}`;
        title.id = titleId;
        modal.setAttribute('aria-labelledby', titleId);
      }
    });
  }
  
  determineButtonPurpose(button) {
    const iconText = button.querySelector('.btn-icon')?.textContent;
    const className = button.className;
    const parent = button.parentElement;
    
    // Common icon mappings
    const iconMappings = {
      '🎤': 'Start recording',
      '⏹️': 'Stop recording',
      '🗑️': 'Delete',
      '✏️': 'Edit',
      '📤': 'Export',
      '📧': 'Send email',
      '🔊': 'Play audio',
      '⚙️': 'Settings',
      '❌': 'Close',
      '×': 'Close'
    };
    
    if (iconText && iconMappings[iconText]) {
      return iconMappings[iconText];
    }
    
    // Class-based mappings
    if (className.includes('close')) return 'Close';
    if (className.includes('delete')) return 'Delete';
    if (className.includes('edit')) return 'Edit';
    if (className.includes('save')) return 'Save';
    if (className.includes('cancel')) return 'Cancel';
    
    // Context-based mappings
    if (parent?.className.includes('modal-header')) return 'Close modal';
    if (parent?.className.includes('notification')) return 'Dismiss notification';
    
    return null;
  }
  
  setupKeyboardNavigation() {
    if (!this.keyboardNavigation) return;
    
    // Add tabindex to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');
    interactiveElements.forEach((element, index) => {
      if (!element.hasAttribute('tabindex') && !element.disabled) {
        element.setAttribute('tabindex', '0');
      }
    });
    
    // Handle keyboard navigation for custom components
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
    
    // Focus management for modals
    this.setupModalFocusManagement();
  }
  
  handleKeyboardNavigation(e) {
    const activeElement = document.activeElement;
    
    switch (e.key) {
      case 'Tab':
        // Enhanced tab navigation
        this.handleTabNavigation(e);
        break;
        
      case 'Enter':
      case ' ':
        // Activate buttons and links
        if (activeElement.hasAttribute('role') && 
            (activeElement.getAttribute('role') === 'button' || 
             activeElement.getAttribute('role') === 'link')) {
          e.preventDefault();
          activeElement.click();
        }
        break;
        
      case 'Escape':
        // Close modals and dropdowns
        this.handleEscapeKey();
        break;
        
      case 'ArrowUp':
      case 'ArrowDown':
        // Navigate lists and menus
        this.handleArrowNavigation(e);
        break;
    }
  }
  
  handleTabNavigation(e) {
    // Trap focus in modals
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      const focusableElements = activeModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  handleEscapeKey() {
    // Close active modal
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      const closeButton = activeModal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.click();
      }
    }
    
    // Close dropdowns
    const openDropdowns = document.querySelectorAll('.dropdown.open');
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }
  
  handleArrowNavigation(e) {
    const activeElement = document.activeElement;
    const parent = activeElement.parentElement;
    
    // Navigate within lists
    if (parent && (parent.classList.contains('nav-menu') || 
                   parent.classList.contains('dropdown-menu'))) {
      e.preventDefault();
      
      const siblings = Array.from(parent.children);
      const currentIndex = siblings.indexOf(activeElement.parentElement || activeElement);
      
      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % siblings.length;
      } else {
        nextIndex = (currentIndex - 1 + siblings.length) % siblings.length;
      }
      
      const nextElement = siblings[nextIndex].querySelector('a, button') || siblings[nextIndex];
      nextElement.focus();
    }
  }
  
  setupModalFocusManagement() {
    // Store previous focus when modal opens
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (modal.classList.contains('active')) {
              // Modal opened
              modal.previousFocus = document.activeElement;
              
              // Focus first focusable element
              const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
              if (firstFocusable) {
                firstFocusable.focus();
              }
            } else {
              // Modal closed
              if (modal.previousFocus) {
                modal.previousFocus.focus();
              }
            }
          }
        });
      });
      
      observer.observe(modal, { attributes: true });
    });
  }
  
  enhanceForScreenReaders() {
    // Add more descriptive text for screen readers
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-describedby')) {
        const description = this.generateButtonDescription(button);
        if (description) {
          const descId = `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const descElement = document.createElement('span');
          descElement.id = descId;
          descElement.className = 'sr-only';
          descElement.textContent = description;
          button.appendChild(descElement);
          button.setAttribute('aria-describedby', descId);
        }
      }
    });
    
    // Add landmarks
    this.addLandmarks();
    
    // Enhance form labels
    this.enhanceFormLabels();
  }
  
  generateButtonDescription(button) {
    const context = button.closest('.card, .modal, .section');
    const contextName = context?.querySelector('h1, h2, h3, h4')?.textContent;
    
    if (contextName) {
      return `In ${contextName} section`;
    }
    
    return null;
  }
  
  addLandmarks() {
    // Add banner landmark
    const header = document.querySelector('header, .navbar');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    // Add contentinfo landmark
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
    
    // Add complementary landmarks
    const sidebars = document.querySelectorAll('.sidebar, .aside');
    sidebars.forEach(sidebar => {
      if (!sidebar.hasAttribute('role')) {
        sidebar.setAttribute('role', 'complementary');
      }
    });
  }
  
  enhanceFormLabels() {
    // Add required indicators
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
      input.setAttribute('aria-required', 'true');
      
      const label = document.querySelector(`label[for="${input.id}"]`) || 
                   input.closest('.form-group')?.querySelector('label');
      
      if (label && !label.textContent.includes('required')) {
        label.innerHTML += ' <span class="required-indicator" aria-label="required">*</span>';
      }
    });
    
    // Add error descriptions
    const invalidInputs = document.querySelectorAll('input:invalid, select:invalid, textarea:invalid');
    invalidInputs.forEach(input => {
      if (!input.getAttribute('aria-describedby')) {
        const errorId = `error-${input.id || Date.now()}`;
        const errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message sr-only';
        errorElement.textContent = 'Please check this field';
        input.parentNode.appendChild(errorElement);
        input.setAttribute('aria-describedby', errorId);
      }
    });
  }
  
  handleAccessibilityShortcuts(e) {
    // Alt + 1-9 for quick navigation
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        e.preventDefault();
        this.navigateToSection(num);
      }
    }
    
    // Alt + H for help
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      this.showAccessibilityHelp();
    }
    
    // Alt + S for settings
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      if (window.app) {
        window.app.showSection('settings');
      }
    }
  }
  
  navigateToSection(num) {
    const sections = ['home', 'transcribe', 'translate', 'meetings', 'analytics', 'team', 'settings'];
    const section = sections[num - 1];
    
    if (section && window.app) {
      window.app.showSection(section);
      this.announceChange(`Navigated to ${section} section`);
    }
  }
  
  showAccessibilityHelp() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'accessibilityHelpModal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Accessibility Help</h3>
          <button class="modal-close" onclick="closeModal('accessibilityHelpModal')" aria-label="Close help dialog">&times;</button>
        </div>
        <div class="modal-body">
          <div class="help-section">
            <h4>Keyboard Shortcuts</h4>
            <ul>
              <li><kbd>Alt + 1-7</kbd> - Navigate to sections</li>
              <li><kbd>Alt + H</kbd> - Show this help</li>
              <li><kbd>Alt + S</kbd> - Open settings</li>
              <li><kbd>Tab</kbd> - Navigate forward</li>
              <li><kbd>Shift + Tab</kbd> - Navigate backward</li>
              <li><kbd>Enter/Space</kbd> - Activate buttons</li>
              <li><kbd>Escape</kbd> - Close modals</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h4>Accessibility Features</h4>
            <ul>
              <li>High contrast mode for better visibility</li>
              <li>Adjustable font sizes</li>
              <li>Screen reader optimizations</li>
              <li>Keyboard navigation support</li>
              <li>Reduced motion options</li>
              <li>Enhanced focus indicators</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h4>Screen Reader Support</h4>
            <p>This application is optimized for screen readers including NVDA, JAWS, and VoiceOver. All interactive elements have appropriate labels and descriptions.</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  checkSystemPreferences() {
    // Check for prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.toggleReducedMotion(true);
    }
    
    // Check for prefers-contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.toggleHighContrast(true);
    }
    
    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.toggleReducedMotion(e.matches);
    });
    
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.toggleHighContrast(e.matches);
    });
  }
  
  announceChange(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  announceUrgent(message) {
    const assertiveRegion = document.getElementById('aria-live-assertive');
    if (assertiveRegion) {
      assertiveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        assertiveRegion.textContent = '';
      }, 1000);
    }
  }
  
  saveAccessibilitySettings() {
    const settings = {
      isHighContrast: this.isHighContrast,
      fontSize: this.fontSize,
      isScreenReaderMode: this.isScreenReaderMode,
      keyboardNavigation: this.keyboardNavigation,
      reducedMotion: this.reducedMotion,
      focusIndicators: this.focusIndicators
    };
    
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }
  
  loadAccessibilitySettings() {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        
        this.isHighContrast = settings.isHighContrast || false;
        this.fontSize = settings.fontSize || 'normal';
        this.isScreenReaderMode = settings.isScreenReaderMode || false;
        this.keyboardNavigation = settings.keyboardNavigation !== false;
        this.reducedMotion = settings.reducedMotion || false;
        this.focusIndicators = settings.focusIndicators !== false;
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }
  
  applyAccessibilitySettings() {
    this.toggleHighContrast(this.isHighContrast);
    this.setFontSize(this.fontSize);
    this.toggleScreenReaderMode(this.isScreenReaderMode);
    this.toggleKeyboardNavigation(this.keyboardNavigation);
    this.toggleReducedMotion(this.reducedMotion);
    this.toggleFocusIndicators(this.focusIndicators);
    
    // Update form controls
    const highContrastToggle = document.getElementById('highContrastToggle');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    const keyboardNavToggle = document.getElementById('keyboardNavToggle');
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
    
    if (highContrastToggle) highContrastToggle.checked = this.isHighContrast;
    if (fontSizeSelect) fontSizeSelect.value = this.fontSize;
    if (screenReaderToggle) screenReaderToggle.checked = this.isScreenReaderMode;
    if (keyboardNavToggle) keyboardNavToggle.checked = this.keyboardNavigation;
    if (reducedMotionToggle) reducedMotionToggle.checked = this.reducedMotion;
    if (focusIndicatorsToggle) focusIndicatorsToggle.checked = this.focusIndicators;
  }
}
