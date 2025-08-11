// Custom Vocabulary Manager
class CustomVocabularyManager {
  constructor() {
    this.customWords = new Map();
    this.categories = new Map();
    this.isEnabled = true;
    
    this.loadVocabulary();
    this.setupEventListeners();
    this.initializeDefaultCategories();
  }
  
  setupEventListeners() {
    // Add word form
    const addWordForm = document.getElementById('addWordForm');
    if (addWordForm) {
      addWordForm.addEventListener('submit', (e) => this.addCustomWord(e));
    }
    
    // Import vocabulary
    const importVocabBtn = document.getElementById('importVocabBtn');
    const importVocabFile = document.getElementById('importVocabFile');
    
    if (importVocabBtn && importVocabFile) {
      importVocabBtn.addEventListener('click', () => importVocabFile.click());
      importVocabFile.addEventListener('change', (e) => this.importVocabulary(e));
    }
    
    // Export vocabulary
    const exportVocabBtn = document.getElementById('exportVocabBtn');
    if (exportVocabBtn) {
      exportVocabBtn.addEventListener('click', () => this.exportVocabulary());
    }
    
    // Enable/disable toggle
    const enableVocabToggle = document.getElementById('enableVocabToggle');
    if (enableVocabToggle) {
      enableVocabToggle.addEventListener('change', (e) => {
        this.isEnabled = e.target.checked;
        this.saveVocabulary();
      });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => this.filterByCategory(e.target.value));
    }
    
