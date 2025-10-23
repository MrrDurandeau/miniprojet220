document.addEventListener("DOMContentLoaded", () => {
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
})
