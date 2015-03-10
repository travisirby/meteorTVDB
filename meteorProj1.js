ChatboutUserInfo = new Meteor.Collection('chatboutUserInfo');
ChatboutUserTweets = new Meteor.Collection('chatboutUserTweets');


if (Meteor.isClient) {

  subAllUsers = Meteor.subscribe('allUsers');
  Meteor.subscribe('allTweets');

  // Deps.autorun(function() {
  //   if (Meteor.user()){
  //     console.log("User logged in" + Meteor.user().profile.name);
  //   }
  //   else {
  //     console.log("User logged out");
  //   }
  // });

  Template.userDetails.helpers({

    subscriptionReady: function () {
      return subAllUsers.ready();
    },

    user: function() {
      data = ChatboutUserInfo.findOne();
      if (!data){
        data = {
          userId: Meteor.userId(),
          name: "X",
          email: "X",
          trackedTvSeries: []
        }
        ChatboutUserInfo.insert(data);
      }
      else {
         return data;
      }
    },

    seriesToSearch: function (){
      return Session.get('seriesToSearch');
    },

    shows: function() {
      console.log(Session.get('shows'));
      // if (Session.get('shows') === undefined) {
      //   return null;
      // }
      // else {
        return Session.get('shows');
    //  }
      // return Session.get('shows');
    },

    tweets: function() {
      return ChatboutUserTweets.find();
    }

  });

  Template.userDetails.events({

    'submit form': function(e) {

      e.preventDefault();

      searchValue = $( "input[name='seriesToSearch']" ).val();

      // ChatboutUserInfo.update(this._id, {
      //   $set: {
      //     name: e.target.userName.value,
      //     email: e.target.userEmail.value,
      //   },
      //
      //   $push: { trackedTvSeries: searchValue }
      //
      // });

      Session.set('seriesToSearch', searchValue);

      if (searchValue != "") {

          Meteor.call('findSeries', searchValue, 0, function(err, response) {
            if (err) {
              console.log(err);
              return;
            }
            Session.set('shows', response);
          });
      }
      else {
        console.log("series value empty");
      }

      // ChatboutUserTweets.insert({
      //   userId: this.userId,
      //   tweet: searchValue,
      //   date: moment().format("ddd, h:mmA")
      // });

    },

    'click .delete': function(e) {
      ChatboutUserTweets.remove(this._id);
    },

    'click .usersShowsDeleteX': function(e) {
      var parentData = Template.parentData(1);
      console.log(parentData._id);
      ChatboutUserInfo.update( parentData._id,
        { $pull: { trackedTvSeries: { seriesId: this.seriesId } } } );
    },

    'click #showImg': function(e) {
      Meteor.call('getSeriesXml', this.seriesId, function(err, response) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(response);
      });
    }
  });

}

if (Meteor.isServer) {

  Meteor.publish('allUsers', function(){
    return ChatboutUserInfo.find({ userId: this.userId });
  });

  Meteor.publish('allTweets', function(){
    return ChatboutUserTweets.find({ userId: this.userId }, { sort: {date: -1}});
  });

}
