function initResetPasswordPage() {
  const resetForm = document.querySelector('.reset-form');
  const resetContentRoot = document.querySelector('#reset-content-root');
  if (!resetForm || !resetContentRoot) {
    return;
  }

  const passwordInput = resetForm.querySelector('#reset-password');
  const repeatPasswordInput = resetForm.querySelector('#reset-password-repeat');
  const toggleButtons = resetForm.querySelectorAll('.password-visibility[data-toggle-target]');

  if (!passwordInput || !repeatPasswordInput) {
    return;
  }

  const clearFieldError = (field) => {
    field.classList.remove('auth-field--error');
    const errorNode = field.querySelector('.auth-field__error');
    if (errorNode) {
      errorNode.remove();
    }
  };

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

  const fakeResetPasswordRequest = (payload) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, data: payload }), 500);
    });
  };

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-target');
      const targetInput = targetId ? resetForm.querySelector(`#${targetId}`) : null;

      if (!targetInput) {
        return;
      }

      const show = targetInput.type === 'password';
      targetInput.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  });

  [passwordInput, repeatPasswordInput].forEach((input) => {
    const field = input.closest('.auth-field');

    input.addEventListener('input', () => {
      if (field) {
        clearFieldError(field);
      }
    });
  });

  resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const passwordField = passwordInput.closest('.auth-field');
    const repeatField = repeatPasswordInput.closest('.auth-field');

    if (!passwordField || !repeatField) {
      return;
    }

    clearFieldError(passwordField);
    clearFieldError(repeatField);

    const password = passwordInput.value.trim();
    const repeatPassword = repeatPasswordInput.value.trim();

    if (!password || !repeatPassword) {
      if (!password) {
        showFieldError(passwordField, 'Введите пароль');
      }

      if (!repeatPassword) {
        showFieldError(repeatField, 'Повторите пароль');
      }

      return;
    }

    if (password !== repeatPassword) {
      showFieldError(repeatField, 'Пароли не совпадают');
      return;
    }

    await fakeResetPasswordRequest({ password });

    const successUrl = new URL('./success.html', window.location.href);
    successUrl.searchParams.set('title', 'Пароль успешно изменен');
    successUrl.searchParams.set('description', 'Войдите в учетную запись с новым паролем');
    successUrl.searchParams.set('actionText', 'Авторизация');
    successUrl.searchParams.set('actionHref', '#');
    successUrl.searchParams.set('backHref', './forgot-password.html');

    window.location.href = successUrl.toString();
  });
}
