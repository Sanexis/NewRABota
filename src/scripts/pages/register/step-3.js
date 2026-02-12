function initRegisterStepThreePage() {
  const form = document.querySelector('#register-step-3-form');
  if (!form) return;

  const hasEquipmentInputs = form.querySelectorAll('input[name="hasEquipment"]');
  const equipmentFieldsBlock = form.querySelector('#equipment-fields');
  const noEquipmentFieldsBlock = form.querySelector('#no-equipment-fields');

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
    if (equipmentFieldsBlock) equipmentFieldsBlock.hidden = !hasEquipment;
    if (noEquipmentFieldsBlock) noEquipmentFieldsBlock.hidden = hasEquipment;
  };

  hasEquipmentInputs.forEach((input) => {
    input.addEventListener('change', toggleEquipmentBlocks);
  });

  toggleEquipmentBlocks();

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
    const completeUrl = new URL('../success.html', window.location.href);

    if (typeof window.navigateRegisterAjax === 'function') {
      window.navigateRegisterAjax(completeUrl.toString());
      return;
    }

    window.location.href = completeUrl.toString();
  });
}
