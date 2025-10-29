import { useState, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Send, Bot, User, ImagePlus, X, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { streamingChat } from '../services/ai';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string; // base64 encoded image
};

export default function GeminiAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const suggestedQuestions = [
    'Recommend a perfume for summer',
    'What makes EDP different from EDT?',
    'Suggest fragrances similar to Aventus',
    'Best perfumes for evening wear'
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function sendMessage() {
    if (!query.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query || '📷 Image attached',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    // Create placeholder for assistant message
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '...',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      let fullResponse = '';
      const controller = new AbortController();
      abortRef.current = controller;
      await streamingChat(
        {
          query: userMessage.content,
          includeContext: true,
          image: imageToSend || undefined,
        },
        (chunk) => {
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: fullResponse } : msg
            )
          );
        },
        controller.signal
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  'I apologize, but I\'m having trouble processing your request right now. Please try again.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestedQuestion = (question: string) => {
    setQuery(question);
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full">
                        <Bot className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      AI Fragrance Assistant
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      This AI assistant uses Google's Gemini API to provide intelligent fragrance recommendations, answer questions about perfumes, and help you discover your perfect scent.
                    </p>
                  </div>
                  <div className="space-y-2 w-full max-w-md">
                    <p className="text-sm font-medium text-gray-700 text-center">
                      Suggested Questions
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((question, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 px-3 py-2 transition-colors"
                          onClick={() => useSuggestedQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="shrink-0">
                    <AvatarFallback className={message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'}>
                      {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block px-4 py-3 rounded-lg max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <img
                            src={message.image}
                            alt="User uploaded"
                            className="max-w-full rounded-lg max-h-64 object-contain"
                          />
                        </div>
                      )}
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content === '...' ? (
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div className="border-t p-4">
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="shrink-0"
                >
                  <ImagePlus className="w-5 h-5" />
                </Button>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about perfumes..."
                  rows={2}
                  className="resize-none"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <Button
                    type="button"
                    onClick={() => { abortRef.current?.abort(); setIsLoading(false); }}
                    variant="destructive"
                    size="lg"
                    className="px-6 shrink-0"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={sendMessage}
                    disabled={!query.trim() && !selectedImage}
                    size="lg"
                    className="px-6 shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


