var Router = Backbone.Router.extend({
  routes: {
    "":                 "main",   //http://wics.meteor.com/
    "event/:id":        "event",  //http://wics.meteor.com/event/123
    "user/:id":        "user",    //http://wics.meteor.com/user/123
  },

  main: function() {
    Session.set("current_page", "home_page");
  },

  event: function(event_id) {
    Session.set("current_page", "event_page");
    Session.set("event_id", event_id);
  },

  user: function(user_id) {
    Session.set("current_page", "user_page");
    Session.set("current_section", "my_profile");
    Session.set("user_id", user_id);
    Session.set("current_user", Meteor.users.find({_id: user_id}));
  }
});

var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});