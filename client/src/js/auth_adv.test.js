import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProfileToFirebase, signOut, initStorage } from './auth.js';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue({})
}));

describe('Auth Module Advanced', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    global.window = { location: { href: '' } };
    document.body.innerHTML = `
      <input id="userAge" value="20">
      <input id="userLocation" value="Delhi">
      <input id="userStatus" value="Registered">
    `;
  });

  it('should debounce syncProfileToFirebase', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'is_guest') return null;
      if (key === 'google_user_email') return 'user@example.com';
      return null;
    });

    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    await vi.runAllTimersAsync();
    expect(setDoc).toHaveBeenCalledTimes(1);
  });
});
