document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('refreshplayers');
    button.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //possibly check for false and resend with message that content is loading
            chrome.tabs.sendMessage(tabs[0].id, {data:'empty'}, (responseFromSite) => {
                chrome.storage.local.set({'lastSiteResponse': responseFromSite.tableInfo}, () => {});
                getCSVFile(responseFromSite.tableInfo);
            });
        });
    });
    createSettingsButton();
    createADPButton();
    createUserButton();
});

function refreshPlayersList () {
    //may cause an error if not refresh, var should be deleted
    var saveTabs;
    chrome.tabs.query({active: true, currentWindow: true}, function(newtabs) {
        saveTabs = newtabs;
        //possibly check for false and resend with message that content is loading
        chrome.tabs.sendMessage(saveTabs[0].id, {data:'empty'}, (responseFromSite) => {
            if (responseFromSite) {
                chrome.storage.local.set({'lastSiteResponse': responseFromSite.tableInfo}, () => {});
                getCSVFile(responseFromSite.tableInfo);
            }
        });
    });
}

setInterval(refreshPlayersList, 6000);

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
                // might remove this
                chrome.storage.local.get(['csvfile'], function(result) {
                    clearApp();
                });
            });
            chrome.storage.local.set({'userSheet': setCSVName.value}, () => {});
        });
        body.appendChild(saveButton);
    });
}

function createADPButton () {
    var adpButton = document.getElementById("adpButton");
    adpButton.addEventListener('click' ,() => {
        refreshPlayersList();
        adpButton.style.backgroundColor = "#b3975b";
        document.getElementById("userButton").style.backgroundColor = "#efefef";
        clearApp();
        chrome.storage.local.set({'csvfile': 'adp'});
        chrome.storage.local.get(['lastSiteResponse'], (result) => {
            getCSVFile(result.lastSiteResponse);
        });
    });
}

function createUserButton () {
    var userButton = document.getElementById("userButton");
    userButton.addEventListener('click' ,() => {
        refreshPlayersList();
        userButton.style.backgroundColor = "#b3975b";
        document.getElementById("adpButton").style.backgroundColor = "#efefef";
        clearApp();
        chrome.storage.local.get(['userSheet'], function(result) {
            chrome.storage.local.set({'csvfile': result.userSheet}, function(result) {
                chrome.storage.local.get(['csvfile'], function(result) {});
            });
        });
        chrome.storage.local.get(['lastSiteResponse'], (result) => {
            getCSVFile(result.lastSiteResponse);
        });
    });
}

function getCSVFile(responseFromSite) {
    chrome.storage.local.get(['csvfile'], function(result) {
        if (!result.csvfile) {
            csvReturns = 'default';
        } else {
            csvReturns = result.csvfile;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('rankings/' + csvReturns + '.csv'), true);
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
    var fileNoNewLines = file.replace( /[\r\n\"]+/gm, "," );
    var arrayPlayerNames = [];
    var fileArray = fileNoNewLines.split(',');
    fileArray.forEach((elem, ind) => {
        if (elem.length > 8) {
            //destroys my notes but sticking with this for the core function of the app
            var posOfSecondSpace = elem.indexOf(' ', elem.indexOf(' ') + 1);
            if ( posOfSecondSpace != -1) {
                elem = elem.substring(0, posOfSecondSpace);
            }
            var defenseResults = checkForDefense(elem);
            if (defenseResults != -1) {
                elem = defenseResults + ' ';
            }
            if (fileArray[ind + 3].length > 6) {
                arrayPlayerNames.push([elem, fileArray[ind + 1], fileArray[ind + 2], fileArray[ind + 3]]);
            } else {
                arrayPlayerNames.push([elem, fileArray[ind + 1], fileArray[ind + 2]]);
            }
        }
    });
    checkForDrafted(arrayPlayerNames, responseFromSite);
}

function checkForDrafted(arrayPlayerNames, responseFromSite) {
    var undraftedPlayers = [];
    arrayPlayerNames.forEach((elem, ind) => {
        responseFromSite.forEach((elemFS, indFS) => {
            var posOfSecondSpace = responseFromSite[indFS][0].indexOf(' ', responseFromSite[indFS][0].indexOf(' ') + 1);
            if ( posOfSecondSpace != -1) {
                responseFromSite[indFS][0] = responseFromSite[indFS][0].substring(0, posOfSecondSpace);
            }
            if (responseFromSite[indFS][0].includes("Los Angeles") || arrayPlayerNames[ind][0].includes("Los Angeles")) {
                console.log(arrayPlayerNames[ind][0]);
                console.log(responseFromSite[indFS][0]);
            }
            if(responseFromSite[indFS][0] == arrayPlayerNames[ind][0]) {
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
            tr.style.backgroundColor = colorPos(elem[2]);
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(elem[0]));
            //left open to create a tooltip message for notes
            if (elem[3]) {
                td.addEventListener("mouseover", function (event) {

                });
            }
            tr.appendChild(td);
            var tdPos = document.createElement("td");
            //tdPos.style.backgroundColor = colorPos(elem[2]);
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

function colorPos(pos) {
    if (pos.includes('RB')) {
        return '#FAD5CE';
    } else if (pos.includes('QB')) {
        return '#CEE5FA';
    } else if (pos.includes('WR')) {
        return '#FAF5CE';
    } else if (pos.includes('TE')) {
        return '#CEFAE1';
    } else if (pos.includes('K')) {
        return '#F8CEFA';
    }
}

function checkForDefense(elem) {
    if (elem.indexOf("DEF") != -1) {
        return elem.substring(0, elem.indexOf("DEF") - 1);
    }
    if (elem.indexOf("DST") != -1) {
        return elem.substring(0, elem.indexOf("DST") - 1);
    }

    if (elem.indexOf("Defense") != -1) {
        return elem.substring(0, elem.indexOf("Defense") - 1);
    }

    if (elem.indexOf(" (") != -1) {
        return elem.substring(0, elem.indexOf(" ("));
    } else {
    return -1;
    }
}