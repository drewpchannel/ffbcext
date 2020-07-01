chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    console.log(document.getElementById('ys-playerlist-panel'));
    sendResponse({tableInfo: document.getElementById('ys-playerlist-panel'), success: true});
});

