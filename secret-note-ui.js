// Secret note UI cleanup: keep the password secret.
(function () {
  function removeHint() {
    const input = document.getElementById('passcode-input');
    if (input) {
      input.placeholder = 'Enter passcode';
      input.removeAttribute('title');
      input.setAttribute('aria-label', 'Secret passcode');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeHint, { once: true });
  } else {
    removeHint();
  }
})();
