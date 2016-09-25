const fs = require('fs');
const path = require('path');

function listFiles(path) {
  let finalList = [];
  if(!fs.lstatSync(path).isDirectory) return [ path ];
  let listing = fs.readdirSync(path);
  listing.forEach(file => {
    if(fs.lstatSync(path.join(path, file)).isDirectory) finalList = finalList.concat(listFiles(path.join(path, file)));
    else finalList.push(path.join(path, file));
  });
  return finalList;
}

export { listFiles, listFiles as default }
