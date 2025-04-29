chrome.runtime.onMessage.addListener(notify);

function getIssueId() {
  const searchParam = "selectedIssue=";
  let issueKey;

  if (document.URL.includes(searchParam)) {
    let match = document.URL.match(/\&selectedIssue=(.*?)(?=&|$)/);
    if (match) {
      issueKey = match[1];
      console.log(issueKey);
    } else {
      console.error("Failed to extract the 'selectedIssue' in the URL.");
    }
  } else {
    let match = document.title.match(/\[(.*?)\]/)[1];
    issueKey = match;
  }

  return issueKey;
}

function getIssueDataAndWriteToClipboard(issueId)
{
  const restCallForIssue = `${window.location.origin}/rest/api/3/issue/`;

  fetch(`${restCallForIssue}${issueId}`)
  .then((response) => response.json())
  .then((data) => {
    const issueKey = data['key'];
    const issueTitle = data['fields']['summary'];
    const issueDescription = data['fields']['description'];
    const issueType = data['fields']['issuetype'].name;
    const issuePriority = data['fields']['priority']?.name;
    const issueStatus = data['fields']['status'].name;
    const issueReporter = data['fields']['reporter'].displayName;
    const issueAssignee = data['fields']['assignee'] ? data['fields']['assignee'].displayName : 'Unassigned';
    const issueUrl = `${window.location.origin}/browse/${issueId}`;

    storageGet('format').then(function (storageData) {
      const format = storageData.format || '[{key}] {title}';
      const outputText = format
        .replaceAll('{key}', issueKey)
        .replaceAll('{title}', issueTitle)
        .replaceAll('{description}', issueDescription)
        .replaceAll('{type}', issueType)
        .replaceAll('{priority}', issuePriority)
        .replaceAll('{status}', issueStatus)
        .replaceAll('{reporter}', issueReporter)
        .replaceAll('{assignee}', issueAssignee)
        .replaceAll('{url}', issueUrl)
      
        navigator.clipboard.writeText(outputText);
    });
  });
}

function notify(message)
{
  getIssueDataAndWriteToClipboard(message.issueId);
}

function createButton(parent) {
  const buttonText = 'Jira Snippet';
  const button = document.createElement("button");
  button.textContent = buttonText;
  button.id = "CopyBtnJiraId";
  button.className = "CopyBtnForJira";
  parent.appendChild(button);

  button.onclick = function () {
        const issueId = getIssueId();
        if(issueId == null) {
          button.textContent = 'Error: No Issue id found!';
        }
        getIssueDataAndWriteToClipboard(issueId);
        button.textContent = 'Text has been copied!';
        setTimeout(function () {
          button.textContent = buttonText;
        }, 2000);
  };
}

var observer = new MutationObserver(function (mutations, me) {
  var parent = document.getElementsByClassName('gn0msi-0 cqZBrb')[0] ??
               document.getElementsByClassName('_otyr1y44 _ca0q1y44 _u5f3idpf _n3td1y44 _19bvidpf _1e0c116y')[0] ??
               document.getElementsByClassName('_otyr1b66 _1yt4swc3 _1e0c116y')[0] ??
               document.getElementsByClassName('_otyr1b66 _19pk1b66 _ca0q1b66 _u5f3idpf _n3td1b66 _19bvidpf _1e0c116y')[0] ??
               document.getElementsByClassName('css-1pjflpu')[0];
  if (parent) {
    if (!document.getElementById('CopyBtnJiraId')) {
      createButton(parent);
    }
    else
    {
      console.error("No Element found!");
    }
    return;
  }
  else
  {
    console.error("No Parent found!");
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});

