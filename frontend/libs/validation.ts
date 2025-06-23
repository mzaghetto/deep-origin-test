export const isValidUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    // Checks if it has a valid TLD (at least one dot that is not at the start/end)
    const parts = url.hostname.split('.');
    return parts.length >= 2 && 
           parts.every(part => part.length > 0) &&
           /^https?:\/\//i.test(urlString);
  } catch {
    return false;
  }
};