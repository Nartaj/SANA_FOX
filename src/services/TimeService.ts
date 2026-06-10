/**
 * Service for time-related calculations and formatting
 */
export const TimeService = {
  /**
   * Gets current date key in YYYY-MM-DD format
   */
  getDateKey: (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Gets yesterday's date key in YYYY-MM-DD format
   */
  getYesterdayDateKey: (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return TimeService.getDateKey(yesterday);
  },

  /**
   * Formats milliseconds into HH:MM:SS
   */
  formatCountdown: (ms: number): string => {
    if (ms <= 0) return "00:00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  },

  /**
   * Checks if a date key is older than yesterday
   */
  isOlderThanYesterday: (dateKey: string): boolean => {
    const date = new Date(dateKey);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    return date.getTime() < yesterday.getTime();
  }
};
