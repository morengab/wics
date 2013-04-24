/********************************************************
* Event Thumbs
*
*/
Template.event_thumb.helpers({

  // Returns the name of the event creator
  // If creator has no name, return email address
  user_name: function () {
    var event_owner = Meteor.users.findOne(this.owner);
    if (event_owner.profile && event_owner.profile.name)
      return event_owner.profile.name;
    else 
      return event_owner.emails[0].address;
  }
});

Template.event_thumb.events({

  // Adds an event to the user's history of likes
  'click .like': function () {
    var e = this;

    Events.update(
      e._id, 
      {
        $push: { likes: { userId: Meteor.userId() }}
      });

    Meteor.users.update(
      Meteor.userId(), 
      {
        $push: { "profile.likes": { eventId: e._id, timestamp: Date.now() }}
      }
    );
  },

  // Saves an event to the user's list of templates
  'click .save': function () {
    var orig_event = this;
    
    var title = orig_event.title;
    var date = orig_event.date;
    var description = orig_event.description;
    var cost = orig_event.cost;
    var planning = orig_event.planning;
    var mode = 'template';
    var image_url = orig_event.image_url;
    var history = orig_event._id;

    if (title.length) {
      Meteor.call('createEvent', {
        title: title,
        date: date,
        description: description,
        cost: cost,
        planning: planning,
        mode: mode,
        image_url: image_url,
        history: history
      }, function (error, new_event_id) {
        if (! error) {
          Events.update(
            orig_event._id, 
            {
              $push: { 
                saves: {
                  user_id: Meteor.userId(),
                  event_id: new_event_id,
                  timestamp: Date.now() }}
            }
          );
        }
      });
    } 
    else {
      // error checking goes here
    }    
  },

  //TODO: limit saves and likes to one per user

  // Deletes an event 
  'click .delete': function () {
    Events.remove(this._id);
  }
});


/********************************************************
* Event Page
*
*/
Template.event_page.helpers({

  // Returns an event given an id
  event: function () {
    var event_id = Session.get("event_id");
    return Events.findOne({_id: event_id});
  },

  // Checks if edit event dialog should appear
  show_edit_event_dialog: function () {
    return Session.get("show_edit_event_dialog");
  },

  // Returns the mode of the current event
  modeIs: function (mode) {
    var event_id = Session.get("event_id");
    var event = Events.findOne(event_id);
    return mode === event.mode;
  }
});


Template.event_page.events({
  // Sets global settings for edit modal dialog to appear
  'click .edit': function () {
    var event_id = Session.get("event_id");
    Session.set("editing_event_id", event_id);
    Session.set("edit_event_error", null);
    Session.set("show_edit_event_dialog", true);
  },

  'click .publish': function () {
    var event_id = Session.get("event_id");
    Events.update(
      {_id: event_id},
      {
        $set: { mode: 'live' }
      });
  }
});


/********************************************************
* Create Event Dialog 
*
*/
Template.create_event_dialog.events({
  
  'click .create': function (event, template) {
    var title = template.find(".title").value;
    var date = template.find(".date").value;
    var description = template.find(".description").value;
    var cost = getChecked(template, "[name=costRadios]");
    var planning = getChecked(template, "[name=planningRadios]");
    var image_url = template.find(".image_url").value;

    // Update fields and switch to live mode if creating from scratch
    if (Session.get("creating_from_template")) {
      var event_id = Session.get('creating_from_template');
      Events.update(
        {_id: event_id},
        {
          $set: {
            title: title,
            date: date, 
            description: description,
            cost: cost,
            planning: planning,
            image_url: image_url,
            mode: 'live'
          }
        }, 
        function (error) {
          if (!error) {
            Session.set("show_create_event_dialog", false);
            Session.set("creating_from_template", null);
          } 
        }
      );
    }
    // Otherwise, create event from scratch in live mode
    else {
      if (title.length) {
        Meteor.call('createEvent', {
          title: title,
          date: date,
          description: description,
          cost: cost, 
          planning: planning,
          image_url: image_url,
          mode: 'live'
        },
        function (error) {
          if (! error) {
            Session.set("show_create_event_dialog", false);
          }
        });
      }
      else {
        // An event needs at least a title to be created
        Session.set("create_event_error", "Give your event a title.");
      }
    }
  },

  'click .validate': function () {
    console.log(Session.get('creating_from_template'))
  },

  // Cancel creating the event
  'click .cancel': function () {
    Session.set("show_create_event_dialog", false);
    Session.set("creating_from_template", null);
  }
});


Template.create_event_dialog.error = function () {
  return Session.get("create_event_error");
}


Template.create_event_dialog.helpers({
  // Returns a user's event templates
  'template_options': function () {
    var user_id = Meteor.userId();
    return Events.find({ owner: user_id, mode: 'template'});
  }
});


/********************************************************
* Draft Event Dialog 
*
*/
Template.draft_event_dialog.events({
  
  'click .draft': function (event, template) {
    var title = template.find(".title").value;
    var date = template.find(".date").value;
    var description = template.find(".description").value;
    var cost = getChecked(template, "[name=costRadios]");
    var planning = getChecked(template, "[name=planningRadios]");
    var image_url = template.find(".image_url").value;

    if (title.length) {
        Meteor.call('createEvent', {
          title: title,
          date: date,
          description: description,
          cost: cost, 
          planning: planning,
          image_url: image_url,
          mode: 'draft'
        },
        function (error) {
          if (! error) {
            Session.set("show_draft_event_dialog", false);
          }
        });
      }
      else {
        // An event needs at least a title to be drafted
        Session.set("draft_event_error", "Give your event a title.");
      }
   
  },

  'click .validate': function () {
  },

  // Cancel creating the event
  'click .cancel': function () {
    Session.set("show_draft_event_dialog", false);
  }
});


Template.draft_event_dialog.error = function () {
  return Session.get("draft_event_error");
}


/********************************************************
* Edit Event Dialog
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

  // Saves any edits made to the event by the owner
  'click .update': function (event, template) {
    var title = template.find(".title").value;
    var date = template.find(".date").value;
    var description = template.find(".description").value;
    var brainstorm_state = template.find(".brainstorm_state").checked;
    var cost = getChecked(template, "[name=costRadios]");
    var planning = getChecked(template, "[name=planningRadios]");
    var image_url = template.find(".image_url").value;
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
        image_url: image_url,
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

  // Cancels the process of making an edit to an event
  'click .cancel': function () {
    Session.set("show_edit_event_dialog", false);
  }
});


/********************************************************
* Templates
*
*/
Template.template_option.events({
  'click': function () {
    // Get template to populate form input values
    var t = this;

    $('.modal .title').val(t.title);
    $('.modal .image_url').val(t.image_url);
    $('.modal .date').val(t.date);
    $('.modal .description').val(t.description);

    // Populate cost radio button
    var costVal = t.cost;
    if (costVal) {
      var q = ".modal [value='"+costVal+"']";
      $(q).prop('checked', true);
    }

    // Populate planning radio button
    var timeVal = t.planning;
    if (timeVal) {
      var q = ".modal [value='"+timeVal+"']";
      $(q).prop('checked', true); 
    }

    Session.set("creating_from_template", t._id);
  }
});


/********************************************************
* Helper functions
*
*/

/**
* Finds a checked input element from a Meteor template 
* and returns its value.
*/
function getChecked(template, query) {
  var result = template.findAll(query);
  for (var i=0; i < result.length; i++) {
    if (result[i].checked)
      return result[i].value;
  }
}