function initLoginPage() {
  const loginForm = document.querySelector('.login-form');

  if (!loginForm) {
    return;
  }

  const methodInputs = loginForm.querySelectorAll('input[name="authMethod"]');
  const loginInput = loginForm.querySelector('#login-input');
  const loginLabel = loginForm.querySelector('#login-label');
  const passwordInput = loginForm.querySelector('#login-password');
  const loginField = loginInput ? loginInput.closest('.login-field') : null;
  const passwordField = loginForm.querySelector('.login-field--password');
  const toggleButtons = loginForm.querySelectorAll('.password-visibility[data-toggle-target]');

  if (!methodInputs.length || !loginInput || !loginLabel || !passwordInput || !loginField || !passwordField) {
    return;
  }

  let emailValue = '';
  let phoneDigits = '';

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
    if (p2) {
      result += ` ${p2}`;
    }
    if (p3) {
      result += `-${p3}`;
    }
    if (p4) {
      result += `-${p4}`;
    }

    return result;
  };

  const setEmailMode = () => {
    loginLabel.textContent = 'Логин';
    loginInput.type = 'email';
    loginInput.name = 'login';
    loginInput.setAttribute('autocomplete', 'email');
    loginInput.setAttribute('inputmode', 'email');
    loginInput.placeholder = 'tuta@gmail.com';
    loginInput.value = emailValue;
  };

  const clearFieldError = (field) => {
    field.classList.remove('login-field--error');
    const errorNode = field.querySelector('.login-field__error');

    if (errorNode) {
      errorNode.remove();
    }
  };

  const showFieldError = (field, message) => {
    field.classList.add('login-field--error');

    let errorNode = field.querySelector('.login-field__error');
    if (!errorNode) {
      errorNode = document.createElement('p');
      errorNode.className = 'login-field__error';
      field.appendChild(errorNode);
    }

    errorNode.textContent = message;
  };

  const setPhoneMode = () => {
    loginLabel.textContent = 'Номер телефона';
    loginInput.type = 'tel';
    loginInput.name = 'phone';
    loginInput.setAttribute('autocomplete', 'tel-national');
    loginInput.setAttribute('inputmode', 'tel');
    loginInput.placeholder = '+375 (__) ___-__-__';
    loginInput.value = formatBelarusPhone(phoneDigits);
  };

  methodInputs.forEach((modeInput) => {
    modeInput.addEventListener('change', () => {
      if (modeInput.value === 'phone' && modeInput.checked) {
        emailValue = loginInput.value;
        setPhoneMode();
      }

      if (modeInput.value === 'email' && modeInput.checked) {
        setEmailMode();
      }
    });
  });

  loginInput.addEventListener('input', () => {
    clearFieldError(loginField);

    const selected = Array.from(methodInputs).find((input) => input.checked);
    const currentMode = selected ? selected.value : 'email';

    if (currentMode === 'phone') {
      phoneDigits = loginInput.value.replace(/\D/g, '').replace(/^375/, '').slice(0, 9);
      loginInput.value = formatBelarusPhone(phoneDigits);
      return;
    }

    emailValue = loginInput.value;
  });

  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordField);
  });

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-target');
      const targetInput = targetId ? loginForm.querySelector(`#${targetId}`) : null;

      if (!targetInput) {
        return;
      }

      const show = targetInput.type === 'password';
      targetInput.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    clearFieldError(loginField);
    clearFieldError(passwordField);

    const selected = Array.from(methodInputs).find((input) => input.checked);
    const currentMode = selected ? selected.value : 'email';

    if (currentMode === 'phone') {
      const digits = loginInput.value.replace(/\D/g, '').replace(/^375/, '').slice(0, 9);
      if (digits.length < 9) {
        showFieldError(loginField, 'Заполните поле');
      }
    } else if (!loginInput.value.trim()) {
      showFieldError(loginField, 'Заполните поле');
    }

    if (!passwordInput.value.trim()) {
      showFieldError(passwordField, 'Заполните поле');
    }
  });

  setEmailMode();
}
