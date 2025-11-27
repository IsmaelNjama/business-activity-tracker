/**
 * Accessibility utilities for the Business Activity Tracker
 * Provides helpers for ARIA labels, keyboard navigation, and screen reader support
 */

/**
 * Generate descriptive ARIA labels for activity types
 */
export function getActivityAriaLabel(type: string, summary: string): string {
  const typeLabels: Record<string, string> = {
    expense: 'Expense receipt',
    sales: 'Sales transaction',
    customer: 'Customer service record',
    production: 'Production activity',
    storage: 'Storage information'
  };

  return `${typeLabels[type] || 'Activity'}: ${summary}`;
}

/**
 * Generate ARIA labels for form fields with validation state
 */
export function getFieldAriaLabel(
  label: string,
  required: boolean = false,
  error?: string
): string {
  let ariaLabel = label;
  if (required) ariaLabel += ', required';
  if (error) ariaLabel += `, error: ${error}`;
  return ariaLabel;
}

/**
 * Generate ARIA live region announcements for dynamic content
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  return (
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.hasAttribute('hidden') &&
    element.style.display !== 'none' &&
    element.style.visibility !== 'hidden'
  );
}

/**
 * Generate descriptive text for loading states
 */
export function getLoadingAriaLabel(context: string): string {
  return `Loading ${context}, please wait`;
}

/**
 * Generate descriptive text for empty states
 */
export function getEmptyStateAriaLabel(context: string): string {
  return `No ${context} found`;
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End'
} as const;

/**
 * Handle keyboard activation (Enter or Space)
 */
export function isActivationKey(key: string): boolean {
  return key === KeyboardKeys.ENTER || key === KeyboardKeys.SPACE;
}

/**
 * Skip to main content helper
 */
export function skipToMainContent() {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    mainContent.removeAttribute('tabindex');
  }
}
