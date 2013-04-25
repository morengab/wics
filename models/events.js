/**
* EVENT MODEL
* 
* owner: user_id
* title: String
* description: String
* date: Date
* mode: live OR draft OR template
* likes: Array of user_id's that like this event
* ratings: Array of rating objects
* comments: Array of comment objects <-- am i keeping this?
* saves: Array of template objects
*/

// Define Minimongo collections to match server/publish.js.
Events = new Meteor.Collection("events");
Comments = new Meteor.Collection("comments");

// Define what users are allowed to modify in the database
Events.allow({
  insert: function (userId, event) {
    return false; // no cowboy inserts -- use createEvent method
  }, 

  update: function (userId, event, fields, modifier) {
    if (userId !== event.owner) {
      console.log('denied')
      return false; // not the owner
    }
      
    var allowed = [
      "title", 
      "image_url",
      "description", 
      "date",
      "cost",
      "mode", 
      "planning", 
      "likes", 
      "saves",
      "comments"
    ];

    if (_.difference(fields, allowed).length) {
      console.log('denied')
      return false; // tried to write to forbidden field
    }

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },

  remove: function (userId, event) {
    // You can only remove parties that you created.
    return event.owner === userId;
  }
});

Meteor.methods({

  createEvent: function (options) {
    options = options || {}
    // this needs date checking
    if (! (typeof options.title === "string" && 
        options.title.length &&
        typeof options.description ==="string"))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in!");

    return Events.insert({
      timestamp: Date.now(),
      owner: this.userId,
      title: options.title,
      date: options.date,
      description: options.description,
      cost: options.cost,
      planning: options.planning,
      mode: options.mode,
      image_url: options.image_url,
      school: options.school,
      ratings: [],
      comments: [],
      likes: [],
      saves: [],
      history: options.history,
    });
  },

  editEvent: function (event_id, user_id, options) {
    var event = Events.findOne(event_id);
    if (! event || event.owner !== this.userId)
        throw new Meteor.Error(404, "No such event");
    Events.update(
      {_id: event_id}, 
      {
        $set: {
          title: options.title,
          date: options.date,
          description: options.description,
          cost: options.cost,
          planning: options.planning,
          image_url: options.image_url
        }
      },
      function (error) {
        if (! error){}
        else
          console.log("error updating")
      });
  }
});














