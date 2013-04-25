/**
* Header Template
* 
*/

Template.user_loggedout.events({
  "click #login": function (e, tmp) {
    Meteor.loginWithFacebook({
      requestPermissions: [
        'email', 
        'user_about_me',
        'user_education_history',
        'user_events',
        'user_hometown',
        'user_location',
        'user_website',
        'user_work_history'
      ]
    }, function (err) {
        if (err) {
          // error handling
        } else {
          // show an alert
        }
    });
  }
});

Template.user_loggedin.events({
  "click #logout": function (e, tmp) {
    Meteor.logout(function (err) {
      if (err) {
        // show err message
      } else {
        // show alert that says logged out
      }
    });
  }
});

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

Template.page.helpers({
  'show_create_event_dialog': function () {
    return Session.get("show_create_event_dialog");
  },

  'show_draft_event_dialog': function () {
    return Session.get("show_draft_event_dialog");
  }
});

Template.header.events({
  'click .create': function () {
    Session.set("create_event_error", null);
    Session.set("show_create_event_dialog", true);
  }, 

  'click .draft': function () {
    Session.set("draft_event_error", null);
    Session.set("show_draft_event_dialog", true);
  }
});

Template.header.events(okCancelEvents(
  '.search-box',
  {
    ok: function (text, evt) {
      evt.target.value = '';
      app.navigate('search/'+text, {trigger: true});
    }
  }));


/**
* Page Template 
*
*/
Template.page.helpers({
  'pageIs': function (page) {
    return Session.get("current_page") === page;
  }
});


/**
* Home Page Template 
*
*/
Template.home_page.event_thumbs = function () {
  var query = Session.get('search_query');
  if (query) {
    return Events.find({
      title: {$regex: ".*"+query+".*", $options: 'i'},
      mode: {$in: ['live', 'draft']}
    });
  }
  else {
    return Events.find({mode: {$in: ['live', 'draft']}});
  }
};


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
  'mouseenter': function (evt) {
    var sel = "[data-id='"+this._id+"'] .btn";
    $(sel).css('opacity', '1');
  },

  'mouseleave': function () {
    var sel = "[data-id='"+this._id+"'] .btn";
    $(sel).css('opacity', '0');
  },

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


/**
* Routing Setup
* 
*/
var Router = Backbone.Router.extend({
  routes: {
    "":                "main",    // #
    "event/:id":       "event",   // #event/123
    "user/:id":        "user",    // #user/123
    "search/:query":   "search",  // #search/kiwis 
  },

  main: function () {
    Session.set("current_page", "home_page");
  },

  event: function (event_id) {
    Session.set("current_page", "event_page");
    Session.set("event_id", event_id);
    Session.set('search_query', null);
  },

  user: function (user_id) {
    Session.set("current_page", "user_page");
    Session.set("current_section", "my_profile");
    Session.set("user_id", user_id);
    Session.set('search_query', null);
  },

  search: function (query) {
    Session.set("current_page", "home_page");
    Session.set("search_query", query);
    Session.set("event_id", null);
    Session.set("user_id", null);
  }
});

var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
