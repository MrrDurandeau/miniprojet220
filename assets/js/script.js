document.addEventListener("DOMContentLoaded", () => {
	const mapApiKey = 'cbc93ac36e844719b3f0a1b4652a8476';
	// Le plus récent
    async function fetchLatestEarthquake() {
        const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
        const res = await fetch(url);
        const data = await res.json();
      
        if (data.features.length > 0) {
            // On prend le plus récent
            const quake = data.features[0];
            const props = quake.properties;
            const date = new Date(props.time);

            document.getElementById("earthquake").innerHTML = `
            <h2 class="position">${props.place}</h2>
            <div class="quake">
            <p class="magnitude">Magnitude : ${props.mag}</p>
            <p class="heure">Heure : ${date.toLocaleString()}</p>
            <p class="tsunami">Tsunami : ${props.tsunami}</p>
            <p><a href="${props.url}" target="_blank">Détails USGS</a></p>
            </div>
            `;
        } else {
            document.getElementById("earthquake").textContent = "Aucun séisme récent.";
        }
    }

    // Charger les données au démarrage
    fetchLatestEarthquake();

    // Rafraîchir toutes les 60 secondes
    setInterval(fetchLatestEarthquake, 60000);
	
	// Partie séismes connus
	const section_intro = document.getElementsByClassName('section_intro')[0];
    const slides = section_intro.querySelectorAll('.slide');
	const slide_number = document.getElementsByClassName('slide_number')[0];
    var index = 0;

    section_intro.querySelector('.next').addEventListener('click', function(){
        slides[index].classList.remove('active');
        index++;
        if (index >= slides.length) {
            index = 0;
        }
        slides[index].classList.add('active');
		slide_number.innerHTML = index + 1 +"/4";
    })

     section_intro.querySelector('.prev').addEventListener('click', function(){
        slides[index].classList.remove('active');
        index--;
        if (index == -1) {
            index = (slides.length -1);
        }
        slides[index].classList.add('active');
		slide_number.innerHTML = index + 1 +"/4";
    })
	// Partie dernier séismes importants
	const section_seismes_importants = document.getElementsByClassName('section_seismes_importants')[0];
	const slide_sec2 = section_seismes_importants.getElementsByClassName('slide')[0];
	var index_sec2 = 0;
	var earthquakes = [];
	const date = new Date();
	const endtime = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
	const starttime = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()-1}`;
	const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=6&limit=10`;
	fetch(url)
		.then(response => response.json())
		.then(data => {
			let i = 0;
			data.features.forEach(earthquake => {
				fillQuakeList(i,earthquake);
				i++;
			});
			fillQuakeSlide()
		})
	
	section_seismes_importants.querySelector('.next').addEventListener('click', function(){
        index_sec2++;
        if (index_sec2 >= 10) {
            index_sec2 = 0;
        }
		fillQuakeSlide()
    })

     section_seismes_importants.querySelector('.prev').addEventListener('click', function(){;
        index_sec2--;
        if (index_sec2 == -1) {
            index_sec2 = 9;
        }
		fillQuakeSlide();
    })
	
	function fillQuakeList(index,data) {
		let quakeDateObject = new Date(data.properties.time);
		let quakeDate = `${(quakeDateObject.getDate() < 10 ? '0' : '') + quakeDateObject.getDate()}-${((quakeDateObject.getMonth()+1) < 10 ? '0' : '') + (quakeDateObject.getMonth()+1)}-${quakeDateObject.getFullYear()}`;
		let quakeTime = `${(quakeDateObject.getHours() < 10 ? '0' : '') + quakeDateObject.getHours()}:${(quakeDateObject.getMinutes() < 10 ? '0' : '') + quakeDateObject.getMinutes()}:${(quakeDateObject.getSeconds() < 10 ? '0' : '') + quakeDateObject.getSeconds()}`;
		earthquakes.push({date:quakeDate, time:quakeTime, place:data.properties.place, mag:data.properties.mag, lat:data.geometry.coordinates[0], lon:data.geometry.coordinates[1]});
	}
	
	function fillQuakeSlide() {
		slide_sec2.innerHTML=`
        <h3>${earthquakes[index_sec2].place}</h3>
		<div class="quake_info">
          <p>Magnitude ${earthquakes[index_sec2].mag}</p>
          <p>Date et heure : ${earthquakes[index_sec2].date}, ${earthquakes[index_sec2].time}</p>
        </div>
		<div class="button_map_container">
          <button class="map_button">Voir sur la carte</button>
		</div>
        `;
		let mapButton = slide_sec2.getElementsByClassName('map_button')[0];
		mapButton.addEventListener('click', function(){
			let parentDiv = mapButton.parentElement;
			let URL = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=500&height=333&center=lonlat%3A${earthquakes[index_sec2].lat}%2C${earthquakes[index_sec2].lon}&zoom=4&marker=lonlat%3A${earthquakes[index_sec2].lat}%2C${earthquakes[index_sec2].lon}%3Btype%3Aawesome%3Bcolor%3A%23446100%3Bsize%3Ax-large%3Bicon%3Anone&apiKey=${mapApiKey}`
			parentDiv.innerHTML = `<img src='${URL}' alt=''>`
		});
	}

	// Partie recherche
	const section_recherche = document.getElementsByClassName("section_recherche")[0];
	const search_url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100`;
	const coords = {"ME": "", "AN": "&minlatitude=8.755&maxlatitude=72.182&minlongitude=-169.453&maxlongitude=-47.813", "AS": "&minlatitude=-58.263&maxlatitude=20.961&minlongitude=-93.516&maxlongitude=-31.289", "EU": "&minlatitude=35.747&maxlatitude=71.691&minlongitude=-13.887&maxlongitude=45", "AU": "&minlatitude=-44.59&maxlatitude=-9.449&minlongitude=110.391&maxlongitude=156.797", "ASI": "&minlatitude=-10.941&maxlatitude=77.365&minlongitude=69.961&maxlongitude=190.547", "AF": "&minlatitude=-35.791&maxlatitude=33.724&minlongitude=-17.227&maxlongitude=46.582"};

    const bouton = document.getElementById('form_button');
    const search_result = document.getElementById('search_result')

    bouton.addEventListener('click', () => {
        search_result.innerHTML = "";
        const form_lieu = document.getElementById('lieu').value;
        const form_date = document.getElementById('date').value;
        const form_date_fin = document.getElementById('date_fin').value;
        const form_magnitude_max = document.getElementById('magnitude_max').value;
        const form_magnitude_min = document.getElementById('magnitude_min').value;
        const form_profondeur_max = document.getElementById('profondeur_max').value;
        const form_profondeur_min = document.getElementById('profondeur_min').value;
        const form_alert = document.getElementById('alert').value;

        const form_url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson${coords[form_lieu]}&starttime=${form_date}&endtime=${form_date_fin}&minmagnitude=${form_magnitude_min}&maxmagnitude=${form_magnitude_max}&mindepth=${form_profondeur_min}&maxdepth=${form_profondeur_max}&alertlevel=${form_alert}&limit=100`;
        fetch(form_url)
            .then(response => response.json())
            .then(data => {
                data.features.forEach((earthquake, index) => {
                    const timestamp = earthquake.properties.time
                    const time_date = new Date(timestamp)
                    search_result.innerHTML +=`<div class="item_result"><h3>${earthquake.properties.place}</h3>
                    <div class= "resul_infos"><p>Magnitude : ${earthquake.properties.mag}</p><p>Date et heure : ${time_date.toLocaleString()}</p></div><div class="results_buttons"><p><a href="${earthquake.properties.url}" target="_blank">En savoir plus</a></p><button class="resuls_button_map${index}">Voir la carte</button></div><div class="map_message${index}"></div><div class="map${index}"></div></div><br>`;

                });

                //Bouton map

                data.features.forEach((earthquake, index) => {
                    const button_result_map = document.querySelector(`.resuls_button_map${index}`);
                    const map = document.querySelector(`.map${index}`);
                    const map_message = document.querySelector(`.map_message${index}`);

                    button_result_map.addEventListener('click', function() {
                        var result_map = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A${earthquake.geometry.coordinates[0]}%2C${earthquake.geometry.coordinates[1]}&zoom=5&marker=lonlat%3A${earthquake.geometry.coordinates[0]}%2C${earthquake.geometry.coordinates[1]}%3Btype%3Aawesome%3Bcolor%3A%23446100%3Bsize%3Ax-large%3Bicon%3Anone&apiKey=cbc93ac36e844719b3f0a1b4652a8476`;
                        map_message.innerHTML = "Chargement de la carte..."
                        map_message.style.color = "#446100";
                        map_message.style.fontWeight = "bold";
                        map.innerHTML = `<img class ="result_img_map${index}" src=${result_map} >`
                        var img = document.querySelector(`.result_img_map${index}`);
                        img.addEventListener('load', function() {
                            map_message.innerHTML="";
                        })
                        
                        
                    });
                });   
            })
    })
	
})
