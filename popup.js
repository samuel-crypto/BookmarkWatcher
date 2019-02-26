var background = chrome.extension.getBackgroundPage();


window.addEventListener("focus", function(event)
{
    runo();
}, false);

window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
});

function runo()
{
  if(background.links.length > 0)
    document.getElementById('sad_message').style.display = 'none';
  else {
    document.getElementById('sad_message').style.display = 'block';
  }

  var stuff = '';
  for(var i = 0; i < background.links.length; i++)
  {
    stuff += '<a href="' + background.links[i].url.toString() + '">' + background.links[i].url.toString() + "</a><br />";
  }
  document.getElementById('stuff').innerHTML = stuff;
}
