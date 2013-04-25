// WiCS University -- server

// Meteor.startup(function () {
//   if (Events.find().count() === 0) {
//     var titles = [
//         "Freshman Orientation Session",
//         "Big Sisters/Little Sisters",
//         "Passing the Torch",
//         "SURG Meetings",
//         "Dessert Study Breaks",
//         "Invited Speaker Series",
//         "Advice on Grad School",
//         "Grant Proposals",
//         "Grace Hopper Scholarships",
//         "Expanding Your Horizons",
//         "Girls, Technology, & Education Forum",
//         "Welcome Potluck",
//         "Breakfast Breaks",
//         "End of Year Picnic",
//         "Logo Design Competition",
//         "Road Trips",
//         "Unix Help Session",
//         "Women's Self Defense Event",
//         "Internation Student Event",
//         "Toy Hacking Workshop",
//         "WiCS Goes to Blizzard",
//         "Letter of Recommendation Workshop",
//         "Google Career Panel", 
//         "Open Source Workshop",
//         "Microsoft Manicures",
//         "IBM Ice Cream Social",
//         "Microsoft Video Game Tourney",
//         "Bring a Girl Scout to Class Day",
//         "Karaoke Night",
//         "Algorithms Study Group",
//         "Getting Your First Internship",
//         "Skating with WiCS",
//         "Mentorship Mixer",
//         "New Website Hackathon",
//         "Tech Nights",
//         "Goldman Sachs Breakfast",
//         "Blackrock Site Visit",
//         "Silicon Shire",
//         "Mad Duck Science",
//         "Robotics Meet and Greet",
//         "Project HATCH",
//         "Hiking Cold Springs Trail",
//         "Coffee Hour",
//         "A Day in the Life Of ...",
//         "Etsy Picnic",
//         "STEM Panel",
//         "Maker Faire",
//         "Ice Cream + Brownie Social",
//         "Event with Girl Scouts",
//         "Volleyball and Lemonade Party",
//         "Firefox Day",
//         "Free HUGS",
//         "Donut Hour",
//         "Love Your Computer",
//         "Chinese New Year",
//         "Halloween Potluck",
//         "Vanguard Guest Speaker",
//       ];
//       var schools = [
//         {name: "University of Pennsylvania", nickname: "UPenn"},
//         {name: "Carnegie Mellon", nickname: "CMU"},
//         {name: "Stanford University", nickname: "Stanford"},
//         {name: "University of Washington", nickname: "UW"},
//         {name: "Bren School", nickname: "Bren School"},
//         {name: "Brown University", nickname: "Brown"},
//         {name: "Columbia University", nickname: "Columbia"},
//         {name: "Tufts University", nickname: "Tufts"},
//         {name: "University of Oregon", nickname: " UO"},
//         {name: "University of California, Santa Barbara", nickname: "UCSB"},
//         {name: "Michigan Tech University", nickname: "Michigan Tech"},
//         {name: "University of Arizona", nickname: "University of Arizona"},
//         {name: "Stony Brook University", nickname: "Stony Brook"},
//         {name: "Drexel University", nickname: "Drexel"},
//         {name: "Sonoma State University", nickname: "Sonoma State"}
//       ];
//       console.log(getRandomInt(0, schools.length))
//       var costs = [ '50', '100', '500' ];
//       var times = [ 'hour', 'day', 'week', 'month', 'semester' ];

//       for (var i=0; i < titles.length; i++) {
//         Meteor.call('createEvent', {
//             title: titles[i],
//             description: "",
//             cost: costs[getRandomInt(0, costs.length)], 
//             planning: times[getRandomInt(0, times.length)],
//             image_url: 'http://placehold.it/220x220',
//             mode: 'live',
//             school: schools[getRandomInt(0, 10)]['nickname']
//           });
//       }
//     }
//     function getRandomInt(min, max) {
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
// });



/********************************************************
* Users and profiles
* 
*/
Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});


/********************************************************
* Events
* 
*/
// Publish complete set of events to all clients
Meteor.publish("events", function () {
  return Events.find();
});


/********************************************************
* Comments
* 
*/
//Publish all comments for requested event_id
Meteor.publish('comments', function () {
  return Comments.find();
});