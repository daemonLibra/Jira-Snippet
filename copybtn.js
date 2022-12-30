function GetIssueId() 
{
    const searchParam = "selectedIssue=";
    let issueKey;
    if (document.URL.includes(searchParam)) 
    {
        let match = document.URL.match(/\&selectedIssue=(.*?)(\&|$)/)[1];
        match.replaceAll("&", "");
        match.replace("selectedIssue=");
        issueKey = match;
    }
    else 
    {
        let match = document.title.match(/\[(.*?)\]/)[1];
        match.replaceAll("[", "");
        match.replaceAll("]", "");
        issueKey = match;
    }

    return issueKey;
}

function CopyRichTextWithFallback(key, summary) 
{
    const clipboardItem = new ClipboardItem({
        "text/plain": new Blob(
            [`[${key}]: ${summary}`],
            { type: "text/plain" }
        ),
        "text/html": new Blob(
            [`<a href="https://${window.location.host}/browse/${key}">${key}</a>: ${summary}`],
            { type: "text/html" }
        ),
    });

    navigator.clipboard.write([clipboardItem]);
}

function createBtn(parent) 
{
    const btnText = 'Copy';
    let btn = document.createElement("button");
    btn.textContent = btnText;
    btn.id = "CopyBtnJiraId";
    btn.className = "CopyBtnForJira";
    parent.appendChild(btn);

    let restCallForIssue = `https://${window.location.host}/rest/api/2/issue/`;

    btn.onclick = function () 
    {
        fetch(`${restCallForIssue}${GetIssueId()}`)
            .then((response) => response.json())
            .then((data) => CopyRichTextWithFallback(data['key'], data['fields']['summary']));

        btn.textContent = 'Copied!';
        setTimeout(function () 
        {
            btn.textContent = btnText;
        }.bind(this), 2000);
    }

    btn.ondblclick = function () 
    {
        fetch(`${restCallForIssue}${GetIssueId()}`)
            .then((response) => response.json())
            .then((data) => navigator.clipboard.writeText(data['key']));

        btn.textContent = 'Key copied!';
        setTimeout(function () 
        {
            btn.textContent = btnText;
        }.bind(this), 2000);
    }
}

var observer = new MutationObserver(function (mutations, me) 
{
    var parent = document.getElementsByClassName('gn0msi-0 cqZBrb')[0] ??
        document.getElementsByClassName('_otyr1y44 _ca0q1y44 _u5f3idpf _n3td1y44 _19bvidpf _1e0c116y')[0];

    if (!parent) return;
    if (document.getElementById('CopyBtnJiraId')) return;

    createBtn(parent);
});

observer.observe(document, {
    childList: true,
    subtree: true
}); 
