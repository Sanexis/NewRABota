document.addEventListener('DOMContentLoaded', () => {
  if (typeof initRegisterStepOnePage === 'function') {
    initRegisterStepOnePage();
  }

  if (typeof initRegisterStepTwoPage === 'function') {
    initRegisterStepTwoPage();
  }

  if (typeof initRegisterStepThreePage === 'function') {
    initRegisterStepThreePage();
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
