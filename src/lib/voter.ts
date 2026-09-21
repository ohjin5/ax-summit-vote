const VOTER_ID_KEY = 'axSummitVoterId';
const LEGACY_VOTER_ID_KEY = 'ax_summit_2026_voter_id';

export function getOrCreateVoterId(): string {
  try {
    let id = localStorage.getItem(VOTER_ID_KEY);
    if (!id || id.trim().length === 0) {
      // Check legacy key
      id = localStorage.getItem(LEGACY_VOTER_ID_KEY);
    }

    if (!id || id.trim().length === 0) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        id = crypto.randomUUID();
      } else {
        id = '550e8400-e29b-41d4-' + Math.random().toString(36).substring(2, 6) + '-' + Date.now().toString(16);
      }
      localStorage.setItem(VOTER_ID_KEY, id);
    } else {
      // Ensure stored under standard key
      localStorage.setItem(VOTER_ID_KEY, id);
    }
    return id;
  } catch {
    return '550e8400-e29b-41d4-a716-446655440000';
  }
}
