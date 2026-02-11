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
    field.classList.add('register-field--error');
    let errorNode = field.querySelector('.register-field__error');
    if (!errorNode) {
      errorNode = document.createElement('p');
      errorNode.className = 'register-field__error';
      field.appendChild(errorNode);
    }
    errorNode.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove('register-field--error');
    const errorNode = field.querySelector('.register-field__error');
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

  form.querySelectorAll('.register-field input').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.closest('.register-field');
      if (field) clearFieldError(field);
    });
  });

  consentCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const wrap = checkbox.closest('.register-check');
      if (wrap) wrap.classList.remove('register-check--error');
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll('.register-field').forEach((field) => clearFieldError(field));
    form.querySelectorAll('.register-check').forEach((check) => check.classList.remove('register-check--error'));

    [emailInput, phoneInput, passwordInput, repeatInput].forEach((input) => {
      if (!input || !input.value.trim()) {
        const field = input ? input.closest('.register-field') : null;
        if (field) showFieldError(field, 'Заполните поле');
        valid = false;
      }
    });

    if (passwordInput && repeatInput && passwordInput.value && repeatInput.value && passwordInput.value !== repeatInput.value) {
      const repeatField = repeatInput.closest('.register-field');
      if (repeatField) showFieldError(repeatField, 'Пароли не совпадают');
      valid = false;
    }

    consentCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        const wrap = checkbox.closest('.register-check');
        if (wrap) wrap.classList.add('register-check--error');
        valid = false;
      }
    });

    if (!valid) return;

    sessionStorage.setItem('register_email', emailInput.value.trim());
    await fakeAjax();
    window.location.href = './step-2.html';
  });
}
