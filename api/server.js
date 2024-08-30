

 async function fetchJson(url, payload = {}) {
    try{//de reden voor een try and catch is zotat er een betere error adhandeling is en dat ik de error in de console log kan zien
        //en de then als die niet reageert dan gaat die automatisch naar de catch
        return await fetch(url, payload)
            .then((response) => response.json())//reageeer op de aanroep en pas de informatie aan aar een json

    }catch (error){
        console.error('Error:', error);
    }

}
const path = require('path')
const express = require('express')
// Import the path module for dirname function
// Importeer de zelfgemaakte functie fetchJsonTest uit de/helpers map

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
// Gebruik de map 'public-oud' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
 app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));//deze regel code gebruiken vanwege middelware zodat de data leesbaar gemaakt word
// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8001)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})


// variable voor de index route
// const apiUrl = 'https://fdnd-agency.directus.app/items/'
// const huizenHome = await fetchJson(apiUrl + 'f_houses')
// const feedbackUrl = await fetchJson(apiUrl + 'f_feedback')
// const usersUrl = await fetchJson(apiUrl + `f_users/?fields=*.*`)
// const gelukt = 'uw score is toegevoegd';
// //
// // let ratings = ''
// let ratings = []




app.get('/', async function (request, response) {
    try {
        const apiUrl = 'https://fdnd-agency.directus.app/items/';
        let ratings = []
        // Fetch data concurrently using Promise.all
        const [huizenHome, feedbackUrl, usersUrl] = await Promise.all([
            fetchJson(apiUrl + 'f_houses'),
            fetchJson(apiUrl + 'f_feedback'),
            fetchJson(apiUrl + `f_users/?fields=*.*`),
        ]);

        // Process the fetched data (optional)
        // ... (e.g., transform or filter data)

        // Render the template with fetched data
        response.render('index', {
            alleHuizen: huizenHome.data, // Assuming 'data' property holds the actual data
            alleRatings: feedbackUrl.data,
            users: usersUrl.data,
            ratings: ratings, // Assuming you have logic to populate 'ratings' elsewhere
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors gracefully (e.g., render error page or return error message)
        response.status(500).send('Error fetching data');
    }
});

app.post('/', function (request, response) {
    console.log(request.body)
    const apiUrl = 'https://fdnd-agency.directus.app/items/';
    const huizenHome =  fetchJson(apiUrl + 'f_houses');
    const feedbackUrl =  fetchJson(apiUrl + 'f_feedback');
    const usersUrl =  fetchJson(apiUrl + `f_users/?fields=*.*`);
    let ratings = []
    // posten naar directus..
    fetch(`${apiUrl}f_feedback/`, {
        method: 'POST',
        body: JSON.stringify({
            house: request.body.id,
            list: 12,
            user: 5,
            rating: {
                stars: request.body.algemeenNumber,
            },
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    }).then((postResponse) => {
        // console.log(postResponse)
        response.redirect(303, '/')
    })
})








