var axios = require("axios");

const roomId = [
    1536, 1537, 1538, 1539, 1540, 1541, 1542, 1543, 1544, 1545, 1546, 1547, 1548, 1549, 1550, 1551,
    1552, 1553, 1554, 1555, 1556, 1557, 1558, 1559, 1560, 1561, 1562, 1563, 1564, 1565, 1566, 1567,
    1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583,
    1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599,
    1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615,
    1616, 1617, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1625, 1626, 1627, 1628, 1629, 1635,
];

const clientMessage = [
    "Great place, very attentive staff, delicious meals, overall excellent!",
    "married, and of course the Island lived up to our expectations",
    "all our requests and questions. The food was amazing - not only was it delicious and but also served generous amounts! It kept us full all day and night.",
    "Thanks to Philipe and Martin for a wonderful experience. Our whole family enjoyed our 3 night stay on the beautiful, serene, and private island",
    "A 5 star stay, Martin, his wife and the whole Floral Island team was wonderful, the accommodations are very comfortable and the island is one of the gems of the Palawan area",
];

function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
const previousDates = [];
let randomDate = generateRandomDate(new Date(), new Date(2030, 0, 1)).toISOString();
previousDates.push(randomDate);

function generateNoneDuplicatedDate() {
    let randomDate = generateRandomDate(new Date(), new Date(2025, 0, 1)).toISOString();
    const isExist = previousDates.filter(
        date => new Date(date).getTime() === new Date(randomDate).getTime()
    );
    if (isExist.length > 0) {
        generateNoneDuplicatedDate();
    } else {
        previousDates.push(randomDate);
        return randomDate;
    }
}

function getDateInString(date) {
    const randomDateStr = date.split("T")[0].split("-");
    const randomDateFmt = randomDateStr[2] + "-" + randomDateStr[1] + "-" + randomDateStr[0];

    return randomDateFmt;
}

function generateCheckoutDateGreaterThanCheckinDate(checkinDateISOString) {
    let checkoutDateISOString = generateNoneDuplicatedDate();
    if (new Date(checkinDateISOString).getTime() > new Date(checkoutDateISOString).getTime()) {
        generateCheckoutDateGreaterThanCheckinDate(checkinDateISOString);
    } else {
        return getDateInString(checkoutDateISOString);
    }
}

function getCheckinDateAndCheckouDate() {
    let checkinDate, checkinDateISOString, checkoutDate;
    checkinDateISOString = generateNoneDuplicatedDate();
    checkinDate = getDateInString(checkinDateISOString);

    while (true) {
        const value = generateCheckoutDateGreaterThanCheckinDate(checkinDateISOString);
        if (value) {
            checkoutDate = value;
            break;
        }
    }

    return [checkinDate, checkoutDate];
}

for (let i = 0; i <= 10; i++) {
    let postObject = null;
    if (i % 3 === 0) {
        postObject = JSON.stringify({
            bookingDetails: [
                {
                    checkin: getCheckinDateAndCheckouDate()[0],
                    checkout: getCheckinDateAndCheckouDate()[1],
                    roomId: roomId[Math.floor(Math.random() * (roomId.length - 1))],
                },
            ],
            clientMessage: clientMessage[Math.floor(Math.random() * (clientMessage.length - 1))],
        });
    } else {
        postObject = JSON.stringify({
            bookingDetails: [
                {
                    checkin: getCheckinDateAndCheckouDate()[0],
                    checkout: getCheckinDateAndCheckouDate()[1],
                    roomId: roomId[Math.floor(Math.random() * (roomId.length - 1))],
                },
                {
                    checkin: getCheckinDateAndCheckouDate()[0],
                    checkout: getCheckinDateAndCheckouDate()[1],
                    roomId: roomId[Math.floor(Math.random() * (roomId.length - 1))],
                },
            ],
            clientMessage: clientMessage[Math.floor(Math.random() * (clientMessage.length - 1))],
        });
    }

    var config = {
        method: "post",
        url: "http://localhost:8080/api/booking/create",
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aHVhbi5sZW1pbmh0aHVhbi4xMC4yQGdtYWlsLmNvbSIsImlhdCI6MTY2MDQ1NDEwMywiZXhwIjoxODgxMjA2MTAzfQ.zzGr_YB8lWzykGDo0hPRg6ecdmyVHPQLFkV__BDfkCAobyo_unMp2Fl9xhO4eJfF69EWXhMH9yiG3UVlE9AiSQ",
            "Content-Type": "application/json",
        },
        data: postObject,
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}
