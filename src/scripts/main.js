function initAllPages() {
  if (typeof initRegisterStepOnePage === 'function') {
    initRegisterStepOnePage();
  }

  if (typeof initRegisterStepTwoPage === 'function') {
    initRegisterStepTwoPage();
  }

  if (typeof initRegisterStepThreePage === 'function') {
    initRegisterStepThreePage();
  }

  if (typeof initRegisterDealerPage === 'function') {
    initRegisterDealerPage();
  }

  if (typeof initRegisterMyAddressPage === 'function') {
    initRegisterMyAddressPage();
  }

  if (typeof initVerificationPage === 'function') {
    initVerificationPage();
  }

  if (typeof initLoginPage === 'function') {
    initLoginPage();
  }

  if (typeof initForgotPasswordPage === 'function') {
    initForgotPasswordPage();
  }

  if (typeof initResetPasswordPage === 'function') {
    initResetPasswordPage();
  }

  if (typeof initErrorPage === 'function') {
    initErrorPage();
  }

  if (typeof initSuccessPage === 'function') {
    initSuccessPage();
  }

  if (typeof bindRegisterAjaxNavigation === 'function') {
    bindRegisterAjaxNavigation();
  }
}

function isRegisterStepPath(pathname) {
  return /\/register\/(step-[123]|verification|dealer|my-address)\.html$/i.test(pathname);
}

let registerAjaxNavigationBound = false;

function bindRegisterAjaxNavigation() {
  if (registerAjaxNavigationBound) {
    return;
  }

  const onLinkClick = (event) => {
    const link = event.target.closest('a[href]');
    if (!link) {
      return;
    }

    const targetUrl = new URL(link.getAttribute('href'), window.location.href);
    if (targetUrl.origin !== window.location.origin) {
      return;
    }

    const isCurrentRegisterFlow = /\/register\//i.test(window.location.pathname);
    if (!isCurrentRegisterFlow || !isRegisterStepPath(targetUrl.pathname)) {
      return;
    }

    event.preventDefault();
    navigateRegisterAjax(targetUrl.toString(), { pushState: false });
  };

  const onPopState = () => {
    if (isRegisterStepPath(window.location.pathname)) {
      navigateRegisterAjax(window.location.href, { pushState: false });
    }
  };

  document.addEventListener('click', onLinkClick);
  window.addEventListener('popstate', onPopState);
  registerAjaxNavigationBound = true;
}

async function navigateRegisterAjax(url, options = {}) {
  const pushState = options.pushState === true;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      window.location.href = url;
      return;
    }

    const html = await response.text();
    const parser = new DOMParser();
    const nextDocument = parser.parseFromString(html, 'text/html');
    const nextMain = nextDocument.querySelector('main');
    const currentMain = document.querySelector('main');

    if (!nextMain || !currentMain) {
      window.location.href = url;
      return;
    }

    currentMain.replaceWith(nextMain);
    document.title = nextDocument.title || document.title;

    if (pushState) {
      window.history.pushState({}, '', url);
    }

    initAllPages();
  } catch (error) {
    window.location.href = url;
  }
}

window.navigateRegisterAjax = navigateRegisterAjax;

let registerDraftData = {};

function getRegisterFormData() {
  return { ...registerDraftData };
}

function setRegisterFormData(data) {
  registerDraftData = { ...data };
}

function mergeRegisterFormData(partial) {
  const current = getRegisterFormData();
  const next = { ...current, ...partial };
  setRegisterFormData(next);
  return next;
}

function registerAjaxGetDraft() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getRegisterFormData()), 120);
  });
}

function registerAjaxSaveDraft(partial) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mergeRegisterFormData(partial)), 120);
  });
}

function completeRegisterFlow(extra = {}) {
  const payload = { ...getRegisterFormData(), ...extra };
  setRegisterFormData(payload);
  alert('вся информация в консоли');
  console.log('Register payload:', payload);
}

window.getRegisterFormData = getRegisterFormData;
window.mergeRegisterFormData = mergeRegisterFormData;
window.registerAjaxGetDraft = registerAjaxGetDraft;
window.registerAjaxSaveDraft = registerAjaxSaveDraft;
window.completeRegisterFlow = completeRegisterFlow;

document.addEventListener('DOMContentLoaded', () => {
  initAllPages();
});