    // Search words
    const searchWords = document.getElementById('searchWords');
    if (searchWords) {
      searchWords.addEventListener('input', (e) => this.searchVocabulary(e.target.value));
    }
  }
  
  initializeDefaultCategories() {
    const defaultCategories = [
      { id: 'general', name: 'General', color: '#64748b' },
      { id: 'technical', name: 'Technical', color: '#3b82f6' },
      { id: 'medical', name: 'Medical', color: '#ef4444' },
      { id: 'legal', name: 'Legal', color: '#8b5cf6' },
      { id: 'business', name: 'Business', color: '#10b981' },
      { id: 'academic', name: 'Academic', color: '#f59e0b' },
      { id: 'names', name: 'Names & Places', color: '#06b6d4' }
    ];
    
    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
    
    this.updateCategoryOptions();
  }
  
  loadVocabulary() {
    const saved = localStorage.getItem('accent-neutralizer-vocabulary');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.customWords = new Map(data.words || []);
        this.isEnabled = data.enabled !== false;
        
        // Load categories if saved
        if (data.categories) {
          this.categories = new Map(data.categories);
        }
      } catch (error) {
        console.error('Error loading vocabulary:', error);
      }
    }
    
    this.updateVocabularyUI();
  }
  
  saveVocabulary() {
    const data = {
      words: Array.from(this.customWords.entries()),
      categories: Array.from(this.categories.entries()),
      enabled: this.isEnabled,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('accent-neutralizer-vocabulary', JSON.stringify(data));
  }
  
  addCustomWord(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const wordData = {
      word: formData.get('word').toLowerCase().trim(),
      pronunciation: formData.get('pronunciation').trim(),
      category: formData.get('category'),
      definition: formData.get('definition').trim(),
      alternatives: formData.get('alternatives').split(',').map(alt => alt.trim()).filter(alt => alt),
      addedAt: new Date().toISOString(),
      usageCount: 0
    };
    
    if (!wordData.word) {
      if (window.app) {
        window.app.showNotification('Word is required', 'error');
      }
      return;
    }
    
    if (this.customWords.has(wordData.word)) {
      if (!confirm('Word already exists. Update it?')) {
        return;
      }
      
      // Preserve usage count
      const existing = this.customWords.get(wordData.word);
      wordData.usageCount = existing.usageCount;
      wordData.addedAt = existing.addedAt;
      wordData.updatedAt = new Date().toISOString();
    }
    
    this.customWords.set(wordData.word, wordData);
    this.saveVocabulary();
    this.updateVocabularyUI();
    
    // Clear form
    event.target.reset();
    
    if (window.app) {
      window.app.showNotification(`Word "${wordData.word}" added to vocabulary`, 'success');
    }
  }
  
  removeWord(word) {
    if (this.customWords.has(word)) {
      if (confirm(`Remove "${word}" from vocabulary?`)) {
        this.customWords.delete(word);
        this.saveVocabulary();
        this.updateVocabularyUI();
        
        if (window.app) {
          window.app.showNotification(`Word "${word}" removed`, 'info');
        }
      }
    }
  }
  
  editWord(word) {
    const wordData = this.customWords.get(word);
    if (!wordData) return;
    
    // Pre-fill form with existing data
    const wordInput = document.getElementById('wordInput');
    const pronunciationInput = document.getElementById('pronunciationInput');
    const categorySelect = document.getElementById('categorySelect');
    const definitionInput = document.getElementById('definitionInput');
    const alternativesInput = document.getElementById('alternativesInput');
    
    if (wordInput) wordInput.value = wordData.word;
    if (pronunciationInput) pronunciationInput.value = wordData.pronunciation || '';
    if (categorySelect) categorySelect.value = wordData.category || 'general';
    if (definitionInput) definitionInput.value = wordData.definition || '';
    if (alternativesInput) alternativesInput.value = wordData.alternatives?.join(', ') || '';
    
    // Scroll to form
    const form = document.getElementById('addWordForm');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  searchVocabulary(query) {
    const filteredWords = new Map();
    
    if (!query.trim()) {
      this.updateWordsList(this.customWords);
      return;
    }
    
    const searchTerm = query.toLowerCase();
    
    this.customWords.forEach((wordData, word) => {
      if (
        word.includes(searchTerm) ||
        wordData.pronunciation?.toLowerCase().includes(searchTerm) ||
        wordData.definition?.toLowerCase().includes(searchTerm) ||
        wordData.alternatives?.some(alt => alt.toLowerCase().includes(searchTerm))
      ) {
        filteredWords.set(word, wordData);
      }
    });
    
    this.updateWordsList(filteredWords);
  }
  
  filterByCategory(categoryId) {
    if (categoryId === 'all') {
      this.updateWordsList(this.customWords);
      return;
    }
    
    const filteredWords = new Map();
    
    this.customWords.forEach((wordData, word) => {
      if (wordData.category === categoryId) {
        filteredWords.set(word, wordData);
      }
    });
    
    this.updateWordsList(filteredWords);
  }
  
  updateVocabularyUI() {
    this.updateWordsList(this.customWords);
    this.updateVocabularyStats();
    this.updateCategoryOptions();
  }
  
  updateWordsList(wordsMap) {
    const wordsList = document.getElementById('vocabularyList');
    if (!wordsList) return;
    
    wordsList.innerHTML = '';
    
    if (wordsMap.size === 0) {
      wordsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>No words found</h3>
          <p>Add custom words to improve recognition accuracy</p>
        </div>
      `;
      return;
    }
    
    // Sort words alphabetically
    const sortedWords = Array.from(wordsMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    sortedWords.forEach(([word, wordData]) => {
      const category = this.categories.get(wordData.category);
      const wordElement = document.createElement('div');
      wordElement.className = 'vocabulary-item';
      
      wordElement.innerHTML = `
        <div class="word-info">
          <div class="word-header">
            <span class="word-text">${word}</span>
            <span class="word-category" style="background-color: ${category?.color || '#64748b'}">
              ${category?.name || 'General'}
            </span>
          </div>
          
          ${wordData.pronunciation ? `
            <div class="word-pronunciation">
              <span class="pronunciation-label">Pronunciation:</span>
              <span class="pronunciation-text">${wordData.pronunciation}</span>
            </div>
          ` : ''}
          
          ${wordData.definition ? `
            <div class="word-definition">${wordData.definition}</div>
          ` : ''}
          
          ${wordData.alternatives && wordData.alternatives.length > 0 ? `
            <div class="word-alternatives">
              <span class="alternatives-label">Alternatives:</span>
              ${wordData.alternatives.map(alt => `<span class="alternative-word">${alt}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="word-meta">
            <span class="usage-count">Used ${wordData.usageCount} times</span>
            <span class="added-date">Added ${new Date(wordData.addedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="word-actions">
          <button class="btn btn-sm" onclick="customVocabularyManager.editWord('${word}')" title="Edit">
            ✏️
          </button>
          <button class="btn btn-sm" onclick="customVocabularyManager.removeWord('${word}')" title="Remove">
            🗑️
          </button>
          <button class="btn btn-sm" onclick="customVocabularyManager.testPronunciation('${word}')" title="Test">
            🔊
          </button>
        </div>
      `;
      
      wordsList.appendChild(wordElement);
    });
  }
  
  updateVocabularyStats() {
    const totalWords = document.getElementById('totalWords');
    const categoriesCount = document.getElementById('categoriesCount');
    const mostUsedCategory = document.getElementById('mostUsedCategory');
    
    if (totalWords) {
      totalWords.textContent = this.customWords.size;
    }
    
    if (categoriesCount) {
      const usedCategories = new Set();
      this.customWords.forEach(wordData => {
        if (wordData.category) {
          usedCategories.add(wordData.category);
        }
      });
      categoriesCount.textContent = usedCategories.size;
    }
    
    if (mostUsedCategory) {
      const categoryUsage = new Map();
      this.customWords.forEach(wordData => {
        const category = wordData.category || 'general';
        categoryUsage.set(category, (categoryUsage.get(category) || 0) + 1);
      });
      
      let mostUsed = 'None';
      let maxCount = 0;
      
      categoryUsage.forEach((count, category) => {
        if (count > maxCount) {
          maxCount = count;
          mostUsed = this.categories.get(category)?.name || category;
        }
      });
      
      mostUsedCategory.textContent = mostUsed;
    }
  }
  
  updateCategoryOptions() {
    const categorySelect = document.getElementById('categorySelect');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const updateSelect = (select) => {
      if (!select) return;
      
      const currentValue = select.value;
      select.innerHTML = '';
      
      if (select.id === 'categoryFilter') {
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Categories';
        select.appendChild(allOption);
      }
      
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
      
      select.value = currentValue;
    };
    
    updateSelect(categorySelect);
    updateSelect(categoryFilter);
  }
  
  testPronunciation(word) {
    const wordData = this.customWords.get(word);
    if (!wordData) return;
    
    // Use speech synthesis to test pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
      
      if (window.app) {
        window.app.showNotification(`Playing pronunciation for "${word}"`, 'info');
      }
    } else {
      if (window.app) {
        window.app.showNotification('Speech synthesis not supported', 'warning');
      }
    }
  }
  
  importVocabulary(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedWords = [];
        
        if (file.type === 'application/json') {
          const data = JSON.parse(e.target.result);
          importedWords = data.words || data;
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          importedWords = this.parseCSV(e.target.result);
        } else {
          // Plain text - one word per line
          importedWords = e.target.result.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(word => ({ word: word.toLowerCase(), category: 'general' }));
        }
        
        let importCount = 0;
        importedWords.forEach(wordData => {
          if (wordData.word) {
            const word = wordData.word.toLowerCase().trim();
            if (word) {
              this.customWords.set(word, {
                word: word,
                pronunciation: wordData.pronunciation || '',
                category: wordData.category || 'general',
                definition: wordData.definition || '',
                alternatives: wordData.alternatives || [],
                addedAt: new Date().toISOString(),
                usageCount: 0
              });
              importCount++;
            }
          }
        });
        
        this.saveVocabulary();
        this.updateVocabularyUI();
        
        if (window.app) {
          window.app.showNotification(`Imported ${importCount} words`, 'success');
        }
      } catch (error) {
        console.error('Import failed:', error);
        if (window.app) {
          window.app.showNotification('Failed to import vocabulary', 'error');
        }
      }
    };
    
    reader.readAsText(file);
    
    // Clear file input
    event.target.value = '';
  }
  
  parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const words = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= headers.length && values[0]) {
        const wordData = {};
        headers.forEach((header, index) => {
          wordData[header] = values[index] || '';
        });
        words.push(wordData);
      }
    }
    
    return words;
  }
  
  exportVocabulary() {
    const exportData = {
      metadata: {
        title: 'Accent Neutralizer Custom Vocabulary',
        exportedAt: new Date().toISOString(),
        totalWords: this.customWords.size,
        version: '1.0'
      },
      categories: Array.from(this.categories.entries()).map(([id, category]) => ({
        id,
        ...category
      })),
      words: Array.from(this.customWords.entries()).map(([word, data]) => ({
        word,
        ...data
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-vocabulary-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.app) {
      window.app.showNotification('Vocabulary exported successfully', 'success');
    }
  }
  
  // Check if word should be recognized with custom pronunciation
  getCustomPronunciation(word) {
    if (!this.isEnabled) return null;
    
    const wordData = this.customWords.get(word.toLowerCase());
    if (wordData) {
      // Increment usage count
      wordData.usageCount++;
      this.saveVocabulary();
      
      return {
        pronunciation: wordData.pronunciation,
        alternatives: wordData.alternatives,
        definition: wordData.definition
      };
    }
    
    return null;
  }
  
  // Suggest corrections based on custom vocabulary
  suggestCorrections(text) {
    if (!this.isEnabled) return text;
    
    let correctedText = text;
    
    this.customWords.forEach((wordData, customWord) => {
      // Replace alternatives with the custom word
      if (wordData.alternatives) {
        wordData.alternatives.forEach(alternative => {
          const regex = new RegExp(`\\b${alternative}\\b`, 'gi');
          correctedText = correctedText.replace(regex, customWord);
        });
      }
    });
    
    return correctedText;
  }
  
  // Add category
  addCategory(name, color) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    if (this.categories.has(id)) {
      if (window.app) {
        window.app.showNotification('Category already exists', 'warning');
      }
      return false;
    }
    
    this.categories.set(id, { id, name, color });
    this.saveVocabulary();
    this.updateCategoryOptions();
    
    if (window.app) {
      window.app.showNotification(`Category "${name}" added`, 'success');
    }
    
    return true;
  }
  
  // Bulk operations
  bulkImportFromText(text) {
    const words = text.split(/[\n,;]/)
      .map(word => word.trim().toLowerCase())
      .filter(word => word && !this.customWords.has(word));
    
    let importCount = 0;
    words.forEach(word => {
      this.customWords.set(word, {
        word: word,
        pronunciation: '',
        category: 'general',
        definition: '',
        alternatives: [],
        addedAt: new Date().toISOString(),
        usageCount: 0
      });
      importCount++;
    });
    
    this.saveVocabulary();
    this.updateVocabularyUI();
    
    if (window.app) {
      window.app.showNotification(`Added ${importCount} words`, 'success');
    }
  }
}
