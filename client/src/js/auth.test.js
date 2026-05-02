import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signOut, initStorage } from './auth.js';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn().mockResolvedValue(),
  getAuth: vi.fn()
}));

vi.mock('../../firebase.js', () => ({
  auth: {}
}));

describe('Auth Module', () => {
  let localStorage;

  beforeEach(() => {
    localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    delete window.location;
    window.location = { href: '' };
  });

  it('should remove items on sign out', async () => {
    await signOut(localStorage);
    expect(localStorage.removeItem).toHaveBeenCalledWith('google_user_email');
    expect(localStorage.removeItem).toHaveBeenCalledWith('is_guest');
    expect(window.location.href).toBe('/');
  });

  it('should initialize storage values', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'google_user_name') return 'Test User';
      if (key === 'google_user_email') return 'test@example.com';
      return null;
    });
    const user = initStorage(localStorage);
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });
});
