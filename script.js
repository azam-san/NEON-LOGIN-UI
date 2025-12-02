document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const toggle = document.querySelector('.show-pass');

  // autofocus email field for quicker entry (only when appropriate)
  try { if (email && document.activeElement.tagName !== 'INPUT') email.focus(); } catch(e) {}

  // PASSWORD TOGGLE FUNCTIONALITY - Fixed
  if (toggle && password) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle password visibility
      const isCurrentlyPassword = password.type === 'password';
      password.type = isCurrentlyPassword ? 'text' : 'password';
      toggle.textContent = isCurrentlyPassword ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', String(!isCurrentlyPassword));
      
      console.log('Password visibility toggled to:', password.type);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.remove('shake');
      const em = email?.value.trim();
      const pw = password?.value.trim();
      
      // Validate email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
      const isValidEmail = emailRegex.test(em);
      const isValidUsername = usernameRegex.test(em);
      
      if (!em || !pw || (!isValidEmail && !isValidUsername)) {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 420);
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Signing...';
        submitBtn.disabled = true;
      }

      // Simulate auth delay
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Signed In';
        }
        // real app: perform actual authentication here
      }, 900);
    });
  }
  
  // Slide-to-submit interaction (if present)
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderHandle = document.getElementById('sliderHandle');
  const sliderProgress = document.getElementById('sliderProgress');

  if (sliderTrack && sliderHandle && sliderProgress && form) {
    let dragging = false;
    let rect = null;

    const resetSlider = () => {
      sliderProgress.style.width = '0';
      sliderHandle.style.left = '6px';
      sliderTrack.classList.remove('success');
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const left = Math.max(0, Math.min(rect.width - sliderHandle.offsetWidth - 12, clientX - rect.left - sliderHandle.offsetWidth / 2));
      const pct = left / (rect.width - sliderHandle.offsetWidth - 12);
      sliderProgress.style.width = `${pct * 100}%`;
      sliderHandle.style.left = `${6 + pct * (rect.width - sliderHandle.offsetWidth - 12)}px`;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      const handleLeft = parseFloat(sliderHandle.style.left || 6) - 6;
      const max = rect.width - sliderHandle.offsetWidth - 12;
      const pct = handleLeft / max;
      if (pct > 0.85) {
        // success
        sliderTrack.classList.add('success');
        sliderProgress.style.width = '100%';
        sliderHandle.style.left = `calc(100% - 46px)`;
        setTimeout(() => {
          // trigger form submit (will run existing submit handler)
          if (typeof form.requestSubmit === 'function') form.requestSubmit(); else form.submit();
        }, 200);
      } else {
        // reset
        resetSlider();
      }
      // remove dragging visual states
      sliderTrack.classList.remove('dragging');
      sliderHandle.classList.remove('dragging');
      const submitBtnEl2 = form.querySelector('button[type="submit"]');
      if (submitBtnEl2) submitBtnEl2.classList.remove('glow');
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', endDrag);
    };

    sliderHandle.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      rect = sliderTrack.getBoundingClientRect();
      dragging = true;
      // visual state while dragging
      sliderTrack.classList.add('dragging');
      sliderHandle.classList.add('dragging');
      const submitBtnEl = form.querySelector('button[type="submit"]');
      if (submitBtnEl) submitBtnEl.classList.add('glow');
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', endDrag);
    });

    // keyboard support: Enter / Space / ArrowRight triggers
    sliderHandle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        sliderTrack.classList.add('success');
        sliderProgress.style.width = '100%';
        sliderHandle.style.left = `calc(100% - 46px)`;
        // small visual cue for keyboard activation
        sliderHandle.classList.add('dragging');
        const submitBtnEl3 = form.querySelector('button[type="submit"]');
        if (submitBtnEl3) submitBtnEl3.classList.add('glow');
        setTimeout(() => {
          if (typeof form.requestSubmit === 'function') form.requestSubmit(); else form.submit();
        }, 150);
      }
    });
  }

  // Also add hover/press/focus glow for the regular Sign In button
  const signBtn = document.querySelector('.neon-btn');
  if (signBtn) {
    signBtn.addEventListener('pointerdown', () => signBtn.classList.add('glow'));
    signBtn.addEventListener('pointerup', () => signBtn.classList.remove('glow'));
    signBtn.addEventListener('pointerleave', () => signBtn.classList.remove('glow'));
    signBtn.addEventListener('focus', () => signBtn.classList.add('glow'));
    signBtn.addEventListener('blur', () => signBtn.classList.remove('glow'));
  }

});
