var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var async = require('async');

function filesInSubFolder(obj, callback) {
  async.eachSeries(obj, function (nextFileInSub, callback) {
    dirNext.push({
      Name: nextFileInSub,
      Type: path.extname(nextFileInSub)
    });
    callback();
  }, function (err) {
    if (err)
      console.log("Dir-Next file is not exsist! " + err);
  });
  callback()
}

function filesInFolder(obj, callback) {
  var pcListFiles = [];

  fs.readdir(obj, function (err, files) {
    if (err)
      console.log("files is not exsist! " + err);

    async.eachSeries(files, function (file, callback) {
      dirNext = [];
      fs.readdir(path.join(obj, file), function (err, nextFile) {
        if (err)
          console.log("nextFile is not exsist! " + err);

        filesInSubFolder(nextFile, callback);
      });

      pcListFiles.push({
        Name: file,
        Type: path.extname(file),
        Dir: dirNext
      });

    }, function (err) {
      if (err)
        console.log("async file is not exsist! " + err);

      callback(pcListFiles);
    })
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/pclistdata', function (req, res, next) {
  try {
    filesInFolder("/", function (respond) {
      res.json(respond)
    });
  } catch (error) {
    console.log('Get did not work: ', error);
  }
});

router.post('/pclistdata', function (req, res) {
  try {
    fileNameData = req.body.fileNameData;
    countPath = req.body.countPath;
    var filePath = JSON.parse(req.body.filePathJson);

    filesInFolder(filePath[countPath], function (respond) {
      res.json(respond)
    });

  } catch (error) {
    console.log('Post did not work: ' + filePath[countPath], error);
  }
});


module.exports = router;