const MAX_HISTORY = 20;

export async function callGeminiAPI(text, historyLog, auth, isGuest) {
  let idToken = 'GUEST_TOKEN';

  if (!isGuest) {
    if (!auth.currentUser) {
      throw new Error("Unauthorized: session expired. Please sign in again.");
    }
    idToken = await auth.currentUser.getIdToken();
  }

  // Trim history to prevent unbounded growth
  const trimmedHistory = historyLog.slice(-MAX_HISTORY);
  
  // Gemini strictly requires the history array to start with a user message.
  // If slicing starts with an AI response, the API will reject it with a 400 error.
  if (trimmedHistory.length > 0 && trimmedHistory[0].role === 'ai') {
    trimmedHistory.shift();
  }
  
  // Format history for Gemini
  const contents = trimmedHistory.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text }]
  });

  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ contents })
    });
  } catch (networkError) {
    throw new Error("Network error: Please check your internet connection and try again.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch AI response');
  }

  // Locally log history
  historyLog.push({ role: 'user', content: text });
  historyLog.push({ role: 'ai', content: data.reply });

  // Enforce memory limit on the client side
  while (historyLog.length > MAX_HISTORY) {
    historyLog.shift();
  }

  return data;
}
