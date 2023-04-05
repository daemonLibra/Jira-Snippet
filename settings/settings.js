document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
      const format = document.getElementById('format').value;
      browser.storage.local.set({ format: format }).then(function () {
        alert('Format saved successfully.');
      });
    });
  
    browser.storage.local.get('format').then(function (data) {
      if (data.format) {
        document.getElementById('format').value = data.format;
      }
    });
  });