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
    console.log(responseFromSite);
    console.log(arrayPlayerNames);
    var undraftedPlayers = [];
    responseFromSite.forEach((elem, ind) => {
        arrayPlayerNames.forEach((elemPN, indPN) => {
            if (responseFromSite[ind][0] == arrayPlayerNames[indPN]) {
                undraftedPlayers.push(arrayPlayerNames[indPN]);
            }
        });
    });
    createPlayersTbl(undraftedPlayers);
}

function createPlayersTbl(response) {
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("playersTable");
    table.className = "table";

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headRow = document.createElement("tr");

    ["Player", "Pos - Team"].forEach((elem) => {
        console.log('foreach header');
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(elem));
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead); 

    if (response) {
        response.forEach((elem, ind) => {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(elem));
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    body.appendChild(table);
    } else {
        var response = [["response empty", "no data"]];
    }
}