interface UpdateData {
  event: string;
  data: {
    [key: string]: any;
  };
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
  }

  connect() {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }

  onMessage(callback: (data: UpdateData) => void) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as UpdateData;
        callback(data);
      };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const setupWebSocket = (onVariablesUpdate: (variables: any) => void) => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'variables_update') {
            onVariablesUpdate(data.data);
        }
    };

    return ws;
};
const websocketService = new WebSocketService();
export default websocketService;