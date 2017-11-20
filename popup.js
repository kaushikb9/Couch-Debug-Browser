function getCurrentTabInfo(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    callback(tab);
  });
}

var pathsArr = [];
var getRevData = function(tabID, docURL, revs, i) {
  u = docURL + '?rev=' + revs[i];
  $.get(u, function(doc) {
    if (typeof doc === 'string') {
      doc = JSON.parse(doc);
      docCopy = JSON.parse(JSON.stringify(doc));
    }

    data = {index: i, rev: revs[i]+" >>"}

    pathsArr.forEach( (pathArr) => {
      obj = JSON.parse(JSON.stringify(doc));
      finalPath = null;
      pathArr.forEach( (pathEl) => {
        finalPath = pathEl.replace('[dot]', '.');
        obj = obj[finalPath]
      })
      data[finalPath] = obj;
    })

    if(doc.current_status){
      data.status = doc.current_status
    }

    if(doc.statuses && doc.statuses.length > 0){
      data.lastUser = doc.statuses.slice(-1)[0].username,
      data.lastTimestamp = doc.statuses.slice(-1)[0].end_time
    }

    chrome.tabs.sendMessage(tabID, {action:'log', data: data}, function(response) {
      if (i < revs.length) {
        getRevData(tabID, docURL, revs, ++i);
      }
    });
  });
};

var docHistory = function(docURL) {
  var d = jQuery.Deferred();
  
  $.get(docURL+'?revs_info=true', function(data) {
    var json = JSON.parse(data);
    revs = json._revs_info;
    var results = [];
    revs.forEach(function(rev) {
      if (rev.status === 'available') {
        results.push(rev.rev);
      };
    });
    d.resolve(results);
  });

  return d.promise();
};

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabInfo((tab) => {

    $('#pop-up').submit((ev) => {
      ev.preventDefault();
      var paths = $("#path").val(); 
      pathsArr = paths.split(',').map( (path) => {return path.trim().split(".")});

      re = tab.url.match(/(https?:.+\/)_utils.+?([\w-]+)\/(.+)/);
      var base_url = re[1]
      var db = re[2]
      var doc_id = re[3]

      var docURL = base_url+db+'/'+doc_id
      docHistory(docURL)
        .done(function(revs){
          getRevData(tab.id, docURL, revs, 0)
        })
    });
  });
});
