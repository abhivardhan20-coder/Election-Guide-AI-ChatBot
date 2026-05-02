import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProfileToFirebase } from './auth.js';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn()
}));

vi.mock('../../firebase.js', () => ({
  db: {},
  // Added a mock UID to satisfy the updated syncProfileToFirebase logic which uses UIDs for document paths
  auth: { currentUser: { email: 'user@example.com', uid: 'mock-uid-12345' } },
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

    syncProfileToFirebase({}, localStorage);
    syncProfileToFirebase({}, localStorage);
    
    const { setDoc } = await import('firebase/firestore');
    expect(setDoc).not.toHaveBeenCalled();
    
    await vi.runAllTimersAsync();
    expect(setDoc).toHaveBeenCalledTimes(1);
  });
});
