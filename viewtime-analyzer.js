const fs = require("fs");
const path = require("path");

var user_read_map = {};

for (var j = 0; j < 17; j++) {
  const dataPath = path.resolve(
    __dirname,
    "viewtime-cache-" + j.toString() + ".json"
  );
  var data = JSON.parse(fs.readFileSync(dataPath));

  for (var i = 0; i < data.length; i++) {
    var articleId = data[i].split(",")[0].split("(")[1];
    var date = new Date(data[i].split(",")[1]);
    var userappid = data[i].split(",")[2].split(")")[0];

    if (user_read_map[userappid] === undefined) user_read_map[userappid] = [];

    user_read_map[userappid].push({ id: articleId, date: date });
  }

  //   break;

  console.log(`loaded .. ${j}`);
}

var article_connectom = {};

var weight = [
  0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1, 1.3, 1.5, -1, 1.5, 1.3, 1.1, 0.9, 0.8,
  0.7, 0.6, 0.5, 0.4, 0.3,
];

var length = Object.keys(user_read_map).length;
var count = 0;

for (var [key, datas] of Object.entries(user_read_map)) {
  console.log(`${++count}/${length}`);
  for (var i = 1; i < datas.length; i++) {
    var cid = datas[i].id;

    for (var j = -10; j <= 10; j++) {
      if (i + j < 0 || i + j >= datas.length || j == 0) continue;
      var pid = datas[i + j].id;

      //   if (article_connectom[pid] === undefined) article_connectom[pid] = {};
      //   if (article_connectom[pid][cid] === undefined)
      //     article_connectom[pid][cid] = 0;
      if (article_connectom[cid] === undefined) article_connectom[cid] = {};
      if (article_connectom[cid][pid] === undefined)
        article_connectom[cid][pid] = 0;

      //   article_connectom[pid][cid] += weight[];
      article_connectom[cid][pid] += weight[j + 10];
    }
  }
}

var article_article_conn = [];

for (var [pid, cids] of Object.entries(article_connectom)) {
  for (var [cid, conn] of Object.entries(cids)) {
    if (pid == cid) continue;
    // if (pid != 1515801) continue;
    article_article_conn.push({ p: pid, c: cid, n: conn });
  }
}

article_article_conn.sort(function (a, b) {
  return b.n - a.n;
});

const savePath = path.resolve(__dirname, "viewtime-analyzed.json");

fs.writeFileSync(
  savePath,
  JSON.stringify(article_article_conn),
  function (err) {
    console.log(err);
    process.exit();
  }
);
