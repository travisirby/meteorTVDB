ChatboutUserInfo = new Meteor.Collection('chatboutUserInfo');
ChatboutUserTweets = new Meteor.Collection('chatboutUserTweets');


if (Meteor.isClient) {



  Meteor.startup(function () {
    Session.set('shows', ['Richard']);
  });

    Meteor.subscribe('allUsers');
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
      return data;

    },

    shows: function() {
      return Session.get('shows');
    },

    tweets: function() {
      return ChatboutUserTweets.find();
    }
  });

  Template.userDetails.events({
    'submit form': function(e){

      e.preventDefault();

      ChatboutUserInfo.update(this._id, {
        $set: {
          name: e.target.userName.value,
          email: e.target.userEmail.value,
        },

        $push: { trackedTvSeries: e.target.tweet.value }

      });

      Meteor.call('sayHello', e.target.tweet.value , function(err, response) {
        if (err) {
          console.log(err);
          return;
        }
        console.dir(response[0]);
        Session.set('shows', response);
	    });

      ChatboutUserTweets.insert({
        userId: this.userId,
        tweet: e.target.tweet.value,
        date: moment().format("ddd, h:mmA")
      });


    },

    'click .delete': function(e){
      ChatboutUserTweets.remove(this._id);
    }
  });

}

if (Meteor.isServer) {

  //
  // Meteor.startup(function () {
  //
  // });

  Meteor.publish('allUsers', function(){
    return ChatboutUserInfo.find({ userId: this.userId });
  });

  Meteor.publish('allTweets', function(){
    return ChatboutUserTweets.find({ userId: this.userId }, { sort: {date: -1}});
  });


}
