// TODO: meteor remove autopublish, now at default
Markers = new Meteor.Collection('markers');
Notification = new Meteor.Collection('notification');
Meteor.subscribe('markers');
Meteor.subscribe('notification');

// TODO: counter starts at 0 beers per day
Session.setDefault("beers", 0);

Router.route('/map', function() {
    this.render('map');
    this.next();
});
Router.route('/drinkers', function() {
    this.render('top');
    this.next();
});
Router.route('/', function() {
    if (Session.get("logged") == "D") {
        this.render('map');
        this.next();
    } else {
        this.render('login');
        this.next();
    }
});
Router.route('/logout', function() {
    Session.set("logged", "N");
    this.render('login');
    this.next();
});

Template.map.rendered = function() {

    var map = L.map('map', {
        doubleClickZoom: false
    }).setView([45.642014, 25.589486], 16);

    L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

    map.on('dblclick', function(event) {
        var user = Session.get("user");
        Markers.insert({
            latlng: event.latlng,
            user: user,
            beers: Session.get("beers"),
            location: "Where is this ?"
        });
        if (Markers.find({
                user: user
            }).count() != 1) {
            var id = Markers.findOne({
                user: user
            })._id;
            Markers.remove({
                _id: id
            })
        };

        Notification.update({
            _id: "fiwCziJReWL9mzXbz"
        }, {
            $set: {
                mesaj: user
            }
        });
    });

    var icon = new L.Icon({
        iconUrl: 'bar.png'
    });

    var query = Markers.find();

    query.observe({
        added: function(document) {
            var user = Session.get("user");
            var marker = L.marker(document.latlng, {
                icon: icon
            }).addTo(map).bindPopup(
                '<div style="width:200px;height:auto;">' +
                '<div>' +
                ' <Label>Drinker: ' + document.user + '</label> ' +
                '<form class="new-location">' +
                '<label>Pub: </label>' +
                '<input type="text" name="text" placeholder="Location" value=" ' + document.location + '"/>' +
                '</form>' +
                '</div>' +
                '</div>')
            if (user == document.user) {
                var marker = L.marker(document.latlng, {
                    icon: icon
                }).addTo(map).bindPopup(
                    '<div style="width:200px;height:auto;">' +
                    '<div>' +
                    ' <Label>Drinker: ' + document.user + '</label> ' +
                    '<button type="button" class="btn btn-primary btn-xs pull-right"><span class="glyphicon glyphicon-plus " aria-hidden="true">1 beer</span></button>' +
                    '<form class="new-location">' +
                    '<label>Pub: </label>' +
                    '<input type="text" name="text" placeholder="Location" value=" ' + document.location + '"/>' +
                    '</form>' +
                    '</div>' +
                    '</div>').openPopup()
            } else {
                var marker = L.marker(document.latlng, {
                    icon: icon
                }).addTo(map).bindPopup(
                    '<div style="width:200px;height:auto;">' +
                    '<div>' +
                    ' <Label>Drinker: ' + document.user + '</label> ' +
                    '<form class="new-location">' +
                    '<label>Pub: </label>' +
                    '<input type="text" name="text" placeholder="Location" value=" ' + document.location + '"/>' +
                    '</form>' +
                    '</div>' +
                    '</div>')
            }
        },
        removed: function(oldDocument) {
            layers = map._layers;
            var key, val;
            for (key in layers) {
                val = layers[key];
                if (val._latlng) {
                    if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
                        map.removeLayer(val);
                    }
                }
            }
        }
    });
    // End query observe
};
