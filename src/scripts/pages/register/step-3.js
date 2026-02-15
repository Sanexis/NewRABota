function initRegisterStepThreePage() {
  const form = document.querySelector('#register-step-3-form');
  if (!form) return;

  const hasEquipmentInputs = form.querySelectorAll('input[name="hasEquipment"]');
  const equipmentFieldsBlock = form.querySelector('#equipment-fields');
  const noEquipmentFieldsBlock = form.querySelector('#no-equipment-fields');
  const accessCardInput = form.querySelector('#access-card-number');
  const moduleSerialInput = form.querySelector('#module-serial-number');
  const hintTriggers = form.querySelectorAll('.auth-field__hint-trigger');
  const equipmentDataHint = form.querySelector('#equipment-data-hint');
  const submitButton = form.querySelector('button[type="submit"]');
  const deliveryInputs = form.querySelectorAll('input[name="deliveryMethod"]');
  const savedData = typeof window.getRegisterFormData === 'function' ? window.getRegisterFormData() : {};

  if (savedData.hasEquipment && hasEquipmentInputs.length) {
    hasEquipmentInputs.forEach((input) => {
      input.checked = input.value === savedData.hasEquipment;
    });
  }

  if (accessCardInput && savedData.accessCardNumber) {
    accessCardInput.value = savedData.accessCardNumber;
  }

  if (moduleSerialInput && savedData.moduleSerialNumber) {
    moduleSerialInput.value = savedData.moduleSerialNumber;
  }

  if (savedData.deliveryMethod && deliveryInputs.length) {
    deliveryInputs.forEach((input) => {
      input.checked = input.value === savedData.deliveryMethod;
    });
  }

  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));

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

  const getEquipmentMode = () => {
    const selected = Array.from(hasEquipmentInputs).find((input) => input.checked);
    return selected ? selected.value : 'yes';
  };

  const toggleEquipmentBlocks = () => {
    const hasEquipment = getEquipmentMode() === 'yes';
    if (equipmentFieldsBlock) {
      equipmentFieldsBlock.classList.toggle('is-hidden', !hasEquipment);
    }

    if (noEquipmentFieldsBlock) {
      noEquipmentFieldsBlock.classList.toggle('is-hidden', hasEquipment);
    }

    if (submitButton) {
      submitButton.textContent = hasEquipment ? 'Завершить регистрацию' : 'Продолжить';
    }

    if (!hasEquipment && equipmentDataHint) {
      equipmentDataHint.classList.add('is-hidden');
    }
  };

  const updateEquipmentHintVisibility = () => {
    if (!equipmentDataHint) {
      return;
    }

    const hasEquipment = getEquipmentMode() === 'yes';
    if (!hasEquipment) {
      equipmentDataHint.classList.add('is-hidden');
      return;
    }

    const hasText = Boolean(
      (accessCardInput && accessCardInput.value.trim()) ||
      (moduleSerialInput && moduleSerialInput.value.trim())
    );

    equipmentDataHint.classList.toggle('is-hidden', !hasText);
  };

  hasEquipmentInputs.forEach((input) => {
    input.addEventListener('change', toggleEquipmentBlocks);
  });

  toggleEquipmentBlocks();

  if (accessCardInput) {
    const applyCardMask = () => {
      const digits = accessCardInput.value.replace(/\D/g, '').slice(0, 16);
      const groups = digits.match(/.{1,4}/g) || [];
      accessCardInput.value = groups.join(' ');
    };

    applyCardMask();
    accessCardInput.addEventListener('input', () => {
      applyCardMask();
      updateEquipmentHintVisibility();
    });
  }

  if (moduleSerialInput) {
    moduleSerialInput.addEventListener('input', updateEquipmentHintVisibility);
  }

  hintTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const hintId = trigger.getAttribute('data-hint-target');
      const hintNode = hintId ? form.querySelector(`#${hintId}`) : null;
      if (!hintNode) return;

      const willShow = hintNode.classList.contains('is-hidden');
      form.querySelectorAll('.auth-alert-note').forEach((note) => {
        note.classList.add('is-hidden');
      });

      if (willShow) {
        hintNode.classList.remove('is-hidden');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.auth-field__hint-trigger')) {
      form.querySelectorAll('.auth-alert-note').forEach((note) => {
        note.classList.add('is-hidden');
      });
    }
  });

  updateEquipmentHintVisibility();

  form.querySelectorAll('.auth-field input').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.closest('.auth-field');
      if (field) clearFieldError(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll('.auth-field').forEach((field) => clearFieldError(field));

    if (getEquipmentMode() === 'yes') {
      const equipmentInputs = form.querySelectorAll('#equipment-fields .auth-field input');
      equipmentInputs.forEach((input) => {
        if (!input.value.trim()) {
          const field = input.closest('.auth-field');
          if (field) showFieldError(field, 'Заполните поле');
          valid = false;
        }
      });
    }

    if (!valid) return;

    await fakeAjax();
    const equipmentMode = getEquipmentMode();
    let nextUrl;

    const deliveryInput = form.querySelector('input[name="deliveryMethod"]:checked');
    const deliveryMethod = deliveryInput ? deliveryInput.value : 'dealer';

    if (typeof window.registerAjaxSaveDraft === 'function') {
      await window.registerAjaxSaveDraft({
        hasEquipment: equipmentMode,
        accessCardNumber: accessCardInput ? accessCardInput.value.trim() : '',
        moduleSerialNumber: moduleSerialInput ? moduleSerialInput.value.trim() : '',
        deliveryMethod
      });
    }

    if (equipmentMode === 'yes') {
      if (typeof window.completeRegisterFlow === 'function') {
        window.completeRegisterFlow({ registrationResult: 'completed_with_equipment' });
      }
      return;
    } else {
      nextUrl = deliveryMethod === 'dealer'
        ? new URL('./dealer.html', window.location.href)
        : new URL('./my-address.html', window.location.href);
    }

    if (typeof window.navigateRegisterAjax === 'function') {
      window.navigateRegisterAjax(nextUrl.toString());
      return;
    }

    window.location.href = nextUrl.toString();
  });
}
