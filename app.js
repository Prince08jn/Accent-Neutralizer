// Create WebSocket connection
const ws = new WebSocket('ws://localhost:3001');

// When connected
ws.onopen = () => {
  console.log('✅ WebSocket connection opened');
};

// When message received from backend
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('📥 Received:', data);

  if (data.type === 'transcription') {
    document.getElementById('transcription').innerText = data.transcription;
    document.getElementById('summary').innerText = data.summary;
  }
};

// Handle close
ws.onclose = () => {
  console.log('❌ WebSocket connection closed');
};
