function initRegisterStepOnePage() {
  const form = document.querySelector('#register-step-1-form');
  if (!form) return;

  const emailInput = form.querySelector('#reg-email');
  const phoneInput = form.querySelector('#reg-phone');
  const passwordInput = form.querySelector('#reg-password');
  const repeatInput = form.querySelector('#reg-password-repeat');
  const consentCheckboxes = form.querySelectorAll('input[data-required-consent="true"]');
  const toggleButtons = form.querySelectorAll('.password-visibility[data-toggle-target]');

  const showFieldError = (field, message) => {
    field.classList.add('auth-field--error');
    let errorNode = field.querySelector('.auth-field__error');
    if (!errorNode) {
      errorNode = document.createElement('p');
      errorNode.className = 'auth-field__error';
      field.appendChild(errorNode);
    }
    errorNode.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove('auth-field--error');
    const errorNode = field.querySelector('.auth-field__error');
    if (errorNode) errorNode.remove();
  };

  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-target');
      const target = targetId ? form.querySelector(`#${targetId}`) : null;
      if (!target) return;
      const show = target.type === 'password';
      target.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  });

  form.querySelectorAll('.auth-field input').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.closest('.auth-field');
      if (field) clearFieldError(field);
    });
  });

  consentCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const wrap = checkbox.closest('.auth-check');
      if (wrap) wrap.classList.remove('auth-check--error');
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll('.auth-field').forEach((field) => clearFieldError(field));
    form.querySelectorAll('.auth-check').forEach((check) => check.classList.remove('auth-check--error'));

    [emailInput, phoneInput, passwordInput, repeatInput].forEach((input) => {
      if (!input || !input.value.trim()) {
        const field = input ? input.closest('.auth-field') : null;
        if (field) showFieldError(field, 'Заполните поле');
        valid = false;
      }
    });

    if (passwordInput && repeatInput && passwordInput.value && repeatInput.value && passwordInput.value !== repeatInput.value) {
      const repeatField = repeatInput.closest('.auth-field');
      if (repeatField) showFieldError(repeatField, 'Пароли не совпадают');
      valid = false;
    }

    consentCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        const wrap = checkbox.closest('.auth-check');
        if (wrap) wrap.classList.add('auth-check--error');
        valid = false;
      }
    });

    if (!valid) return;

    sessionStorage.setItem('register_email', emailInput.value.trim());
    await fakeAjax();
    const verificationUrl = new URL('./verification.html', window.location.href);
    verificationUrl.searchParams.set('email', emailInput.value.trim());

    if (typeof window.navigateRegisterAjax === 'function') {
      window.navigateRegisterAjax(verificationUrl.toString());
      return;
    }

    window.location.href = verificationUrl.toString();
  });
}
