document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('status').textContent = "Extension loaded";
    var button = document.getElementById('changelinks');
    button.addEventListener('click', function () {
        document.getElementById('status').innerHTML = 'Trying to find table...';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //possibly check for false and resend with message that content is loading
            chrome.tabs.sendMessage(tabs[0].id, {data:'McNuggets'}, (responseFromSite) => {
                getCSVFile(responseFromSite.tableInfo);
            });
        });
    });
});

function getCSVFile(responseFromSite) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('rankings/fpec.csv'), true);
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {
            createFileArray(xhr.response, responseFromSite);
        }
    };
    xhr.send();
}

function createFileArray(file, responseFromSite) {
    var fileNoNewLines = file.replace( /[\r\n\"]+/gm, "" );
    var arrayPlayerNames = [];
    var fileArray = fileNoNewLines.split(',');
    fileArray.forEach(elem => {
        if (elem.length > 8) {
            arrayPlayerNames.push(elem);
        }
    });
    checkForDrafted(arrayPlayerNames, responseFromSite);
}

function checkForDrafted(arrayPlayerNames, responseFromSite) {
    var undraftedPlayers = [];
    arrayPlayerNames.forEach((elem, ind) => {
        responseFromSite.forEach((elemFS, indFS) => {
            if (responseFromSite[indFS][0] == arrayPlayerNames[ind]) {
                console.log(responseFromSite[indFS][0] + " " + arrayPlayerNames[ind]);
                undraftedPlayers.push(arrayPlayerNames[ind]);
            }
        });
    });
    createPlayersTbl(undraftedPlayers);
}

function createPlayersTbl(undraftedPlayers) {
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("playersTable");
    table.className = "table";

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headRow = document.createElement("tr");

    ["Player", "Pos - Team"].forEach((elem) => {
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
            td.appendChild(document.createTextNode(elem));
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    body.appendChild(table);
    } else {
        var undraftedPlayers = [["response empty", "no data"]];
    }
}