document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('status').textContent = "Extension loaded";
    var button = document.getElementById('changelinks');
    button.addEventListener('click', function () {
        document.getElementById('status').innerHTML = 'Trying to find table...';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //possibly check for false and resend with message that content is loading
            chrome.tabs.sendMessage(tabs[0].id, {data:'McNuggets'}, (response) => {
                createPlayersTbl(response.tableInfo);
                console.log('loading data');
            });
        });
    });
});

function createPlayersTbl(response) {
    //var response = [["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"]];
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
        response.forEach((elem) => {
            var tr = document.createElement("tr");
            for (var o in elem) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(elem[o]));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    body.appendChild(table);
    } else {
        var response = [["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"],["Henry", "TE"], ["bob", "wr"]];
    }
}