function initForgotPasswordPage() {
  const contentRoot = document.querySelector('#auth-content-root');

  if (!contentRoot) {
    return;
  }

  const requestTemplate = contentRoot.innerHTML;
  const state = {
    mode: 'email',
    emailValue: '',
    phoneDigits: ''
  };

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

  const fakeAjaxRequest = (payload) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, data: payload }), 500);
    });
  };

  const sentTemplate = `
<a class="auth-back" href="./forgot-password.html" aria-label="Вернуться назад">Назад</a>
<h1 class="auth-title">Сброс пароля</h1>
<p class="auth-subtitle">
  На вашу почту <strong class="recovery-sent-destination">{{destination}}</strong> отправлено письмо с ссылкой для сброса пароля
</p>

<button class="auth-submit" type="button">Отправить ссылку повторно</button>

<p class="auth-register">
  Нет аккаунта?
  <a href="#">Регистрация</a>
</p>`;

  const loadSentTemplate = (destination) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sentTemplate.replace(/\{\{destination\}\}/g, destination));
      }, 0);
    });
  };

  const getDestinationForMessage = (input) => {
    if (state.mode === 'phone') {
      return input.value || formatBelarusPhone(state.phoneDigits) || '+375';
    }

    return input.value || state.emailValue || input.placeholder || 'tuta@gmail.com';
  };

  const bindSentStep = () => {
    const backLink = contentRoot.querySelector('.auth-back');
    if (!backLink) {
      return;
    }

    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      contentRoot.innerHTML = requestTemplate;
      bindRequestStep();
    });
  };

  const bindRequestStep = () => {
    const recoveryForm = contentRoot.querySelector('.auth-form');
    const modeInputs = contentRoot.querySelectorAll('input[name="recovery"]');
    const authField = contentRoot.querySelector('.auth-field');
    const recoveryInput = contentRoot.querySelector('#recovery-input');
    const recoveryLabel = contentRoot.querySelector('#recovery-label');
    const submitButton = recoveryForm ? recoveryForm.querySelector('.auth-submit') : null;

    if (!recoveryForm || !modeInputs.length || !authField || !recoveryInput || !recoveryLabel) {
      return;
    }

    const clearFieldError = () => {
      authField.classList.remove('auth-field--error');
      const errorNode = authField.querySelector('.auth-field__error');
      if (errorNode) {
        errorNode.remove();
      }
    };

    const showFieldError = (message) => {
      authField.classList.add('auth-field--error');
      let errorNode = authField.querySelector('.auth-field__error');

      if (!errorNode) {
        errorNode = document.createElement('p');
        errorNode.className = 'auth-field__error';
        authField.appendChild(errorNode);
      }

      errorNode.textContent = message;
    };

    const setEmailMode = () => {
      state.mode = 'email';
      recoveryLabel.textContent = 'Логин';
      recoveryInput.type = 'email';
      recoveryInput.name = 'login';
      recoveryInput.setAttribute('autocomplete', 'email');
      recoveryInput.setAttribute('inputmode', 'email');
      recoveryInput.placeholder = 'tuta@gmail.com';
      recoveryInput.value = state.emailValue;
    };

    const setPhoneMode = () => {
      state.mode = 'phone';
      recoveryLabel.textContent = 'Номер телефона';
      recoveryInput.type = 'tel';
      recoveryInput.name = 'phone';
      recoveryInput.setAttribute('autocomplete', 'tel-national');
      recoveryInput.setAttribute('inputmode', 'tel');
      recoveryInput.placeholder = '+375 (__) ___-__-__';
      recoveryInput.value = formatBelarusPhone(state.phoneDigits);
    };

    modeInputs.forEach((modeInput) => {
      if (modeInput.value === state.mode) {
        modeInput.checked = true;
      }

      modeInput.addEventListener('change', () => {
        if (modeInput.value === 'phone' && modeInput.checked) {
          state.emailValue = recoveryInput.value;
          clearFieldError();
          setPhoneMode();
        }

        if (modeInput.value === 'email' && modeInput.checked) {
          clearFieldError();
          setEmailMode();
        }
      });
    });

    recoveryInput.addEventListener('input', () => {
      clearFieldError();

      if (state.mode === 'phone') {
        state.phoneDigits = recoveryInput.value.replace(/\D/g, '').replace(/^375/, '').slice(0, 9);
        recoveryInput.value = formatBelarusPhone(state.phoneDigits);
        return;
      }

      state.emailValue = recoveryInput.value;
    });

    recoveryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFieldError();

      if (state.mode === 'phone') {
        const currentPhoneDigits = recoveryInput.value.replace(/\D/g, '').replace(/^375/, '').slice(0, 9);
        state.phoneDigits = currentPhoneDigits;

        if (currentPhoneDigits.length < 9) {
          showFieldError('напишите нужую ошибку');
          return;
        }
      }

      if (state.mode === 'email' && !recoveryInput.value.trim()) {
        showFieldError('напишите нужую ошибку');
        return;
      }

      const destinationValue = getDestinationForMessage(recoveryInput).trim();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
      }

      await fakeAjaxRequest({ destination: destinationValue, mode: state.mode });

      try {
        const sentMarkup = await loadSentTemplate(destinationValue);
        contentRoot.innerHTML = sentMarkup;
        bindSentStep();
      } catch (error) {
        contentRoot.innerHTML = '<p class="auth-subtitle">Не удалось загрузить шаг подтверждения.</p>';
      }
    });

    if (state.mode === 'phone') {
      setPhoneMode();
    } else {
      setEmailMode();
    }
  };

  bindRequestStep();
}
