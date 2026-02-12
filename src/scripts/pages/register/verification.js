function initVerificationPage() {
  const description = document.querySelector('#verification-description');
  const form = document.querySelector('.auth-form');
  const codeInput = document.querySelector('#verification-code');
  const submitButton = form ? form.querySelector('button[type="submit"]') : null;
  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));

  if (!description || !form || !codeInput || !submitButton) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');

  if (email) {
    description.textContent = `На Вашу почту ${email} отправлено письмо с кодом для подтверждения email. Введите полученный код в поле ниже и нажмите кнопку "Подтвердить".`;
  }

  const toggleSubmitState = () => {
    submitButton.disabled = !codeInput.value.trim();
  };

  toggleSubmitState();
  codeInput.addEventListener('input', toggleSubmitState);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (submitButton.disabled) {
      return;
    }

    fakeAjax().then(() => {
      if (typeof window.navigateRegisterAjax === 'function') {
        window.navigateRegisterAjax('./step-2.html');
        return;
      }

      window.location.href = './step-2.html';
    });
  });
}
