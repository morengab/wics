// Events -- client

Meteor.subscribe("directory");
Meteor.subscribe("events");

Meteor.startup(function () {
  Deps.autorun(function () {
    
  });
});

/////////////////////////////////////////////////////////
// Event List
Template.eventlist.events = function () {
  return Events.find();
};

/////////////////////////////////////////////////////////
// Create Event Dialog
Template.page.events({
  'click .add': function () {
    openCreateEventDialog();
  }
});

var openCreateEventDialog = function () {
  Session.set("createEventError", null);
  Session.set("showCreateEventDialog", true);
};

Template.page.showCreateEventDialog = function () {
  return Session.get("showCreateEventDialog");
};

Template.createEventDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    if (title.length && description.length) {
      Meteor.call('createEvent', {
        title: title,
        description: description,
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
};