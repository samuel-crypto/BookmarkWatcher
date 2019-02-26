//First, send current tab info
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

   // since only one tab should be active and in the current window at once
   console.log(activeTab);
   // the return variable should only have one entry
   var activeTab = tabs[0];
   var activeTabUrl = activeTab.url;
   var domain = getDomainFromLink(activeTabUrl);
   doStuffWithDomain(domain);
});

chrome.tabs.onActivated.addListener(function(info) {
  console.log('Tabs switched');
  chrome.tabs.get(info.tabId, function(tab) {
    var domain = getDomainFromLink(tab.url);
    doStuffWithDomain(domain);
  });
});

var links = [];

function doStuffWithDomain(domain)
{
  chrome.bookmarks.getTree(function(master_tree){
    var kugos = [];
    counters = [0];
    level = 0;
    while(counters[0] < master_tree.length)
    {
      var this_tree;
      if(level > 0) {
        this_tree = getTreeByCounters(master_tree, counters.slice(0, level));
      }
      else {
        this_tree = master_tree;
      }
      // console.log(this_tree);
      // console.log(counters);

      if(level != 0 && (!this_tree.hasOwnProperty('children') || this_tree.children.length == 0))
      {
          //Check appropriatness
          if(getDomainFromLink(this_tree.url) == domain)
            kugos.push(this_tree);
          counters.splice(counters.length - 1, 1);
          level--;
          counters[counters.length - 1]++;
      }
    	else
    	{
    		if(level > 0 && counters[level] == this_tree.children.length)
    		{
    			counters.splice(counters.length - 1, 1);
    			level--;
    			counters[counters.length - 1]++;
    		}
        else {
          counters.push(0);
          // console.log('GOING DEEPER!');
          // console.log(counters);
          level++;
        }
    	}
    }

    //Now operate the kugos
    chrome.browserAction.setBadgeText({text: kugos.length.toString()});
    links = kugos;
  });
}

function getTreeByCounters(tree, ctrs)
{
  var this_tree = tree;
  var i;
  for(i = 0; i < ctrs.length; i++)
  {
    if(i == 0)
      this_tree = this_tree[ctrs[0]];
    else
      this_tree = this_tree.children[ctrs[i]];
  }
  return this_tree;
}


chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  console.log('Tab updated!');
  var domain = getDomainFromLink(tab.url);
  doStuffWithDomain(domain);
});

function sendLinks(links)
{
  console.log("SENDING!");
  chrome.runtime.sendMessage({
    msg: "fresh_links",
    data: {
        subject: "links",
        content: links
    }
  });
}

function getDomainFromLink(str)
{
  var two_slashes = str.indexOf('//');
  if(two_slashes >= 0)
    str = str.substr(two_slashes + 2, str.length - (two_slashes + 2));

  var firstSlash = str.indexOf('/')
  if(firstSlash >= 0)
    str = str.substr(0, firstSlash);
  var dots = str.split('.');
  return (dots[dots.length - 2] + "." + dots[dots.length - 1]);
}

function getLinksForDomain(domain)
{
  chrome.bookmarks.search({'url':domain}, function(stuff) {
    console.log(stuff);
  });
}
