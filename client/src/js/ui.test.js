import { describe, it, expect, beforeEach, vi } from 'vitest';
import { translateUI, appendMessage, showTyping, hideTyping, autoResize, clearCache, appendChips } from './ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    clearCache();
    document.body.innerHTML = `
      <div id="ui-subtitle"></div>
      <div id="chat"></div>
      <div id="welcome-banner"></div>
      <textarea id="userInput"></textarea>
    `;
  });

  it('should translate UI', () => {
    const strings = { en: { subtitle: 'Test Subtitle', inputPlaceholder: 'Ask...' } };
    translateUI('en', strings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('Test Subtitle');
  });

  it('should append message and hide banner', () => {
    appendMessage('user', 'Hello');
    expect(document.getElementById('welcome-banner').style.display).toBe('none');
    expect(document.querySelector('.msg-row.user')).not.toBeNull();
  });

  it('should show and hide typing indicator', () => {
    showTyping();
    expect(document.getElementById('typing-indicator')).not.toBeNull();
    hideTyping();
    expect(document.getElementById('typing-indicator')).toBeNull();
  });

  it('should resize textarea', () => {
    const textarea = document.getElementById('userInput');
    textarea.style.height = '10px';
    autoResize(textarea);
    expect(textarea.style.height).not.toBe('10px');
  });

  it('should render context-aware chips', () => {
    appendChips(['How do I register?', 'Next step?'], false, vi.fn());
    const chips = document.querySelectorAll('.chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toBe('How do I register?');
    expect(chips[0].getAttribute('aria-label')).toBe('Ask: How do I register?');
  });
});
