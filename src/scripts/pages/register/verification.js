function initVerificationPage() {
  const description = document.querySelector('#verification-description');
  const form = document.querySelector('.verification-form');

  if (!description || !form) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');

  if (email) {
    description.textContent = `На Вашу почту ${email} отправлено письмо с кодом для подтверждения email. Введите полученный код в поле ниже и нажмите кнопку "Подтвердить".`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}
