/**
* CLIENT SIDE CODE
*
*/

// ID of currently selected event
Session.setDefault('event_id', null);

// ID of currently selected user
Session.setDefault('user_id', null);

// When editing an event, ID of the event
Session.setDefault('editing_event_id', null);

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
  },

  show_edit_event_dialog: function () {
    return Session.get("show_edit_event_dialog");
  }
});

Template.event_page.events({
  'click .edit': function () {
    var event_id = Session.get("event_id");
    Session.set("editing_event_id", event_id);
    Session.set("edit_event_error", null);
    Session.set("show_edit_event_dialog", true);
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
    var brainstorm_state = template.find(".brainstorm_state").checked;
    var cost = getChecked(template, "[name=costRadios]");
    var planning = getChecked(template, "[name=planningRadios]");
    
    if (title.length) {
      Meteor.call('createEvent', {
        title: title,
        date: date,
        description: description,
        brainstorm_state: brainstorm_state,
        cost: cost, 
        planning: planning
      }, function (error, event) {
        if (! error) {
          // what to do after user has created an event
          // open some dialog?
        }
      });
      Session.set("showCreateEventDialog", false);
    } 
    else {
      Session.set("createEventError", 
        "Give your event a title.");
    }
  },

  // 'click .validate': function (event, template) {
    
  // },

  'click .cancel': function () {
    Session.set("showCreateEventDialog", false);
  }
});

Template.createEventDialog.error = function () {
  return Session.get("createEventError");
}

/**
* Edit Event Dialog Template
*
*/
Template.edit_event_dialog.helpers({
  event: function () {
    var event_id = Session.get("editing_event_id");
    return Events.findOne({_id: event_id});
  },

  brainstormIsChecked: function () {
    var event = Events.findOne(Session.get("editing_event_id"));
    return event.brainstorm_state;
  },

  selectedCostIs: function (cost) {
    var event = Events.findOne(Session.get("editing_event_id"));
    return event.cost === cost;  
  },

  selectedTimeIs: function (time) {
    var event = Events.findOne(Session.get("editing_event_id"));
    return event.planning === time;  
  }
});

Template.edit_event_dialog.events({
  'click .update': function (event, template) {
    var title = template.find(".title").value;
    var date = template.find(".date").value;
    var description = template.find(".description").value;
    var brainstorm_state = template.find(".brainstorm_state").checked;
    var cost = getChecked(template, "[name=costRadios]");
    var planning = getChecked(template, "[name=planningRadios]");
    
    var event_id = Session.get("editing_event_id");
    var user_id = Meteor.userId();

    if (title.length) {
      Meteor.call('editEvent', 
        event_id, 
        user_id,
      {
        title: title,
        date: date,
        description: description,
        brainstorm_state: brainstorm_state,
        cost: cost, 
        planning: planning
      }, function (error, event) {
        if (! error) {
          // what to do after user has created an event
          // open some dialog?
        }
      });
      Session.set("show_edit_event_dialog", false);
    } 
    else {
      Session.set("createEventError", 
        "Give your event a title.");
    }
  },

  // 'click .validate': function (event, template) {

  // },

  'click .cancel': function () {
    Session.set("show_edit_event_dialog", false);
  }
});

/**
* Helper functions
*
*/

/**
* Finds a checked input element (ex: radio, checkbox) 
* and returns its value.
*
* @method getChecked
* @param {String} query A CSS selector
* @param {Object} template A Meteor template (ex: dialog template)
* @return {String} Returns value or null
*/
function getChecked(template, query) {
  var result = template.findAll(query);
  for (var i=0; i < result.length; i++) {
    if (result[i].checked)
      return result[i].value;
  }
}