function initRegisterPage() {
  const registerRoot = document.querySelector('#register-step-root');

  if (!registerRoot) {
    return;
  }

  const stepButtons = document.querySelectorAll('.register-step[data-step]');
  const stepPanels = registerRoot.querySelectorAll('.register-step-panel[data-step-panel]');
  const actionButtons = registerRoot.querySelectorAll('[data-next-step], [data-prev-step]');
  const toggleButtons = registerRoot.querySelectorAll('.password-visibility[data-toggle-target]');
  const stepOnePanel = registerRoot.querySelector('[data-step-panel="1"]');
  const stepTwoPanel = registerRoot.querySelector('[data-step-panel="2"]');
  const stepThreePanel = registerRoot.querySelector('[data-step-panel="3"]');
  let currentStep = 1;

  const fakeAjaxStepTransition = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
  };

  const clearStepOneErrors = () => {
    if (!stepOnePanel) {
      return;
    }

    stepOnePanel.querySelectorAll('.register-field--error').forEach((field) => {
      field.classList.remove('register-field--error');
      const errorNode = field.querySelector('.register-field__error');
      if (errorNode) {
        errorNode.remove();
      }
    });

    stepOnePanel.querySelectorAll('.register-check--error').forEach((check) => {
      check.classList.remove('register-check--error');
    });
  };

  const clearStepTwoErrors = () => {
    if (!stepTwoPanel) {
      return;
    }

    stepTwoPanel.querySelectorAll('.register-field--error').forEach((field) => {
      field.classList.remove('register-field--error');
      const errorNode = field.querySelector('.register-field__error');
      if (errorNode) {
        errorNode.remove();
      }
    });
  };

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

  const validateStepOne = () => {
    if (!stepOnePanel) {
      return true;
    }

    clearStepOneErrors();

    let isValid = true;
    const fields = stepOnePanel.querySelectorAll('.register-field input');
    const consentCheckboxes = stepOnePanel.querySelectorAll('input[data-required-consent="true"]');
    const loginTypeRadios = stepOnePanel.querySelectorAll('input[name="registerLoginType"]');

    fields.forEach((input) => {
      if (!input.value.trim()) {
        const field = input.closest('.register-field');
        if (field) {
          showFieldError(field, 'Заполните поле');
        }
        isValid = false;
      }
    });

    const passwordInput = stepOnePanel.querySelector('#register-password');
    const repeatPasswordInput = stepOnePanel.querySelector('#register-password-repeat');
    if (passwordInput && repeatPasswordInput && passwordInput.value && repeatPasswordInput.value) {
      if (passwordInput.value !== repeatPasswordInput.value) {
        const repeatField = repeatPasswordInput.closest('.register-field');
        if (repeatField) {
          showFieldError(repeatField, 'Пароли не совпадают');
        }
        isValid = false;
      }
    }

    if (!Array.from(loginTypeRadios).some((radio) => radio.checked)) {
      isValid = false;
      const firstLoginType = stepOnePanel.querySelector('.register-check--top');
      if (firstLoginType) {
        firstLoginType.classList.add('register-check--error');
      }
    }

    consentCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        const check = checkbox.closest('.register-check');
        if (check) {
          check.classList.add('register-check--error');
        }
        isValid = false;
      }
    });

    return isValid;
  };

  const validateStepTwo = () => {
    if (!stepTwoPanel) {
      return true;
    }

    clearStepTwoErrors();

    let isValid = true;
    const fields = stepTwoPanel.querySelectorAll('.register-field input');

    fields.forEach((input) => {
      if (!input.value.trim()) {
        const field = input.closest('.register-field');
        if (field) {
          showFieldError(field, 'Заполните поле');
        }
        isValid = false;
      }
    });

    return isValid;
  };

  const clearStepThreeErrors = () => {
    if (!stepThreePanel) {
      return;
    }

    stepThreePanel.querySelectorAll('.register-field--error').forEach((field) => {
      field.classList.remove('register-field--error');
      const errorNode = field.querySelector('.register-field__error');
      if (errorNode) {
        errorNode.remove();
      }
    });
  };

  const validateStepThree = () => {
    if (!stepThreePanel) {
      return true;
    }

    clearStepThreeErrors();

    let isValid = true;
    const fields = stepThreePanel.querySelectorAll('.register-field input');

    fields.forEach((input) => {
      if (!input.value.trim()) {
        const field = input.closest('.register-field');
        if (field) {
          showFieldError(field, 'Заполните поле');
        }
        isValid = false;
      }
    });

    return isValid;
  };

  if (stepOnePanel) {
    stepOnePanel.querySelectorAll('.register-field input').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.closest('.register-field');
        if (!field) {
          return;
        }

        field.classList.remove('register-field--error');
        const errorNode = field.querySelector('.register-field__error');
        if (errorNode) {
          errorNode.remove();
        }
      });
    });

    stepOnePanel.querySelectorAll('.register-check input').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const check = checkbox.closest('.register-check');
        if (check) {
          check.classList.remove('register-check--error');
        }

        const firstLoginType = stepOnePanel.querySelector('.register-check--top');
        if (firstLoginType) {
          firstLoginType.classList.remove('register-check--error');
        }
      });
    });
  }

  if (stepTwoPanel) {
    stepTwoPanel.querySelectorAll('.register-field input').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.closest('.register-field');
        if (!field) {
          return;
        }

        field.classList.remove('register-field--error');
        const errorNode = field.querySelector('.register-field__error');
        if (errorNode) {
          errorNode.remove();
        }
      });
    });
  }

  if (stepThreePanel) {
    stepThreePanel.querySelectorAll('.register-field input').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.closest('.register-field');
        if (!field) {
          return;
        }

        field.classList.remove('register-field--error');
        const errorNode = field.querySelector('.register-field__error');
        if (errorNode) {
          errorNode.remove();
        }
      });
    });
  }

  const goToStepWithValidation = async (targetStep, triggerButton) => {
    if (targetStep > currentStep + 1) {
      return;
    }

    if (targetStep >= 2 && currentStep === 1) {
      if (!validateStepOne()) {
        return;
      }

      const originalText = triggerButton ? triggerButton.textContent : '';
      if (triggerButton) {
        triggerButton.disabled = true;
        triggerButton.textContent = 'Загрузка...';
      }

      await fakeAjaxStepTransition();

      if (triggerButton) {
        triggerButton.disabled = false;
        triggerButton.textContent = originalText;
      }
    }

    if (targetStep >= 3 && currentStep === 2) {
      if (!validateStepTwo()) {
        return;
      }

      const originalText = triggerButton ? triggerButton.textContent : '';
      if (triggerButton) {
        triggerButton.disabled = true;
        triggerButton.textContent = 'Загрузка...';
      }

      await fakeAjaxStepTransition();

      if (triggerButton) {
        triggerButton.disabled = false;
        triggerButton.textContent = originalText;
      }
    }

    setStep(targetStep);
  };

  const setStep = (step) => {
    currentStep = step;

    stepButtons.forEach((button) => {
      const buttonStep = Number(button.getAttribute('data-step'));
      button.classList.toggle('is-active', buttonStep === step);
      button.classList.toggle('is-completed', buttonStep < step);
    });

    stepPanels.forEach((panel) => {
      const panelStep = Number(panel.getAttribute('data-step-panel'));
      panel.hidden = panelStep !== step;
    });
  };

  stepButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const rawStep = button.getAttribute('data-step');
      const targetStep = rawStep === null ? NaN : Number(rawStep);

      if (!Number.isNaN(targetStep) && targetStep > 0) {
        await goToStepWithValidation(targetStep, button);
      }
    });
  });

  actionButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const rawNextStep = button.getAttribute('data-next-step');
      const rawPrevStep = button.getAttribute('data-prev-step');
      const nextStep = rawNextStep === null ? NaN : Number(rawNextStep);
      const prevStep = rawPrevStep === null ? NaN : Number(rawPrevStep);

      if (!Number.isNaN(nextStep) && nextStep > 0) {
        await goToStepWithValidation(nextStep, button);
      }

      if (!Number.isNaN(prevStep) && prevStep > 0) {
        setStep(prevStep);
      }
    });
  });

  const stepOneNextButton = stepOnePanel ? stepOnePanel.querySelector('[data-next-step="2"]') : null;
  if (stepOneNextButton) {
    stepOneNextButton.addEventListener('click', async (event) => {
      event.preventDefault();
      await goToStepWithValidation(2, stepOneNextButton);
    });
  }

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-target');
      const targetInput = targetId ? registerRoot.querySelector(`#${targetId}`) : null;

      if (!targetInput) {
        return;
      }

      const show = targetInput.type === 'password';
      targetInput.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  });

  registerRoot.addEventListener('submit', (event) => {
    event.preventDefault();

    if (currentStep === 3) {
      if (!validateStepThree()) {
        return;
      }

      const emailInput = stepOnePanel ? stepOnePanel.querySelector('input[type="email"]') : null;
      const verificationUrl = new URL('./verification.html', window.location.href);

      if (emailInput && emailInput.value.trim()) {
        verificationUrl.searchParams.set('email', emailInput.value.trim());
      }

      window.location.href = verificationUrl.toString();
    }
  });

  setStep(currentStep);
}
