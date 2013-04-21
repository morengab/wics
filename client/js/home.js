/**
* Home Page Template 
*
*/
Template.home_page.event_thumbs = function () {
  return Events.find({mode: 'live'});
};