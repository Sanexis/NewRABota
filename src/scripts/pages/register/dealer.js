function initRegisterDealerPage() {
  const form = document.querySelector('#register-dealer-form');
  if (!form) return;

  const dealerInputs = form.querySelectorAll('input[name="dealerId"]');
  const savedData = typeof window.getRegisterFormData === 'function' ? window.getRegisterFormData() : {};
  if (savedData.dealerId && dealerInputs.length) {
    dealerInputs.forEach((input) => {
      input.checked = String(input.value) === String(savedData.dealerId);
    });
  }

  const fakeAjax = () => new Promise((resolve) => setTimeout(resolve, 350));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fakeAjax();

    const selectedDealer = form.querySelector('input[name="dealerId"]:checked');
    if (typeof window.completeRegisterFlow === 'function') {
      window.completeRegisterFlow({
        registrationResult: 'completed_with_dealer_delivery',
        dealerId: selectedDealer ? selectedDealer.value : null,
        deliveryMethod: 'dealer'
      });
      return;
    }
  });
}
