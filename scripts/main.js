import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";
const keyAPI = "b0ce0a3b2b9bcef5d408919e6c8414c4";
let resultatAPI;
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".prevision__heure--nom");
const tempPourHeure = document.querySelectorAll(".prevision__heure--valeur");
const jours = document.querySelectorAll(".prevision__jour--nom");
const tempPourJours = document.querySelectorAll(".prevision__jour--temp");
const img = document.querySelector(".logo__meteo");
const loading = document.querySelector(".overlay__icon--loading");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      appelAPI(longitude, latitude);
      console.log(longitude, latitude);
    },
    () => {
      alert(
        "Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer."
      );
    }
  );
}

function appelAPI(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${keyAPI}`
  )
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      console.log(data);
      resultatAPI = data;
      temps.innerText = resultatAPI.current.weather[0].description;
      temperature.innerText = `${Math.trunc(resultatAPI.current.temp)}°`;
      localisation.innerText = resultatAPI.timezone;

      // Les heures par tranche de trois avec leur température

      let heureActuelle = new Date().getHours();

      for (let i = 0; i < heure.length; i++) {
        let heureIncr = heureActuelle + i * 3;
        if (heureIncr >= 24) {
          heureIncr -= 24;
        }
        heure[i].innerText = `${heureIncr} h`;
      }
      // Temps pour 3h
      for (let i = 0; i < 7; i++) {
        tempPourHeure[i].innerText = `${Math.trunc(
          resultatAPI.hourly[i * 3].temp
        )}°`;
      }

      for (let i = 0; i < 7; i++) {
        jours[i].innerText = tabJoursEnOrdre[i].slice(0, 3);
        tempPourJours[i].innerText = `${Math.trunc(
          resultatAPI.daily[i].temp.day
        )}°`;
      }

      if (heureActuelle > 6 && heureActuelle < 22) {
        img.src = `./ressources/jour/${resultatAPI.current.weather[0].icon}.svg`;
      } else {
        img.src = `./ressources/nuit/${resultatAPI.current.weather[0].icon}.svg`;
      }

      loading.classList.add("disparition");
    });
}
