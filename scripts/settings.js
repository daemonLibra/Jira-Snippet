document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
      const format = document.getElementById('format').value;
      storageSet({ format: format }).then(function () {
        alert('Format saved successfully.');
      });
    });
  
    storageGet('format').then(function (data) {
      if (data.format) {
        document.getElementById('format').value = data.format;
      }
    });
  });