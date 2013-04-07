/**
* Client side code
*
*/

//ID of currently selected event
Session.setDefault('event_id', null);

Meteor.subscribe("directory");
Meteor.subscribe("events");

/**
* Routing
*
*/
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
    Session.set("user_id", user_id);
    Session.set("current_user", Meteor.users.find({_id: user_id}));
  }
});

var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

/**
* Page Template
* 
*/
Template.page.pageIs = function (page) {
  return Session.get("current_page") === page;  
};

Template.page.showCreateEventDialog = function () {
  return Session.get("showCreateEventDialog");
};

Template.page.events({
  'click .add': function () {
    Session.set("createEventError", null);
    Session.set("showCreateEventDialog", true);
  }
});

/**
* Home Page Template 
*
*/
Template.home_page.event_thumbs = function () {
  return Events.find();
};

/**
* Event Thumb Helper Template (for Home Page)
*
*/
Template.event_thumb.helpers({
  event_id: function () {
    return this._id;
  }, 

  user_id: function () {
    return this.owner;
  }
});

Template.event_thumb.events({
  'click': function () {
    Session.set("event_id", this._id);
  }
});

/**
* Event Page Template 
*
*/
Template.event_page.helpers({
  event: function () {
    var event_id = Session.get("event_id");
    return Events.findOne({_id: event_id});
  }
});

/**
* User Page Template 
*
*/
Template.user_page.helpers({
  user: function () {
    var user_id = Session.get("user_id");
    return Meteor.users.findOne({_id: user_id});
  }
});

/**
* Create Event Dialog Template 
*
*/
Template.createEventDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var date = template.find(".date").value;
    var description = template.find(".description").value;
    //var bunnyfoofoo = template.find(".bunny").value;
    var cost = template.find("[name=costRadios]").value;
    var planning = template.find("[name=planningRadios]").value;
    if (title.length && description.length) {
      Meteor.call('createEvent', {
        title: title,
        date: date,
        description: description,
        //bunnyfoofoo: bunnyfoofoo,
        cost: cost, 
        planning: planning
      });
      Session.set("showCreateEventDialog", false);
    } else {
      Session.set("createEventError", 
        "Give your event a title and description.");
    }
  },
  'click .cancel': function () {
    Session.set("showCreateEventDialog", false);
  }
});

Template.createEventDialog.error = function () {
  return Session.get("createEventError");
}