// utils/date-helpers.ts

/**
 * Adjusts a date to ensure consistent handling across timezones
 * Prevents the common issue of dates shifting when sent to the server
 */
export function adjustDateForTimezone(date: Date | string | number): Date {
    if (!date) return new Date();
    
    // Convert to Date object if string or number
    const inputDate = date instanceof Date ? date : new Date(date);
    
    // Get the local timezone offset in minutes
    const timezoneOffset = inputDate.getTimezoneOffset();
    
    // Create a new date by adding the timezone offset (which is negative for positive timezone)
    // This ensures we're working with the correct day regardless of server timezone
    const adjustedDate = new Date(inputDate);
    
    // If date is being shifted backward (common issue), add a day to compensate
    if (timezoneOffset > 0) {
      adjustedDate.setDate(inputDate.getDate() + 1);
    }
    
    return adjustedDate;
  }
  
  /**
   * Formats a date for display based on user's locale
   */
  export function formatDisplayDate(date: Date | string | number, locale = 'en-US'): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  }
  
  /**
   * Formats a date with time for display based on user's locale
   */
  export function formatDisplayDateTime(date: Date | string | number, locale = 'en-US'): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  }
  
  /**
   * Formats a date as an ISO string (YYYY-MM-DD) without time component
   * Useful for date inputs and API requests
   */
  export function formatISODate(date: Date | string | number): string {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Creates a UTC date to ensure consistent date handling for storage
   * This sets the time to noon UTC to avoid date boundary issues
   */
  export function createUTCDate(year: number, month: number, day: number): Date {
    // Month is 0-indexed in JavaScript Date
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  }
  
  /**
   * Safely parses a date string into a Date object,
   * handling browser inconsistencies
   */
  export function parseDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    // Handle different date formats
    if (dateString.includes('T')) {
      // ISO format with time
      return new Date(dateString);
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number);
      return createUTCDate(year, month, day);
    } else if (dateString.includes('/')) {
      // MM/DD/YYYY format (common in US)
      const [month, day, year] = dateString.split('/').map(Number);
      return createUTCDate(year, month, day);
    }
    
    // Fallback to standard parsing
    return new Date(dateString);
  }
  
  /**
   * Sets time component of a date to noon to prevent timezone issues
   */
  export function setToNoon(date: Date): Date {
    const result = new Date(date);
    result.setHours(12, 0, 0, 0);
    return result;
  }
  
  /**
   * Specifically for your booking form - ensures the correct date is sent
   * to the server regardless of timezone
   */
  export function prepareBookingDate(formDate: Date): Date {
    // Get user's local representation of the date
    const year = formDate.getFullYear();
    const month = formDate.getMonth();
    const day = formDate.getDate();
    
    // Create date with noon time to avoid timezone boundary issues
    const adjustedDate = new Date(year, month, day, 12, 0, 0);
    
    return adjustedDate;
  }