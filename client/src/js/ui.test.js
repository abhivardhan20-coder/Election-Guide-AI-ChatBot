import { describe, it, expect, beforeEach, vi } from 'vitest';
import { translateUI, appendMessage, showTyping, hideTyping, autoResize, clearCache } from './ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    clearCache();
    document.body.innerHTML = `
      <div id="ui-subtitle"></div>
      <div id="chat"></div>
      <div id="welcome-banner"></div>
      <input id="userInput" placeholder="">
      <button id="sendBtn"></button>
    `;
  });

  it('should translate UI', () => {
    const mockStrings = { en: { subtitle: "Sub", inputPlaceholder: "Pl" } };
    translateUI('en', mockStrings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('Sub');
  });

  it('should append message and hide banner', () => {
    const banner = document.getElementById('welcome-banner');
    appendMessage('user', 'Hello');
    expect(banner.style.display).toBe('none');
    expect(document.getElementById('chat').innerHTML).toContain('Hello');
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
    const { appendChips } = require('./ui.js');
    appendChips(['How do I register?', 'Next step?'], false, vi.fn());
    const chips = document.querySelectorAll('.chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toBe('How do I register?');
    expect(chips[0].getAttribute('aria-label')).toBe('Ask: How do I register?');
  });
});
