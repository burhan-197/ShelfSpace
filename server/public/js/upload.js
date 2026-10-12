/* ============================================================
   ShelfSpace — upload.js
   Upload page interactions:
   - Show chosen file name + size inside each drop zone
   - Client-side size/type validation before submit
   - Submit button loading state + cancel navigation
   ============================================================ */

(function () {
  'use strict';

  const MAX_PDF_BYTES = 50 * 1024 * 1024;   // 50MB
  const MAX_COVER_BYTES = 5 * 1024 * 1024;  // 5MB

  const form = document.getElementById('upload-book-form');
  if (!form) return;

  const bookFileInput = document.getElementById('book-file');
  const coverInput = document.getElementById('book-cover');
  const submitBtn = document.getElementById('submit-upload-btn');
  const submitLabel = submitBtn ? submitBtn.querySelector('.btn__label') : null;
  const submitLoading = document.getElementById('submit-upload-loading');
  const cancelBtn = document.getElementById('cancel-upload-btn');
  const formError = document.getElementById('form-error-message');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
  }

  function setZoneState(input, { ok, file, message }) {
    const zone = input.closest('.upload-zone');
    const titleEl = zone ? zone.querySelector('.upload-zone__title') : null;
    const hintEl = zone ? zone.querySelector('.upload-zone__hint') : null;
    if (!zone || !titleEl) return;

    zone.classList.remove('is-selected', 'is-invalid');

    if (file) {
      zone.classList.add(ok ? 'is-selected' : 'is-invalid');
      titleEl.textContent = file.name;
      if (hintEl) {
        hintEl.innerHTML = ok
          ? '<strong>' + formatBytes(file.size) + '</strong> · ready to upload'
          : '<strong>Too large:</strong> ' + formatBytes(file.size) + ' — ' + message;
      }
    }
  }

  function setFieldError(inputId, message) {
    const errorEl = document.getElementById(inputId + '-error');
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateFile(input, { maxBytes, acceptLabel, required }) {
    const file = input.files && input.files[0];

    setFieldError(input.id, '');

    if (!file) {
      setZoneState(input, { ok: false, file: null });
      if (required) {
        setFieldError(input.id, 'Please choose a ' + acceptLabel + ' file.');
        return false;
      }
      return true;
    }

    if (file.size > maxBytes) {
      setZoneState(input, { ok: false, file, message: 'max ' + formatBytes(maxBytes) });
      setFieldError(input.id, 'File is too large. Maximum ' + formatBytes(maxBytes) + '.');
      return false;
    }

    setZoneState(input, { ok: true, file });
    return true;
  }

  bookFileInput.addEventListener('change', () =>
    validateFile(bookFileInput, { maxBytes: MAX_PDF_BYTES, acceptLabel: 'PDF', required: true })
  );

  coverInput.addEventListener('change', () =>
    validateFile(coverInput, { maxBytes: MAX_COVER_BYTES, acceptLabel: 'image', required: false })
  );

  form.addEventListener('submit', (event) => {
    const bookOk = validateFile(bookFileInput, { maxBytes: MAX_PDF_BYTES, acceptLabel: 'PDF', required: true });
    const coverOk = validateFile(coverInput, { maxBytes: MAX_COVER_BYTES, acceptLabel: 'image', required: false });

    if (!bookOk || !coverOk) {
      event.preventDefault();
      if (formError) {
        formError.textContent = 'Please fix the highlighted file issues before uploading.';
        formError.hidden = false;
      }
      return;
    }

    // Real submit — show the loading state so the user knows it's working.
    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.hidden = true;
    if (submitLoading) submitLoading.hidden = false;
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = '/';
    });
  }
})();
