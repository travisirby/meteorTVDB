var TVDBClient = Meteor.npmRequire("node-tvdb");
var tvdb       = new TVDBClient("7B48FA26BFDD2412");


Meteor.startup(function (){
  var getSeriesAsync = function (seriesName, cb) {
    // if (seriesName){
    //   tvdb.getSeries(seriesName, function(err, response) {
    //     if (err){
    //      console.log("ERROR getSeries tvdb");
    //     }
    //     else if (response){
    //      var shows = [];
    //       response.forEach(function(show){
    //         shows.push(show.SeriesName);
    //         console.log(show.SeriesName);
    //       });
    //       cb && cb(null, shows);
    //     }
    //     else {
    //       cb && cb('ERR no response from tvdb');
    //     }
    //   });
    // }
    // else {
    //   cb && cb('ERR must have seriesName');
    // }
    setTimeout(function() {
        if (seriesName) {
          cb && cb(null, 'Hello ' + seriesName);
        } else {
          cb && cb('name is mandatory');
        }
      }, 4000);
  }

  Meteor.methods({

   getSeriesByName: function (seriesName) {

     var getSeriesAsync = Meteor.wrapAsync(getSeriesAsync),
                          result;

    try{
      getSeriesAsync(seriesName);
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      throw new Meteor.Error(500, e);
    }

   },

   welcome: function (name) {
   console.log('on server, welcome called with name: ', name);
   if(name==undefined || name.length<=0) {
       throw new Meteor.Error(404, "Please enter your name");
   }
     return "Welcome " + name;
   }

  });

});
