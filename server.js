/* This is an example file representing a sample route in express */

var Kue = require('kue');
var Q = require("q");
var ChildProcess = require("child_process");
var express = require('express');
var app = express();
var jobRouter = express.Router();
var bodyParser   = require('body-parser');
var JobQueue = Kue.createQueue();
//console.log(JobQueue);
JobQueue.watchStuckJobs(6000);
//start and monitor a job worker
var workers = [];
function startWorker() {
  var worker = null;
  worker = ChildProcess.spawn(process.argv[0], ['worker.js']);
    worker.on('close', function(){
      console.error("worker closed; restarting");
      startWorker();
    });
}
startWorker();
startWorker();

var sampleJob = function sampleJob(data) {
  var done = Q.defer();
  var job = JobQueue.create("echo",data.message)
    .on("error", function(err){
      done.reject(err);
    })
    .save(function(err){
      if(err) {
        done.reject(err);
      } else {
        done.resolve(job);
      }
    });

  return done.promise;
};
jobRouter.use(bodyParser.json());
jobRouter.post('/q/', function(req, res, next){
  var p = sampleJob(req.body);
  p.done(function(job){
    res.status(200).json({jobid: job.id})
  }, function(err){
    res.status(501).json({"error":err.toString()})
  })

});
jobRouter.get('/q/status/:id', function(req, res, next){
  var id = req.params.id;
  if(!id) {
    return res.status(400).json({"error": "No valid id provided."});
  }
  Kue.Job.get(id, function (err, job) {
    if(err) {
      return res.status(500).json({"error":err.toString()});
    }
    res.send({ progress: job._progress, state: job._state })
  });
});

//app.use(bodyParser.json()); // get information from html forms
app.use(express.static('public'));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/jquery", express.static("node_modules/jquery/dist"));
app.use('/jobs', jobRouter);


app.listen(3000, function(){
  console.log("Example app running on port 3000");
});
