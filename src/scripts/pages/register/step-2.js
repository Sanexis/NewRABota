function initRegisterStepTwoPage() {
  const form = document.querySelector('#register-step-2-form');
  if (!form) return;

  const birthDateInput = form.querySelector('#reg-birth-date');
  const fullNameInput = form.querySelector('#reg-full-name');
  const idNumberInput = form.querySelector('#reg-id-number');
  const regionInput = form.querySelector('#reg-region');
  const districtInput = form.querySelector('#reg-district');
  const cityInput = form.querySelector('#reg-city');
  const postCodeInput = form.querySelector('#reg-postcode');
  const fullAddressInput = form.querySelector('#reg-full-address');
  const profileData = typeof window.getRegisterFormData === 'function' ? window.getRegisterFormData() : {};


  const ensureAirDatepickerAssets = async () => {
    if (typeof AirDatepicker === 'function') {
      return;
    }

    const cssHref = 'https://cdn.jsdelivr.net/npm/air-datepicker@3.5.3/air-datepicker.css';
    const jsSrc = 'https://cdn.jsdelivr.net/npm/air-datepicker@3.5.3/air-datepicker.js';

    if (!document.querySelector(`link[rel="stylesheet"][href="${cssHref}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      document.head.appendChild(link);
    }

    if (!document.querySelector(`script[src="${jsSrc}"]`)) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = jsSrc;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
  };

  if (regionInput && profileData.region) regionInput.value = profileData.region;
  if (fullNameInput && profileData.fullName) fullNameInput.value = profileData.fullName;
  if (districtInput && profileData.district) districtInput.value = profileData.district;
  if (cityInput && profileData.city) cityInput.value = profileData.city;
  if (postCodeInput && profileData.postCode) postCodeInput.value = profileData.postCode;
  if (fullAddressInput && profileData.fullAddress) fullAddressInput.value = profileData.fullAddress;
  if (idNumberInput && profileData.idNumber) idNumberInput.value = profileData.idNumber;
  if (birthDateInput && profileData.birthDate) birthDateInput.value = profileData.birthDate;
  if (profileData.gender) {
    const genderInput = form.querySelector(`input[name="gender"][value="${profileData.gender}"]`);
    if (genderInput) genderInput.checked = true;
  }


  if (idNumberInput) {
    const sanitizeIdNumber = () => {
      idNumberInput.value = idNumberInput.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 14);
    };

    sanitizeIdNumber();
    idNumberInput.addEventListener('input', sanitizeIdNumber);
  }

  const idHintField = form.querySelector('.auth-field--icon-help');
  const idHintLabel = idHintField ? idHintField.querySelector('.auth-field__label-with-hint') : null;
  const idHintTrigger = idHintField ? idHintField.querySelector('.auth-field__hint-trigger') : null;
  const idHint = idHintField ? idHintField.querySelector('.auth-field__hint') : null;

  const positionIdHint = () => {
    if (!idHintLabel || !idHintTrigger || !idHint) {
      return;
    }

    const labelRect = idHintLabel.getBoundingClientRect();
    const triggerRect = idHintTrigger.getBoundingClientRect();
    const hintWidth = idHint.offsetWidth || 232;
    const triggerCenterInLabel = triggerRect.left - labelRect.left + triggerRect.width / 2;
    const hintLeft = triggerCenterInLabel - hintWidth / 2;
    const arrowLeft = hintWidth / 2 - 6;

    idHint.style.setProperty('--hint-left', `${Math.round(hintLeft)}px`);
    idHint.style.setProperty('--hint-arrow-left', `${Math.round(arrowLeft)}px`);
  };

  if (idHintTrigger) {
    idHintTrigger.addEventListener('mouseenter', positionIdHint);
    idHintTrigger.addEventListener('focus', positionIdHint);
    idHintTrigger.addEventListener('click', positionIdHint);
  }

  window.addEventListener('resize', positionIdHint);
  setTimeout(positionIdHint, 0);

  const initDatepicker = () => {
    if (!birthDateInput || typeof AirDatepicker !== 'function') {
      return;
    }

    const ruLocale = {
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      daysShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
      daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      today: 'Сегодня',
      clear: 'Очистить',
      dateFormat: 'dd.MM.yyyy',
      timeFormat: 'HH:mm',
      firstDay: 1
    };

    try {
      new AirDatepicker(birthDateInput, {
        locale: ruLocale,
        autoClose: true,
        maxDate: new Date(),
        dateFormat: 'dd.MM.yyyy',
        view: 'days',
        minView: 'days'
      });
    } catch (error) {
      birthDateInput.type = 'date';
    }
  };

  if (birthDateInput) {
    ensureAirDatepickerAssets()
      .then(() => {
        initDatepicker();
      })
      .catch(() => {
        birthDateInput.type = 'date';
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
    form.querySelectorAll('.auth-field input').forEach((input) => {
      if (!input.value.trim()) {
        const field = input.closest('.auth-field');
        if (field) showFieldError(field, 'Заполните поле');
        valid = false;
      }
    });

    if (!valid) return;

    if (typeof window.registerAjaxSaveDraft === 'function') {
      const selectedGender = form.querySelector('input[name="gender"]:checked');
      await window.registerAjaxSaveDraft({
        fullName: fullNameInput ? fullNameInput.value.trim() : '',
        gender: selectedGender ? selectedGender.value : '',
        idNumber: idNumberInput ? idNumberInput.value.trim() : '',
        birthDate: birthDateInput ? birthDateInput.value.trim() : '',
        region: regionInput ? regionInput.value.trim() : '',
        district: districtInput ? districtInput.value.trim() : '',
        city: cityInput ? cityInput.value.trim() : '',
        postCode: postCodeInput ? postCodeInput.value.trim() : '',
        fullAddress: fullAddressInput ? fullAddressInput.value.trim() : ''
      });
    }

    await fakeAjax();
    if (typeof window.navigateRegisterAjax === 'function') {
      window.navigateRegisterAjax('./step-3.html');
      return;
    }

    window.location.href = './step-3.html';
  });
}
