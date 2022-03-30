let nameReceived;

function waitForLocal(key) {
    return new Promise (resolve => {
        chrome.storage.local.get(key, function(result) {
            resolve(result.soundToggle);
        });
    });
}

function setLocalSound(key) {
    waitForLocal(key).then(result => {
        if (result) {
            chromeSet('soundToggle', false);
            document.getElementById('SoundSetting').innerText = 'Sound is OFF';
        } else {
            chromeSet('soundToggle', true);
            document.getElementById('SoundSetting').innerText = 'Sound is ON';
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('Settings');
    button.addEventListener('click', function () {
        if (!document.getElementById('input')) {
            var input = document.createElement("input");
            input.id = 'input';
            input.type = "text";
            container.appendChild(input);
            var okButton = document.createElement('button');
            okButton.addEventListener('click', () => {chromeSet("name", input.value)});
            okButton.innerText = 'OK';
            okButton.class="btn btn-primary";
            container.appendChild(okButton);
        }
    });
    var soundButton = document.getElementById('SoundSetting');
    soundButton.addEventListener('click', () => {
        setLocalSound('soundToggle');
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse(chromeGet('name'));
    if(message.command == 'soundOn' && chromeGet('soundToggle')) {
        playMario().play();
    }
});

function chromeSet (key, value) {
    chrome.storage.local.set({[key]: value}, function() {
    });
}

function chromeGet (key) {
    if (key == 'name') {
        chrome.storage.local.get(key, function(result) {
            nameReceived = result.name;
        });
        return nameReceived;
    }
}

function playMario() {
    var audio = new Audio('audio/drm64_mario3.wav');
    return audio;
}