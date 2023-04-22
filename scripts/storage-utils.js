function storageGet(key) {
    return new Promise((resolve, reject) => {
      try {
        const callback = (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        };
  
        if (typeof key === 'undefined') {
          chrome.storage.local.get(callback);
        } else {
          chrome.storage.local.get(key, callback);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  
  function storageSet(data) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }