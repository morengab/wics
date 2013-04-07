// WiCS University -- server

Meteor.startup(function () {
  // if (Events.find().count() === 0) {
  //   var events = [
  //     {owner: "Gaby", title: "Sleepover"},
  //     {owner: "Sally", title: "Hang Out"},
  //     {owner: "Ankha", title: "Hackathon"},
  //     {owner: "Melanie", title: "Tea Party"}
  //   ];
  //   for (var i=0; i < events.length; i++) {
  //     Events.insert(events[i]);
  //   }
  // }
});

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

// Publish complete set of events to all clients
Meteor.publish("events", function () {
  return Events.find();
});
