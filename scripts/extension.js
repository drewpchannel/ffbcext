document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('refreshplayers');
    button.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //possibly check for false and resend with message that content is loading
            chrome.tabs.sendMessage(tabs[0].id, {data:'empty'}, (responseFromSite) => {
                getCSVFile(responseFromSite.tableInfo);
            });
        });
    });
    createSettingsButton();
});

function createSettingsButton () {
    var settingsButton = document.getElementById('settings');
    var body = document.getElementsByTagName("body")[0];
    settingsButton.addEventListener('click', function () {
        clearApp();
        var setCSVName = document.createElement("input");
        setCSVName.type = "text";
        setCSVName.value = "Enter CSV Filename";
        setCSVName.setAttribute("id", "inputCSV");
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(setCSVName);

        setCSVName.addEventListener('click', () => {
            setCSVName.value = "";
        });
        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.setAttribute("id", "saveCSV");
        saveButton.addEventListener('click', () => {
            chrome.storage.local.set({'csvfile': setCSVName.value}, () => {
                chrome.storage.local.get(['csvfile'], function(result) {
                    clearApp();
                });
            });
        });
        body.appendChild(saveButton);
    })
}

function getCSVFile(responseFromSite) {
    chrome.storage.local.get(['csvfile'], function(result) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('rankings/' + result.csvfile + '.csv'), true);
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
            {
                createFileArray(xhr.response, responseFromSite);
            }
        };
        xhr.send();
    });
}

function createFileArray(file, responseFromSite) {
    var fileNoNewLines = file.replace( /[\r\n\"]+/gm, "" );
    var arrayPlayerNames = [];
    var fileArray = fileNoNewLines.split(',');
    fileArray.forEach((elem, ind) => {
        if (elem.length > 8) {
            arrayPlayerNames.push([elem, fileArray[ind + 1], fileArray[ind +2]]);
        }
    });
    checkForDrafted(arrayPlayerNames, responseFromSite);
}

function checkForDrafted(arrayPlayerNames, responseFromSite) {
    var undraftedPlayers = [];
    arrayPlayerNames.forEach((elem, ind) => {
        responseFromSite.forEach((elemFS, indFS) => {
            if (responseFromSite[indFS][0] == arrayPlayerNames[ind][0]) {
                undraftedPlayers.push(arrayPlayerNames[ind]);
            }
        });
    });
    createPlayersTbl(undraftedPlayers);
}

function createPlayersTbl(undraftedPlayers) {
    var body = document.getElementsByTagName("body")[0];
    clearApp();
    var table = document.createElement("playersTable");
    table.setAttribute("id", "playersTable");

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headRow = document.createElement("tr");

    ["Player", "Position", "Team"].forEach((elem) => {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(elem));
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead); 

    if (undraftedPlayers) {
        undraftedPlayers.forEach((elem, ind) => {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(elem[0]));
            tr.appendChild(td);
            var tdPos = document.createElement("td");
            tdPos.appendChild(document.createTextNode(elem[2]));
            tr.appendChild(tdPos);
            var tdTem = document.createElement("td");
            tdTem.appendChild(document.createTextNode(elem[1]));
            tr.appendChild(tdTem);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    body.appendChild(table);
    } else {
        var undraftedPlayers = [["response empty", "no data"]];
    }
}

function clearApp() {
    if (document.getElementsByTagName("playersTable").length != 0) {
        document.getElementsByTagName("playersTable")[0].remove();
    }
    if (document.getElementById("inputCSV")) {
        document.getElementById("inputCSV").remove();
    }
    if (document.getElementById("saveCSV")) {
        document.getElementById("saveCSV").remove();
    }
}