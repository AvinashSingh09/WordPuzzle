// API utility for saving & managing game results in MongoDB backend

const API_BASE = '/api';

export async function saveGameResult(data) {
  try {
    const response = await fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('API error saving result to MongoDB:', error.message);
    return { success: false, error: error.message };
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_BASE}/results`);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('API error fetching leaderboard:', error.message);
    return { success: false, data: [] };
  }
}

export async function deleteResult(id) {
  try {
    const response = await fetch(`${API_BASE}/results/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API error deleting result:', error.message);
    return { success: false, error: error.message };
  }
}

export async function clearAllResults() {
  try {
    const response = await fetch(`${API_BASE}/results`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API error clearing results:', error.message);
    return { success: false, error: error.message };
  }
}
