document.addEventListener('DOMContentLoaded', () => {
  if (typeof initRegisterPage === 'function') {
    initRegisterPage();
  }

  if (typeof initVerificationPage === 'function') {
    initVerificationPage();
  }

  if (typeof initLoginPage === 'function') {
    initLoginPage();
  }

  if (typeof initForgotPasswordPage === 'function') {
    initForgotPasswordPage();
  }

  if (typeof initResetPasswordPage === 'function') {
    initResetPasswordPage();
  }

  if (typeof initErrorPage === 'function') {
    initErrorPage();
  }

  if (typeof initSuccessPage === 'function') {
    initSuccessPage();
  }
});
