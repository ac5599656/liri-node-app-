const fs = require("fs");
require("dotenv").config();
const keys = require("./key.js");
const axios = require("axios");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

let [node, file, command, ...args] = process.argv;

let commandHandler = {
    'movie-this': movie,
    'spotify-this-song': spotifyThis,
    'do-what-it-says': doWhatItSays

}

let commandToExecute = commandHandler[command];
checkCommand();
function checkCommand() {

    if (commandToExecute) {
        //We have a valid function.
        commandToExecute(args.join('+'));

    }
    else {
        //They did not give us valid input
        console.log('That is not a command I handle.');
    }
}

//Function for spotify-this-song 
function spotifyThis(songName) {
    spotify.search({ type: 'track', query: songName || 'The+Sign+Ace+of+Base', limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //retrieve song name, preview url, album
        const { items } = data.tracks;
        items.forEach(item =>
            console.log(`Name of the song: ${item.name} \n Preview Url: ${item.preview_url}\n Album: ${item.album.name}`)
        );
        //retrieve artist
        const { artists } = data.tracks.items[0];
        artists.forEach(artist => console.log(`Artist: ${artist.name}`)

        );
    });

}
function movie(movieName) {
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${movieName || 'Mr. Nobody'}&y=&plot=short&apikey=trilogy`;
    // Then create a request with axios to the queryUrl
    axios.get(queryUrl)
        .then((result) => {

            const { Title, Year, imdbRating, Country, Language, Ratings, Plot, Actors } = result.data;
            const rottenRating = Ratings.filter(rating => rating.Source === 'Rotten Tomatoes');

            // console.log(rottenRating[0].Value);


            console.log(`${Title} was released in ${Year}.`);
            console.log(`The IMDB Rating for this movie is ${imdbRating}.`);
            console.log(`Here is the plot: ${Plot}`);
            console.log(`The actors for the movie are ${Actors}`);
            console.log(`The Rotten Tomatoe rating is ${rottenRating[0].Value}`);
            console.log(`These ${Country} are where the movie was produced.`);
            console.log(`The movie is available in these languages: ${Language}`);
        })
        .catch((err) => {
            console.log(err);
        })
}

//    * `do-what-it-says` function
function doWhatItSays() {

    //read from the file random.txt    
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) return console.log(err);
        //seperate the string at the comma into an array of substrings
        splitData = data.split(",");


        //the first item in the splitData array equals to the process.argv third item
        process.argv[2] = splitData[0];


        //the second item in the splitData array equals to the process.argv fourth item
        process.argv[3] = splitData[1];
        //process.argv
        [node, file, command, ...args] = process.argv;

        //object holding function instance for the movie and spotifyThis function
        commandHandler = {
            'movie-this': movie,
            'spotify-this-song': spotifyThis,


        }
        //commandToExecute equals to value of the object properties
        commandToExecute = commandHandler[command];
        //call checkCommand function
        checkCommand();

    })
}
