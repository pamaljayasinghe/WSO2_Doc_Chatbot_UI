import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import authService from '../api/authService';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text) {
    if (!text || !text.trim()) return;
    const msg = { id: Date.now(), from: 'user', text };
    setMessages(m => [...m, msg]);
    setInput('');
    setLoading(true);

    try {
      const token = await authService.getAccessToken();
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'product': 'apim',
        'branch': '4_5_0'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://cors-anywhere.com/https://e95488c8-8511-4882-967f-ec3ae2a0f86f-dev.e1-us-east-azure.choreoapis.dev/docs-assistant-us/docs-assistant/v1/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question_context: "User is asking about WSO2 documentation",
          questions: text
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = data.content || data.answer || data.response || JSON.stringify(data);
        setMessages(m => [...m, { id: Date.now() + 1, from: 'bot', text: content }]);
      } else {
        setMessages(m => [...m, { id: Date.now() + 1, from: 'bot', text: 'Unable to get response. Please try again.' }]);
      }
    } catch (err) {
      setMessages(m => [...m, { id: Date.now() + 2, from: 'bot', text: 'Unable to get response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-root">
      <div className="chat-card">
        <div className="chat-header">
          <h1 className="chat-title">Chat with DocAI</h1>
          <p className="chat-subtitle">Ask Any Question You Want</p>
        </div>
        <div className={`messages ${messages.length === 0 ? 'empty' : 'has-messages'}`} ref={listRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              Start a conversation by typing your message below...
            </div>
          ) : (
            messages.map(m => (
              <MessageItem key={m.id} message={m} />
            ))
          )}
          {loading && <div className="msg bot"><div className="msg-content">...</div></div>}
        </div>
        <form
          className="composer"
          onSubmit={e => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            className="composer-input"
            placeholder="Ask our chatbot anything you don't know..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <IconButton 
            className="composer-send" 
            type="submit"
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}
