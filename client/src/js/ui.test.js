import { describe, it, expect, beforeEach } from 'vitest';
import { translateUI } from './ui.js';

describe('UI Translation', () => {
  let mockStrings;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="ui-subtitle"></div>
      <input id="userInput" placeholder="">
    `;
    mockStrings = {
      en: { subtitle: "English Subtitle", inputPlaceholder: "English Input" },
      hi: { subtitle: "Hindi Subtitle", inputPlaceholder: "Hindi Input" }
    };
  });

  it('should translate to English by default', () => {
    translateUI('en', mockStrings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('English Subtitle');
    expect(document.getElementById('userInput').placeholder).toBe('English Input');
  });

  it('should translate to Hindi', () => {
    translateUI('hi', mockStrings);
    expect(document.getElementById('ui-subtitle').textContent).toBe('Hindi Subtitle');
    expect(document.getElementById('userInput').placeholder).toBe('Hindi Input');
  });
});
