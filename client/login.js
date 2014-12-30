//TODO: use  meteor add accounts-google

// Events
Template.login.events({
    'click #signin': function() {
        var text = document.getElementById("inputEmail").value;
        Session.set("logged", "D");
        Session.set("user", text);
        Router.go('/map');
    }
});

// Helpers
