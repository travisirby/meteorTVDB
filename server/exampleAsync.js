var TVDBClient = Meteor.npmRequire("node-tvdb");
var tvdb       = new TVDBClient("7B48FA26BFDD2412");

Meteor.startup(function () {
    var callMeLaterAsync = function(name, cb) {
      tvdb.getSeries(name, function(err, response) {
        if (err){
         console.log("ERROR getSeries tvdb");
        }
        else if (response){
         var shows = [];
          response.forEach(function(show){
            shows.push(show.SeriesName);
            console.log(show.SeriesName);
          });
          cb && cb(null, shows);
        }
        else {
          cb && cb('ERR no response from tvdb');
        }
      });
    };

    Meteor.methods({
      sayHello: function(name) {
        var callMeLaterSync = Meteor.wrapAsync(callMeLaterAsync),
            result;
        try {
          result = callMeLaterSync(name);

          console.log(result);
          return result;
        } catch (e) {
          console.log('erreur', e.message);
          throw new Meteor.Error(500, e);
        }
      }
    });
  });
