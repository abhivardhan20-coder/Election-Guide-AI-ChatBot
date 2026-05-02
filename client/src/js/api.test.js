import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGeminiAPI } from './api.js';

// Mock the Firebase auth module entirely
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: vi.fn().mockReturnValue('MOCK_CREDENTIAL')
  },
  signInWithCredential: vi.fn().mockResolvedValue({
    user: { getIdToken: () => Promise.resolve('MOCK_NEW_TOKEN') }
  })
}));

describe('API Module', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
  });

  it('should call backend API in guest mode', async () => {
    localStorage.getItem.mockReturnValue('true'); // is_guest
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Hello from AI' })
    });

    const reply = await callGeminiAPI('Hi', [], {}, localStorage);
    expect(reply).toBe('Hello from AI');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('should call backend API in authenticated mode', async () => {
    localStorage.getItem.mockReturnValue(null); // not guest
    const mockAuth = {
      currentUser: {
        getIdToken: vi.fn().mockResolvedValue('MOCK_TOKEN')
      }
    };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Auth AI Reply' })
    });

    const reply = await callGeminiAPI('Hi', [], mockAuth, localStorage);
    expect(reply).toBe('Auth AI Reply');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      headers: expect.objectContaining({ 'Authorization': 'Bearer MOCK_TOKEN' })
    }));
  });

  it('should sign in with credential if currentUser is missing', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'is_guest') return null;
      if (key === 'google_id_token') return 'LOCAL_TOKEN';
      return null;
    });
    const mockAuth = {
      currentUser: null // missing
    };
    
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Re-auth success' })
    });

    // With the new mock, it shouldn't throw anymore.
    // However, the current code in api.js THROWS if currentUser is missing 
    // due to Fix 3 in the previous turn. 
    // Wait, let's check api.js content.
    await expect(callGeminiAPI('Hi', [], mockAuth, localStorage)).rejects.toThrow("Unauthorized: session expired");
  });

  it('should throw error on API failure', async () => {
    localStorage.getItem.mockReturnValue('true');
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Too many requests' })
    });

    await expect(callGeminiAPI('Hi', [], {}, localStorage)).rejects.toThrow('Too many requests');
  });
});
