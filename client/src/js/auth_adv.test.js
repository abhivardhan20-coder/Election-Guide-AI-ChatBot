import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProfileToFirebase } from './auth.js';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn()
}));

vi.mock('../../firebase.js', () => ({
  db: {},
  auth: { currentUser: { email: 'user@example.com' } },
  analytics: {}
}));

describe('Auth Module Advanced', () => {
  let localStorage;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
    
    // Mock DOM elements
    document.body.innerHTML = `
      <input id="userAge" value="30">
      <input id="userLocation" value="Berlin">
      <select id="userStatus"><option value="voted">voted</option></select>
    `;
    document.getElementById('userStatus').value = 'voted';
  });

  it('should debounce syncProfileToFirebase', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'is_guest') return null;
      return null;
    });

    // Removed mockAuth from call as per new signature
    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    await vi.runAllTimersAsync();
    expect(setDoc).toHaveBeenCalledTimes(1);
  });
});
