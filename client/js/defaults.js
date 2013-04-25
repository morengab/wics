// ID of currently selected event
Session.setDefault('event_id', null);

// ID of currently selected user
Session.setDefault('user_id', null);

// Search query
Session.setDefault('search_query', null);

// Filtered search query
Session.setDefault('filtered_search_query', null);

// When creating an event from template,
// the id of that template
Session.setDefault('creating_from_template', null);

// When editing an event, ID of the event
Session.setDefault('editing_event_id', null);

// When editing a user, ID of the user
Session.setDefault('editing_user_id', null);

// When editing a comment, ID of the comment
Session.setDefault('editing_comment', null);

Meteor.subscribe("directory");
Meteor.subscribe("events");
Meteor.subscribe("comments");