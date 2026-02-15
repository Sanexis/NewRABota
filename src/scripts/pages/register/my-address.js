function initRegisterMyAddressPage() {
  const form = document.querySelector('#register-my-address-form');
  const output = document.querySelector('#register-delivery-address');
  if (!form || !output) return;

  const savedData = typeof window.getRegisterFormData === 'function' ? window.getRegisterFormData() : {};
  const partsFromFormData = [savedData.postCode, savedData.region, savedData.district, savedData.city, savedData.fullAddress]
    .filter(Boolean);

  if (partsFromFormData.length) {
    output.textContent = partsFromFormData.join(', ');
  } else {
    output.textContent = 'Адрес не найден. Вернитесь на шаг 2 и заполните адрес.';
  }

  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fakeAjax();

    if (typeof window.completeRegisterFlow === 'function') {
      window.completeRegisterFlow({
        registrationResult: 'completed_with_post_delivery',
        deliveryMethod: 'my-address'
      });
      return;
    }
  });
}
