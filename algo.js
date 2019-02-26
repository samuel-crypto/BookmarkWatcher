/*
ALGO:

trees = [main, parent1, parent2...child]
ns = [0, 0, 0, 0, 0, 0, 1]

Criteria for finish: if ns[last] is last of trees[last]



mastertree = getTree.....
counters = [0]; //(counters for every level)
level = 0;
while(counters[0] < mastertree.length - 1)
{
	//TODO: Efficiency, special case for level = 1 if turns out slow
	this_tree = getTreeByCounters(mastertree, counters.substr(0, level));
	if(this_tree doesn't have .children node or if empty folder [children is empty?])
	{
		do useful stuff with this_tree children
		remove last counter
		level--;
		increment (now) last counter
	}
	else
	{
		if(counters[level] == this_tree.length)
		{
			remove last counter
			level--;
			increment (now) last counter
		}
		add counter
		level++
	}
}
*/

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
        // console.log(counters);
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
});

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
