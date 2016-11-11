var Kue = require('kue');
var Q = require("q");

var JobQueue = Kue.createQueue();
//console.log(JobQueue);
JobQueue.watchStuckJobs(6000);

JobQueue.process('echo', function(job, done){
  console.log('processing job ',job.id);
  var progress = "0";
  var step = function(){
    progress++;
    if(progress<100) {
      job.progress(progress,100,{message:'working'});
      setTimeout(step,100);
    } else {
      done();
    }
  };
  step();
});
