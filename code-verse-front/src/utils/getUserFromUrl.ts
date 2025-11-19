export function getUserFromUrl(): Record<string, any> | null {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
  
    if (userParam) {
      try {
        return JSON.parse(decodeURIComponent(userParam));
      } catch (error) {
        console.error('Invalid user parameter:', error);
        return null;
      }
    }
    return null;
  }
  