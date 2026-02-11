function initSuccessPage() {
  const successTitle = document.querySelector('#success-title');
  const successDescription = document.querySelector('#success-description');
  const successAction = document.querySelector('#success-action');
  const successBack = document.querySelector('#success-back');

  if (!successTitle || !successDescription || !successAction || !successBack) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const description = params.get('description');
  const actionText = params.get('actionText');
  const actionHref = params.get('actionHref');
  const backHref = params.get('backHref');

  if (title) {
    successTitle.textContent = title;
  }

  if (description) {
    successDescription.textContent = description;
  }

  if (actionText) {
    successAction.textContent = actionText;
  }

  if (actionHref) {
    successAction.setAttribute('href', actionHref);
  }

  if (backHref) {
    successBack.setAttribute('href', backHref);
  }
}
