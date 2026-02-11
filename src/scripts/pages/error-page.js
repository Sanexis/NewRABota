function initErrorPage() {
  const errorTitle = document.querySelector('#error-title');
  const errorDescription = document.querySelector('#error-description');
  const errorAction = document.querySelector('#error-action');

  if (!errorTitle || !errorDescription) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const description = params.get('description');
  const actionText = params.get('actionText');
  const actionHref = params.get('actionHref');

  if (title) {
    errorTitle.textContent = title;
  }

  if (description) {
    errorDescription.textContent = description;
  }

  if (errorAction && actionText) {
    errorAction.textContent = actionText;
    errorAction.hidden = false;
    errorAction.setAttribute('href', actionHref || '#');
  }
}
