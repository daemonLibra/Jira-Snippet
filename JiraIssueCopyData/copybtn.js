function GetIssueId()
{
  const searchParam = "selectedIssue=";
  let issueKey;
   if(document.URL.includes(searchParam))
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

function GetSubDomain()
{
//window.location.host is subdomain.domain.com
var full = window.location.host;
var parts = full.split('.');

var subDomain = parts[0];
return subDomain;
}

function createBtn(parent) {
  const btnText = 'Copy Issue Id + Title';
  let btn = document.createElement("button");
  btn.textContent = btnText;
  btn.id = "CopyBtnJiraId";
  btn.className = "CopyBtnForJira";
  parent.appendChild(btn);

  let restCallForIssue = `https://${GetSubDomain()}.atlassian.net/rest/api/2/issue/`;

  btn.onclick = function () 
  {
    fetch(`${restCallForIssue}${GetIssueId()}`)
  .then((response) => response.json())
  .then((data) => navigator.clipboard.writeText(`[${data['key']}] ${data['fields']['summary']}`));

    btn.textContent = 'text has been copied!';
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

    btn.textContent = 'key has been copied!';
    setTimeout(function () 
    {
      btn.textContent = btnText;
    }.bind(this), 2000);

  }
}

var observer = new MutationObserver(function (mutations, me) {
  var parent = document.getElementsByClassName('gn0msi-0 cqZBrb')[0];
  if (parent) {
    if (!document.getElementById('CopyBtnJiraId')) {
      createBtn(parent);
    }
    return;
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});