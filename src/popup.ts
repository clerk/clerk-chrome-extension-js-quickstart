import { createClerkClient } from '@clerk/chrome-extension/client';

const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

const EXTENSION_URL = chrome.runtime.getURL('.');
const POPUP_URL = `${EXTENSION_URL}popup.html`;

const clerk = createClerkClient({ publishableKey });

const contentEl = document.getElementById('content') as HTMLDivElement;
const navEl = document.getElementById('nav') as HTMLDivElement;


function render() {
  contentEl.innerHTML = '';
  navEl.innerHTML = '';

  if (clerk.user) {

    const info = document.createElement('div');
    const labelSpan = document.createElement('p');
    labelSpan.textContent = 'Session ID'
    const valueSpan = document.createElement('p');
    valueSpan.textContent = clerk.session?.id ?? ''
    info.appendChild(labelSpan);
    info.appendChild(valueSpan);
    contentEl.appendChild(info)

    const userBtnEl = document.createElement('div');
    navEl.appendChild(userBtnEl);
    clerk.mountUserButton(userBtnEl);

    const signOutBtn = document.createElement('button');
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.id = 'sign-out-btn';
    signOutBtn.addEventListener('click', () => {
      clerk.signOut({ redirectUrl: POPUP_URL });
    });
    navEl.appendChild(signOutBtn);
  } else {
    const signInBtn = document.createElement('button');
    signInBtn.textContent = 'Sign In';
    signInBtn.id = 'sign-in-btn';
    signInBtn.addEventListener('click', () => {
      clerk.openSignIn({});
    });
    navEl.appendChild(signInBtn);
  }
}

clerk
  .load({
    afterSignOutUrl: POPUP_URL,
    signInForceRedirectUrl: POPUP_URL,
    signUpForceRedirectUrl: POPUP_URL,
    allowedRedirectProtocols: ['chrome-extension:'],
  })
  .then(() => {
    clerk.addListener(render);
    render();
  });
