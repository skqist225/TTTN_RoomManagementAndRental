var axios = require("axios");

var randomUsers = [28, 16, 30, 31, 32, 33, 34, 35, 41, 45, 46, 47];
var randomReviews = [
    "Martin, Flora and all the staff were amazing - they couldn’t have been more accommodating. The island is one of the most beautiful places we’ve ever been and perfect for a big family gathering - 21 of us! There is so much to see and do - we leave with wonderful memories and can’t recommend Floral Island highly enough. Thank you all yet again for your incredible hospitality! ",
    "The island is gorgeous, the food was fantastic (especially if you love filipino food) and to stay on the island is an experience you'll cherish forever. It's about a two hour drive from Lio airport in El Nido, and there will likely be some rough terrain on the way there. It's well worth the trip! ",
    "A 5 star stay, Martin, his wife and the whole Floral Island team was wonderful, the accommodations are very comfortable and the island is one of the gems of the Palawan area, I would absolutely recommend it. The icing on the cake, the whole staff was lovely and helped me organize my wedding proposal, an unforgettable event thanks to you!",
    "One of the best airbnb’s in the Philippines! Must try! We’ll be back! Thank you so much Philipe and the team! Kudos to Sir Martin also for being a great host in the island!",
    "The island is gorgeous, the food was fantastic (especially if you love filipino food) and to stay on the island is an experience you'll cherish forever. It's about a two hour drive from Lio airport in El Nido, and there will likely be some rough terrain on the way there. It's well worth the trip! ",
];

function randomString(len, charSet) {
    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
//
for (var i = 0; i <= 100; i++) {
    var data = JSON.stringify({
        hostId: 29,
        review: randomReviews[Math.floor(Math.random() * (randomReviews.length - 1))],
        reviewerId: randomUsers[Math.floor(Math.random() * (randomUsers.length - 1))],
    });

    var config = {
        method: "post",
        url: "http://localhost:8080/api/user/create-host-review-test",
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aHVhbi5sZW1pbmh0aHVhbi4xMC4yQGdtYWlsLmNvbSIsImlhdCI6MTY1OTg2MDgzOCwiZXhwIjoxODgwNjEyODM4fQ.GDz0-aDuVqUSWujWSoTtTeBRXMJySBtnsB34gFpNXJlW1IoeN-Y2fZ8pdcTQ01i2XyhZZ7PYJwCMFd61Bq1smQ",
            "Content-Type": "application/json",
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}
