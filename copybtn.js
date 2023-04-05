function getIssueId() {
  const searchParam = "selectedIssue=";
  let issueKey;

  if (document.URL.includes(searchParam)) {
    let match = document.URL.match(/&selectedIssue=(.*?)(?=&|$)/)[1];
    issueKey = match;
  } else {
    let match = document.title.match(/\[(.*?)\]/)[1];
    issueKey = match;
  }

  return issueKey;
}

function getSubDomain() {
  const fullHost = window.location.host;
  const parts = fullHost.split('.');
  const subDomain = parts[0];
  return subDomain;
}

function createButton(parent) {
  const buttonText = 'Copy Issue Id + Title';
  const button = document.createElement("button");
  button.textContent = buttonText;
  button.id = "CopyBtnJiraId";
  button.className = "CopyBtnForJira";
  parent.appendChild(button);

  const restCallForIssue = `https://${getSubDomain()}.atlassian.net/rest/api/2/issue/`;

  button.onclick = function () {
    fetch(`${restCallForIssue}${getIssueId()}`)
      .then((response) => response.json())
      .then((data) => {
        const issueKey = data['key'];
        const issueTitle = data['fields']['summary'];
        const issueDescription = data['fields']['description'];
        const issueCreated = data['fields']['created'];
        const issueUpdated = data['fields']['updated'];
        const issueType = data['fields']['issuetype'].name;
        const issuePriority = data['fields']['priority'].name;
        const issueStatus = data['fields']['status'].name;
        const issueReporter = data['fields']['reporter'].displayName;
        const issueAssignee = data['fields']['assignee'] ? data['fields']['assignee'].displayName : 'Unassigned';
        const issueResolution = data['fields']['resolution'] ? data['fields']['resolution'].name : 'Unresolved';
  
        browser.storage.local.get('format').then(function (storageData) {
          const format = storageData.format || '[{key}] {title}';
          const outputText = format
            .replaceAll('{key}', issueKey)
            .replaceAll('{title}', issueTitle)
            .replaceAll('{description}', issueDescription)
            .replaceAll('{created}', issueCreated)
            .replaceAll('{updated}', issueUpdated)
            .replaceAll('{type}', issueType)
            .replaceAll('{priority}', issuePriority)
            .replaceAll('{status}', issueStatus)
            .replaceAll('{reporter}', issueReporter)
            .replaceAll('{assignee}', issueAssignee)
            .replaceAll('{resolution}', issueResolution);
          navigator.clipboard.writeText(outputText);
        });
  
        button.textContent = 'Text has been copied!';
        setTimeout(function () {
          button.textContent = buttonText;
        }, 2000);
      });
  };
}

const observer = new MutationObserver(function (mutations, me) 
{
  const parent = document.getElementsByClassName('gn0msi-0 cqZBrb')[0] ||
                 document.getElementsByClassName('_otyr1y44 _ca0q1y44 _u5f3idpf _n3td1y44 _19bvidpf _1e0c116y')[0];

  if (parent && !document.getElementById('copyBtnJiraId')) {
    createButton(parent);
    observer.disconnect();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});