function initRegisterStepThreePage() {
  const form = document.querySelector('#register-step-3-form');
  if (!form) return;

  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));

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

  form.querySelectorAll('.register-field input').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.closest('.register-field');
      if (field) clearFieldError(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll('.register-field').forEach((field) => clearFieldError(field));
    form.querySelectorAll('.register-field input').forEach((input) => {
      if (!input.value.trim()) {
        const field = input.closest('.register-field');
        if (field) showFieldError(field, 'Заполните поле');
        valid = false;
      }
    });

    if (!valid) return;

    await fakeAjax();
    const verificationUrl = new URL('./verification.html', window.location.href);
    const email = sessionStorage.getItem('register_email');
    if (email) verificationUrl.searchParams.set('email', email);
    window.location.href = verificationUrl.toString();
  });
}
