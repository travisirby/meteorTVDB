var TVDBClient      = Meteor.npmRequire("node-tvdb"),
    tvdbApiKey      = '7B48FA26BFDD2412',
    tvdb            = new TVDBClient(tvdbApiKey),
    xml2js          = Meteor.npmRequire('xml2js'),
    resultsPerPage  = 5;

Meteor.startup(function () {
    var findSeriesAsync = function(name, page, cb) {

      tvdb.getSeries(name, function(err, response) {
        if (err) {
          cb && cb('ERR from tvdb' + err);
        }
        else if (response){
         responseSlice = response.slice(0 + (page * resultsPerPage), resultsPerPage + (page * resultsPerPage) );
         var shows = [];
          responseSlice.forEach( function(show) {
            shows.push( { seriesId: show.seriesid, name: show.SeriesName, banner: show.banner } );
          });
          cb && cb(null, shows);
        }
        else {
          cb && cb('ERR no response sent from tvdb');
        }
      });

    };

    var getSeriesXmlAsync = function(seriesId, cb) {
      HTTP.get('http://thetvdb.com/api/' + tvdbApiKey + '/series/' + seriesId + '/all/en.xml',
        function (err, res) {
          if (err) {
            cb && cb('ERR TVDB GET EN.XML' + err);
            return;
          }
          if (res.statusCode === 200){

          var parser = xml2js.Parser({
              explicitArray: false,
              normalizeTags: true
          });

          parser.parseString(res.content, function (err, result) {

            console.log(result.data.series.id);

            // checks trackedTvSeries array for this series Id. if found dont add show
            var usersShows = ChatboutUserInfo.findOne(
              { trackedTvSeries : { $elemMatch: { seriesId: result.data.series.id } } } );

            if (usersShows) {
              console.log("SHOW ALREADY IN USER'S COLLECTION");
            }
            else {
              ChatboutUserInfo.update( { userId: Meteor.userId() },
                { $push:
                  { trackedTvSeries:
                    { seriesId: result.data.series.id,
                      poster: result.data.series.poster
                    }
                  }
              });
            }
          });

          cb && cb(null, res);
        }

      });
    };

    Meteor.methods({

      findSeries: function(name, page) {
        var findSeries = Meteor.wrapAsync(findSeriesAsync),
            result;
        try {
          result = findSeries(name, page);
          return result;

        } catch (e) {
          console.log('ERR findSeries ', e.message);
          throw new Meteor.Error(500, e);
        }
      },

      getSeriesXml: function (seriesId) {

        var getSeries = Meteor.wrapAsync(getSeriesXmlAsync),
            result;

        try {
          result = getSeries(seriesId);
          return result;
        }
        catch (e) {
          console.log('ERR getSeriesXml ', e.message);
          throw new Meteor.Error(500, e);
        }
      }

    });
});
