document.addEventListener("DOMContentLoaded", () => {
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
	// Partie tremblements de terre à haute magnitude
	const section_seismes_importants = document.getElementsByClassName('section_seismes_importants')[0];
	const slides_sec2 = section_seismes_importants.querySelectorAll('.slide');
	var index_sec2 = 0;
	const date = new Date();
	const endtime = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
	const starttime = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()-1}`;
	const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=6&limit=10`;
	fetch(url)
		.then(response => response.json())
		.then(data => {
			let i = 0;
			data.features.forEach(earthquake => {
				fillQuakeSlide(slides_sec2,i,earthquake);
				i++;
			});
		})
	
	section_seismes_importants.querySelector('.next').addEventListener('click', function(){
        slides_sec2[index_sec2].classList.remove('active');
        index_sec2++;
        if (index_sec2 >= slides_sec2.length) {
            index_sec2 = 0;
        }
        slides_sec2[index_sec2].classList.add('active');
    })

     section_seismes_importants.querySelector('.prev').addEventListener('click', function(){
        slides_sec2[index_sec2].classList.remove('active');
        index_sec2--;
        if (index_sec2 == -1) {
            index_sec2 = (slides_sec2.length - 1);
        }
        slides_sec2[index_sec2].classList.add('active');
    })
	
	function fillQuakeSlide(slides,index,data) {
		let quakeDateObject = new Date(data.properties.time);
		let quakeDate = `${quakeDateObject.getDate()}-${quakeDateObject.getMonth()+1}-${quakeDateObject.getFullYear()}`;
		slides[index].innerHTML=`<p>${data.properties.place}<br><span>Magnitude ${data.properties.mag}</span><br><span>${quakeDate}</span></p>`;
	};

	// Partie recherche
	const section_recherche = document.getElementsByClassName("section_recherche")[0];
	const search_url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100`;
	const coords = {"ME": "", "AN": "&minlatitude=8.755&maxlatitude=72.182&minlongitude=-169.453&maxlongitude=-47.813", "AS": "&minlatitude=-58.263&maxlatitude=20.961&minlongitude=-93.516&maxlongitude=-31.289", "EU": "&minlatitude=35.747&maxlatitude=71.691&minlongitude=-13.887&maxlongitude=45", "AU": "&minlatitude=-44.59&maxlatitude=-9.449&minlongitude=110.391&maxlongitude=156.797", "ASI": "&minlatitude=-10.941&maxlatitude=77.365&minlongitude=69.961&maxlongitude=190.547", "AF": "&minlatitude=-35.791&maxlatitude=33.724&minlongitude=-17.227&maxlongitude=46.582"};

    const bouton = document.getElementById('recupBtn');
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
        console.log(form_lieu, form_date, form_date_fin, form_magnitude_min, form_magnitude_max, form_profondeur_min, form_profondeur_max, form_alert)

        console.log(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson${coords[form_lieu]}&starttime=${form_date}&endtime=${form_date_fin}&minmagnitude=${form_magnitude_min}&maxmagnitude=${form_magnitude_max}&mindepth=${form_profondeur_min}&maxdepth=${form_profondeur_max}&alertlevel=${form_alert}&limit=100`);

        const form_url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson${coords[form_lieu]}&starttime=${form_date}&endtime=${form_date_fin}&minmagnitude=${form_magnitude_min}&maxmagnitude=${form_magnitude_max}&mindepth=${form_profondeur_min}&maxdepth=${form_profondeur_max}&alertlevel=${form_alert}&limit=100`;
        fetch(form_url)
            .then(response => response.json())
            .then(data => {
                data.features.forEach(earthquake => {
                    search_result.innerHTML +=`<p>${earthquake.properties.place}</p><br>`;
                });
            })
    })
	
})
