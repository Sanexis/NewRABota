function initRegisterStepTwoPage() {
  const form = document.querySelector('#register-step-2-form');
  if (!form) return;

  const birthDateInput = form.querySelector('#reg-birth-date');

  if (birthDateInput && typeof AirDatepicker === 'function') {
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
  }

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
    window.location.href = './step-3.html';
  });
}
