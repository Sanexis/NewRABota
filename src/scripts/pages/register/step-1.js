function initRegisterStepOnePage() {
  const form = document.querySelector('#register-step-1-form');
  if (!form) return;

  const emailInput = form.querySelector('#reg-email');
  const phoneInput = form.querySelector('#reg-phone');
  const passwordInput = form.querySelector('#reg-password');
  const repeatInput = form.querySelector('#reg-password-repeat');
  const loginTypeInputs = form.querySelectorAll('input[name="registerLoginType"]');
  const consentCheckboxes = form.querySelectorAll('input[data-required-consent="true"]');
  const toggleButtons = form.querySelectorAll('.password-visibility[data-toggle-target]');

  const formatBelarusPhone = (digits) => {
    const d = digits.slice(0, 9);
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 5);
    const p3 = d.slice(5, 7);
    const p4 = d.slice(7, 9);

    let result = '+375';
    if (p1) {
      result += ` (${p1}`;
      if (p1.length === 2) {
        result += ')';
      }
    }
    if (p2) result += ` ${p2}`;
    if (p3) result += `-${p3}`;
    if (p4) result += `-${p4}`;
    return result;
  };

  const getPhoneDigits = () => (phoneInput ? phoneInput.value.replace(/\D/g, '').replace(/^375/, '').slice(0, 9) : '');

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatBelarusPhone(getPhoneDigits());
    });
  }

  const savedData = typeof window.getRegisterFormData === 'function' ? window.getRegisterFormData() : {};
  if (emailInput && savedData.email) emailInput.value = savedData.email;
  if (phoneInput && savedData.phone) phoneInput.value = savedData.phone;
  if (passwordInput && savedData.password) passwordInput.value = savedData.password;
  if (repeatInput && savedData.passwordRepeat) repeatInput.value = savedData.passwordRepeat;
  if (savedData.loginType && loginTypeInputs.length) {
    loginTypeInputs.forEach((input) => {
      input.checked = input.value === savedData.loginType;
    });
  }
  if (Array.isArray(savedData.consents) && savedData.consents.length) {
    consentCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = Boolean(savedData.consents[index]);
    });
  }

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

    const selectedLoginType = Array.from(loginTypeInputs).find((input) => input.checked);
    const loginType = selectedLoginType ? selectedLoginType.value : 'email';

    if (typeof window.registerAjaxSaveDraft === 'function') {
      await window.registerAjaxSaveDraft({
        email: emailInput ? emailInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        phoneDigits: getPhoneDigits(),
        password: passwordInput ? passwordInput.value : '',
        passwordRepeat: repeatInput ? repeatInput.value : '',
        loginType,
        consents: Array.from(consentCheckboxes).map((checkbox) => checkbox.checked)
      });
    }

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
