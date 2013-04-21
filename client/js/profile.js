/**
* User Page Template 
*
*/
Template.user_page.helpers({
  user: function () {
    var user_id = Session.get("user_id");
    return Meteor.users.findOne({_id: user_id});
  },

  user_name: function () {
    var user_id = Session.get("user_id");
    var user = Meteor.users.findOne(user_id);
    if (user) {
      if (user.profile && user.profile.name)
        return user.profile.name;
      else
        return user.emails[0].address;
    }
    else 
      return null;
  },

  sectionIs: function (section) {
    return Session.get("current_section") === section;
  }, 

  show_edit_user_dialog: function () {
    return Session.get("show_edit_user_dialog");
  }
});

Template.user_page.events({
  'click .my_profile': function (event, template) {
    Session.set("current_section", "my_profile");
  },

  'click .my_likes': function (event, template) {
    Session.set("current_section", "my_likes");
  },

  'click .my_templates': function (event, template) {
    Session.set("current_section", "my_templates");
  }, 

  'click .my_events' : function () {
    Session.set("current_section", "my_events");
  }
});

/**
* My Profile (section) Template 
*
*/
Template.my_profile.helpers({
  profile: function () {
    var user_id = Session.get("user_id");
    var user = Meteor.users.findOne(user_id);
    if (user && user.profile)
      return user.profile;
    else
      return null;
  }
});

Template.my_profile.events({
  'click .edit': function () {
    Session.set("editing_user_id", Meteor.userId());
    Session.set("edit_user_error", null);
    Session.set("show_edit_user_dialog", true);
  }
});

/**
* My Events (section) Template 
*
*/
Template.my_events.helpers({
  events: function () {
    var user_id = Session.get("user_id");
    return Events.find({owner: user_id, mode: 'live'});
  }
});

/**
* My Templates (section) Template 
*
*/
Template.my_templates.helpers({
  'templates': function () {
    var user_id = Session.get("user_id");    
    return Events.find({
      owner: user_id,
      mode: 'template'
    });
  }
});

/**
* My Likes (section) Template 
*
*/
Template.my_likes.helpers({
  'likes': function () {
    var user_id = Session.get("user_id");
    return Events.find({likes: {$elemMatch: {userId: user_id}}})
  }
});

Template.like.helpers({
  'event': function () {
    return Events.findOne(this.eventId);
  }
});

/**
* Edit User Dialog Template 
*
*/
Template.edit_user_dialog.helpers({
  user: function () {
    return Meteor.users.findOne({_id: Meteor.userId()});
  }
});

Template.edit_user_dialog.events({
  'click .update': function (event, template) {
    var username = template.find(".username").value;
    var name = template.find(".name").value;

    Meteor.users.update(
      {_id:Meteor.user()._id},
      {
        $set:{
          "profile.username": username,
          "profile.name": name
        }
      });

    Session.set("show_edit_user_dialog", false);
  },

  'click .cancel': function () {
    Session.set("show_edit_user_dialog", false);
  }
});