// events
Template.map.events({
    "submit .new-location": function(event) {
        var user = Session.get("user");
        var text = event.target.text.value;
        var id = Markers.findOne({
            user: user
        })._id;
        Markers.update({
            _id: id
        }, {
            $set: {
                location: text
            }
        });
    }
});


// Helpers
Template.map.helpers({
    notification: function() {
        var x = Notification.find();
        return x;
    }
});
