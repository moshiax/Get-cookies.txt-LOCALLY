import getAllCookies from './modules/get_all_cookies.mjs';

/**
 * Update icon badge counter on active page
 */
const updateBadgeCounter = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return;
  }
  const { id: tabId, url: urlString } = tab;
  if (!urlString) {
    chrome.action.setBadgeText({ tabId, text: '' });
    return;
  }
  const url = new URL(urlString);
  const cookies = await getAllCookies({ url: url.href, partitionKey: { topLevelSite: url.origin } });
  const text = cookies.length.toFixed();
  chrome.action.setBadgeText({ tabId, text });
};

chrome.cookies.onChanged.addListener(updateBadgeCounter);
chrome.tabs.onUpdated.addListener(updateBadgeCounter);
chrome.tabs.onActivated.addListener(updateBadgeCounter);
chrome.windows.onFocusChanged.addListener(updateBadgeCounter);