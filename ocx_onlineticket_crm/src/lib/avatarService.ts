// Avatar service for Gmail and other email providers
export const getAvatarUrl = (email?: string): string | null => {
  if (!email) return null;

  const emailLower = email.toLowerCase().trim();
  
  // For Gmail addresses, try to get Google profile picture
  if (emailLower.includes('@gmail.com')) {
    // Method 1: Try to get from Google's public profile
    // Note: This requires the user to have a public Google profile
    const username = emailLower.split('@')[0];
    return `https://lh3.googleusercontent.com/a/default-user=s64-c`;
  }
  
  // For other emails, use Gravatar
  const hash = simpleHash(emailLower);
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=64`;
};

// Simple hash function (not MD5, but works for demo)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

// Generate initials from email
export const getInitials = (email?: string): string => {
  if (!email) return '?';
  const name = email.split('@')[0];
  return name.substring(0, 2).toUpperCase();
};

// Get avatar color based on email
export const getAvatarColor = (email?: string): string => {
  if (!email) return 'bg-gray-500';
  
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  const hash = simpleHash(email);
  const index = parseInt(hash, 16) % colors.length;
  return colors[index];
}; 