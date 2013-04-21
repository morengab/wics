/********************************************************
* Event Thumb Helper Template
*
*/
Template.event_thumb.helpers({
  event_id: function () {
    return this._id;
  }, 

  user_id: function () {
    return this.owner;
  },

  user_name: function () {
    var event_owner = Meteor.users.findOne(this.owner);
    if (event_owner.profile && event_owner.profile.name)
      return event_owner.profile.name;
    else 
      return event_owner.emails[0].address;
  }
});

Template.event_thumb.events({
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

  'click .delete': function () {
    Events.remove(this._id);
  }
});


/********************************************************
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


/********************************************************
* Create Event Dialog Template 
*
*/
Template.template_option.events({
  
});

Template.create_event_dialog.events({
  'click .create_template': function () {
    console.log("hi")
  },

  'click .create': function (event, template) {
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
        mode: 'live'
      }, function (error, event) {
        if (! error) {
          // what to do after user has created an event
          // open some dialog?
          Session.set("show_create_event_dialog", false);
        }
      });
    } 
    else {
      Session.set("create_event_error", 
        "Give your event a title.");
    }
  },

  'click .cancel': function () {
    Session.set("show_create_event_dialog", false);
  }
});

Template.create_event_dialog.error = function () {
  return Session.get("create_event_error");
}

Template.create_event_dialog.helpers({
  'template_options': function () {
    var user_id = Meteor.userId();
    return Events.find({ owner: user_id, mode: 'template'});
  }
});


/********************************************************
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
    //var image = template.find(".image_url").value;
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

  'click .cancel': function () {
    Session.set("show_edit_event_dialog", false);
  }
});


/********************************************************
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