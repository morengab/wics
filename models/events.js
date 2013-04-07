/**
* Event Model 
* 
* owner: user_id
* title: String
* description: String
* date: Date
* state: Boolean ("brainstorm vs active")
* likes: Array of user_id's that like this event
* ratings: Array of rating objects?
* comments: Array of comment objects?
*/

// Define Minimongo collections to match server/publish.js.
Events = new Meteor.Collection("events");

Events.allow({
  insert: function (userId, event) {
    return false; // no cowboy inserts -- use createEvent method
  }, 
  update: function (userId, event, fields, modifier) {
    if (userId !== event.owner)
      return false;

    var allowed = ["title", "description", "date"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

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
  // Options should include: title, description, date
  createEvent: function (options) {
    options = options || {}
    // this needs date checking
    if (! (typeof options.title === "string" && options.title.length &&
        typeof options.description ==="string" &&
        options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in!");

    return Events.insert({
      owner: this.userId,
      title: options.title,
      date: options.date,
      description: options.description,
      //bunnyfoofoo: bunnyfoofoo,
      cost: options.cost,
      planning: options.planning,
      ratings: [],
      comments: [],
      likes: [],
    });
  }
});














