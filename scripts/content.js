chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (document.getElementsByClassName('infinite-scroll-list').length != 0) {
        var playerHTML = document.getElementsByClassName('infinite-scroll-list')[0].rows;
        var playerArray = [];
        for (key in playerHTML) { playerArray.push(playerHTML[key].cells) };
        var playerArrayText = [];
        playerArray.forEach((playerData, index) => { 
                if (playerArray[index]) {
                    if (playerArray[index][2]) { 
                        if (playerArray[index][2].children[1].innerText.length < 2) {
                            playerArrayText.push([
                                playerArray[index][2].children[2].innerText,
                                playerArray[index][2].children[3].innerText
                            ]);
                        } else {
                            playerArrayText.push([
                                playerArray[index][2].children[1].innerText,
                                playerArray[index][2].children[2].innerText
                            ]);
                        }
                    }
                }
            });
        sendResponse({tableInfo: playerArrayText, success: true});
    }
});

