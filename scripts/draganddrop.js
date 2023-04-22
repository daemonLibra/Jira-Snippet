// Add the event listener
document.addEventListener('DOMContentLoaded', function () {
    addDragAndDropListeners();
  });

  function addDragAndDropListeners() {
    const placeholders = document.querySelectorAll('.token');
    const formatInput = document.getElementById('format');

    placeholders.forEach(function (placeholder) {
      placeholder.setAttribute('draggable', 'true');
      placeholder.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
      });
      placeholder.addEventListener('click', function (event) {
        const cursorPosition = formatInput.selectionStart;
        const token = event.target.textContent;
        formatInput.value = formatInput.value.slice(0, cursorPosition) + token + formatInput.value.slice(cursorPosition);
        formatInput.focus();
      });
    });

    formatInput.addEventListener('dragover', function (event) {
      event.preventDefault();
    });

    formatInput.addEventListener('drop', function (event) {
      event.preventDefault();
      const cursorPosition = formatInput.selectionStart;
      const token = event.dataTransfer.getData('text/plain');
      formatInput.value = formatInput.value.slice(0, cursorPosition) + token + formatInput.value.slice(cursorPosition);
      formatInput.focus();
    });
  }