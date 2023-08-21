document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (ev) {
    if (ev.target == document.getElementById('save')) {
      const format = document.getElementById('format').value;
      storageSet({ format: format }).then(function () {
        alert('Format saved successfully.');
      });
    }
  });

  storageGet('format').then(function (data) {
    if (data.format) {
      document.getElementById('format').value = data.format;
    }
  });
});