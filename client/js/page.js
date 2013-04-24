/**
* Page Template
* 
*/
Template.page.pageIs = function (page) {
  return Session.get("current_page") === page;  
};


Template.page.helpers({
  'user': function () {
    return Meteor.user();
  },

  'show_create_event_dialog': function () {
    return Session.get("show_create_event_dialog");
  },

  'show_draft_event_dialog': function () {
    return Session.get("show_draft_event_dialog");
  }
});


Template.page.events({
  'click .create': function () {
    Session.set("create_event_error", null);
    Session.set("show_create_event_dialog", true);
  }, 

  'click .draft': function () {
    Session.set("draft_event_error", null);
    Session.set("show_draft_event_dialog", true);
  }
});
