// TODO: allow for each user

// markers collection
Markers = new Meteor.Collection('markers');
Meteor.publish("markers", function () {
  return Markers.find();
});

// notification collection
Notification = new Meteor.Collection('notification');
Meteor.publish("notification", function () {
  return Notification.find();
});
