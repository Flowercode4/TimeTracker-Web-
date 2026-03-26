document.addEventListener('DOMContentLoaded', async () => {
  const siteInput = document.getElementById('siteInput');
  const checkBtn = document.getElementById('checkBtn');
  const resultDiv = document.getElementById('result');

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname.replace('www.', '');
      siteInput.value = domain;
      showTime(domain);
    } catch (e) {}
  }

  function showTime(domain) {
    chrome.storage.local.get([domain], (data) => {
      const time = data[domain] || 0;
      resultDiv.textContent = formatTime(time);
    });
  }

  checkBtn.addEventListener('click', () => {
    const domain = siteInput.value.trim().replace('www.', '');
    if (domain) {
      showTime(domain);
    }
  });

  siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkBtn.click();
  });
});
