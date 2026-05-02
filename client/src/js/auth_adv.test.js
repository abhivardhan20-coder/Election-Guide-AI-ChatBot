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
    localStorage.getItem.mockReturnValue('user@example.com');
    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    // Should not have called setDoc yet due to debounce
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1100);
    expect(setDoc).toHaveBeenCalled();
  });
});
