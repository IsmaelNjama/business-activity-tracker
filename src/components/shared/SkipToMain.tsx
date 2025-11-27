/**
 * Skip to Main Content Link
 * Provides keyboard users a way to skip navigation and go directly to main content
 * Improves accessibility for screen reader and keyboard-only users
 */
export function SkipToMain() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      // Remove tabindex after focus to prevent it from being in tab order
      setTimeout(() => {
        mainContent.removeAttribute('tabindex');
      }, 100);
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="skip-to-main"
    >
      Skip to main content
    </a>
  );
}
