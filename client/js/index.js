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
  },

  'click .populate': function () {
    if (Events.find().count() === 0) {
    var titles = [
        "Freshman Orientation Session",
        "Big Sisters/Little Sisters",
        "Passing the Torch",
        "SURG Meetings",
        "Dessert Study Breaks",
        "Invited Speaker Series",
        "Advice on Grad School",
        "Grant Proposals",
        "Grace Hopper Scholarships",
        "Expanding Your Horizons",
        "Girls, Technology, & Education Forum",
        "Welcome Potluck",
        "Breakfast Breaks",
        "End of Year Picnic",
        "Logo Design Competition",
        "Road Trips",
        "Unix Help Session",
        "Women's Self Defense Event",
        "Internation Student Event",
        "Toy Hacking Workshop",
        "WiCS Goes to Blizzard",
        "Letter of Recommendation Workshop",
        "Google Career Panel", 
        "Open Source Workshop",
        "Microsoft Manicures",
        "IBM Ice Cream Social",
        "Microsoft Video Game Tourney",
        "Bring a Girl Scout to Class Day",
        "Karaoke Night",
        "Algorithms Study Group",
        "Getting Your First Internship",
        "Skating with WiCS",
        "Mentorship Mixer",
        "New Website Hackathon",
        "Tech Nights",
        "Goldman Sachs Breakfast",
        "Blackrock Site Visit",
        "Silicon Shire",
        "Mad Duck Science",
        "Robotics Meet and Greet",
        "Project HATCH",
        "Hiking Cold Springs Trail",
        "Coffee Hour",
        "A Day in the Life Of ...",
        "Etsy Picnic",
        "STEM Panel",
        "Maker Faire",
        "Ice Cream + Brownie Social",
        "Event with Girl Scouts",
        "Volleyball and Lemonade Party",
        "Firefox Day",
        "Free HUGS",
        "Donut Hour",
        "Love Your Computer",
        "Chinese New Year",
        "Halloween Potluck",
        "Vanguard Guest Speaker",
      ];
      var schools = [
        {name: "University of Pennsylvania", nickname: "UPenn"},
        {name: "Carnegie Mellon", nickname: "CMU"},
        {name: "Stanford University", nickname: "Stanford"},
        {name: "University of Washington", nickname: "UW"},
        {name: "Bren School", nickname: "Bren School"},
        {name: "Brown University", nickname: "Brown"},
        {name: "Columbia University", nickname: "Columbia"},
        {name: "Tufts University", nickname: "Tufts"},
        {name: "University of Oregon", nickname: " UO"},
        {name: "University of California, Santa Barbara", nickname: "UCSB"},
        {name: "Michigan Tech University", nickname: "Michigan Tech"},
        {name: "University of Arizona", nickname: "University of Arizona"},
        {name: "Stony Brook University", nickname: "Stony Brook"},
        {name: "Drexel University", nickname: "Drexel"},
        {name: "Sonoma State University", nickname: "Sonoma State"}
      ];
      var costs = [ '50', '100', '500' ];
      var times = [ 'hour', 'day', 'week', 'month', 'semester' ];

      for (var i=0; i < titles.length; i++) {
        Meteor.call('createEvent', {
            title: titles[i],
            description: "",
            cost: costs[getRandomInt(0, costs.length)], 
            planning: times[getRandomInt(0, times.length)],
            image_url: 'http://placehold.it/220x220',
            mode: 'live',
            school: schools[getRandomInt(0, 10)]['nickname']
          });
      }
    }
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
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
  var filter = Session.get('filtered_search_query');
  if (query) {
    return Events.find({
      title: {$regex: ".*"+query+".*", $options: 'i'},
      mode: {$in: ['live', 'draft']}
    });
  }
  else if (filter) {
    var cost = filter[0], planning = filter[1];

    if (cost && planning) {
      return Events.find({
        cost: cost,
        planning: planning
      });
    }
    else if (cost) {
      return Events.find({
        cost: cost
      });
    }
    else {
      return Events.find({
        planning: planning
      });
    }    
  }
  else {
    return Events.find({mode: {$in: ['live', 'draft']}});
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/********************************************************
* Filter
*
*/
Template.filter.events({
  'click .filter': function (event, template) {
    var cost = getSelected(template, "[name=costOptions] option");
    var planning = getSelected(template, "[name=planningOptions] option");
    if (cost !== "" || planning !== "") {
      Session.set('filtered_search_query', [cost, planning]);
    }
    else {
      Session.set('filtered_search_query', null);
    }
  }
});

function getSelected(template, query) {
  var result = template.findAll(query);
  for (var i=0; i < result.length; i++) {
    if (result[i].selected)
      return result[i].value;
  }
}

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
  },

  // TODO: this has been put on hold
  has_liked_this: function () {
    // // return Events.find({
    // //   title: {$regex: ".*"+query+".*", $options: 'i'},
    // //   mode: {$in: ['live', 'draft']}
    // // });
    // var evt = Events.find({
    //   _id: this._id,
    //   'likes.userId': {$in: [ Meteor.userId() ] }
    // });
    // console.log(evt)
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
    Session.set('filtered_search_query', null);
  },

  user: function (user_id) {
    Session.set("current_page", "user_page");
    Session.set("current_section", "my_profile");
    Session.set("user_id", user_id);
    Session.set('search_query', null);
    Session.set('filtered_search_query', null);
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

/********************************************************
* Helper functions
*
*/

/**
* Finds a checked input element from a Meteor template 
* and returns its value.
*/

