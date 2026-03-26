const getDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
};

chrome.alarms.create("trackTime", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "trackTime") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        const domain = getDomain(tabs[0].url);
        if (!domain) return;

        chrome.storage.local.get([domain], (result) => {
          const currentTime = result[domain] || 0;
          chrome.storage.local.set({ [domain]: currentTime + 1 });
        });
      }
    });
  }
});
