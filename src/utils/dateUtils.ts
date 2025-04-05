
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getCurrentDate(): string {
  return formatDate(new Date());
}

export function hasPlayedToday(lastPlayed?: string): boolean {
  if (!lastPlayed) return false;
  return lastPlayed === getCurrentDate();
}

export function formatTimeLeft(targetDate: string): string {
  const now = new Date();
  const target = new Date(targetDate);
  target.setDate(target.getDate() + 1);
  target.setHours(0, 0, 0, 0);
  
  const diffMs = target.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Available now";
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
