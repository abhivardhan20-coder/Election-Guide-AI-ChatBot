import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signOut, initStorage } from './auth.js';

describe('Auth Module', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.window = { location: { href: '' } };
    document.body.innerHTML = `
      <input id="userAge">
      <input id="userLocation">
      <input id="userStatus">
    `;
  });

  it('should remove items on sign out', () => {
    signOut(localStorage);
    expect(localStorage.removeItem).toHaveBeenCalledWith('google_user_email');
    expect(window.location.href).toBe('/');
  });

  it('should initialize storage values', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user_age') return '25';
      return null;
    });
    initStorage(localStorage);
    expect(document.getElementById('userAge').value).toBe('25');
  });
});
