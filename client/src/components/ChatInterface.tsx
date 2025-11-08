import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Code2 } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sql?: string;
  results?: any[];
  visualization?: 'table' | 'chart' | 'number';
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you analyze your data using natural language. Try asking me questions like "What\'s the total spend in the last 90 days?" or "Show me the top 5 vendors by spend."'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const queryText = input;
    setInput("");
    setIsLoading(true);

    try {
      const res = await apiRequest('POST', '/api/chat-with-data', { query: queryText });
      const response = await res.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.message,
        sql: response.sql,
        results: response.results,
        visualization: response.visualization,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error processing your query. Please try again or rephrase your question.`,
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              } rounded-lg p-4`}
              data-testid={`message-${message.type}-${message.id}`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {message.sql && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated SQL</span>
                  </div>
                  <Card className="bg-slate-900 dark:bg-slate-950 p-4">
                    <code className="text-xs text-green-400 font-mono block whitespace-pre-wrap">
                      {message.sql}
                    </code>
                  </Card>
                </div>
              )}

              {message.results && message.results.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Results
                  </div>
                  {message.visualization === 'number' ? (
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(message.results[0]).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-lg font-semibold">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                          <tr>
                            {Object.keys(message.results[0]).map(key => (
                              <th key={key} className="text-left py-2 px-3 text-xs font-medium uppercase">
                                {key.replace('_', ' ')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {message.results.map((row, idx) => (
                            <tr key={idx} className="border-t">
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="py-2 px-3">
                                  {typeof value === 'number' 
                                    ? value.toLocaleString() 
                                    : value != null ? String(value) : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-lg p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Analyzing your query...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Ask about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="resize-none min-h-[44px] max-h-32"
            rows={1}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          AI-powered natural language analytics • Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
