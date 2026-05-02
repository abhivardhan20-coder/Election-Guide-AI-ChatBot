import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGeminiAPI } from './api.js';

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
    vi.clearAllMocks(); // Prevent mock history leakage between tests
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    };
  });

  it('should call backend API in guest mode', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Hello from AI', suggestedQuestions: [] })
    });

    const reply = await callGeminiAPI('Hi', [], {}, true);
    expect(reply.reply).toBe('Hello from AI');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('should call backend API in authenticated mode', async () => {
    const mockAuth = {
      currentUser: {
        getIdToken: vi.fn().mockResolvedValue('MOCK_TOKEN')
      }
    };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Auth AI Reply', suggestedQuestions: [] })
    });

    const reply = await callGeminiAPI('Hi', [], mockAuth, false);
    expect(reply.reply).toBe('Auth AI Reply');
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      headers: expect.objectContaining({ 'Authorization': 'Bearer MOCK_TOKEN' })
    }));
  });

  it('should throw an offline error on network failure', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(callGeminiAPI('Hi', [], {}, true)).rejects.toThrow('Network error: Please check your internet connection and try again.');
  });

  it('should throw error if currentUser is missing in authenticated mode', async () => {
    const mockAuth = {
      currentUser: null
    };
    
    await expect(callGeminiAPI('Hi', [], mockAuth, false)).rejects.toThrow("Unauthorized: session expired");
  });

  it('should throw error on API failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Too many requests' })
    });

    await expect(callGeminiAPI('Hi', [], {}, true)).rejects.toThrow('Too many requests');
  });
});
