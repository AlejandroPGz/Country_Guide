const buttonSearch = document.getElementById('button-search');
const inputCountry = document.getElementById('input');
const divCountries = document.getElementById('div-country-container');
const divMain = document.getElementById('main-content');
const REGEX = /^\s*$/;

let countries = [];

window.onload = function() { //Funcion que se ejecuta cuando carga toda la pagina (img, scripts: en este caso el fetch, etc)
(async () => {
    try {
     const response = await fetch("https://restcountries.com/v3.1/all");
     if (response.status >= 400) {
         throw new Error ('Error');
     }
     const data = await response.json();
     countries = [...data];
    //  console.log(countries);
     document.getElementById('loader-page').classList.toggle("loader-dissapear");

     } catch (error) {
     console.log(error)
     alert('error')
    }
 })();
}


const busqueda = () => {
  let valorInput = inputCountry.value;
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().startsWith(valorInput.toLowerCase( ))); //filto en el array las coincidencias con el valor del input, (toLowerCase: pasar todo el string a minusc)
  console.log(filteredCountries);
  
  let nombresPaises = [];
  let banderasPaises = [];

  
  if (filteredCountries.length === 1 ) {
    divCountries.classList.add('div-show');
    divCountries.classList.remove('div-hide');
    divCountries.classList.remove('div-mensaje');
    const countryName = filteredCountries[0].name.common;
    const capital = filteredCountries[0].capital[0];
    const flag = filteredCountries[0].flags.svg;
    const poblationDecimal = parseInt(filteredCountries[0].population).toLocaleString();

    const region = filteredCountries[0].region;
    const timeZone = filteredCountries[0].timezones[0];

    const latitud = filteredCountries[0].latlng[0]
    const longitud = filteredCountries[0].latlng[1]
    let grades = "";
    let climaDescripcion = "";

    
    divCountries.innerHTML = `
    <div class="single-country">
    <img class="bandera" src="${flag}" alt="bandera">
    <div id="div-text" class="text">
        <h3 class="country-name">${countryName}</h3>
        <ul id="lista">
            <li class="li"><span class="spans" id="capital">Capital: ${capital}</span></li>
            <li class="li"><span class="spans" id="population">Population: ${poblationDecimal}</span></li>
            <li class="li"><span class="spans" id="region">Region: ${region}</span></li>
            <li class="li"><span class="spans" id="zona-horaria">TimeZone: ${timeZone}</span></li>
        </ul>
                  <div class="wifi-loader" id="id-clima-load">
                  <svg class="circle-outer" viewBox="0 0 86 86">
                      <circle class="back" cx="43" cy="43" r="40"></circle>
                      <circle class="front" cx="43" cy="43" r="40"></circle>
                      <circle class="new" cx="43" cy="43" r="40"></circle>
                  </svg>
                  <svg class="circle-middle" viewBox="0 0 60 60">
                      <circle class="back" cx="30" cy="30" r="27"></circle>
                      <circle class="front" cx="30" cy="30" r="27"></circle>
                  </svg>
                  <svg class="circle-inner" viewBox="0 0 34 34">
                      <circle class="back" cx="17" cy="17" r="14"></circle>
                      <circle class="front" cx="17" cy="17" r="14"></circle>
                  </svg>
                
              </div>
        </div>
   </div>`;

   //<span id="grades">${grades}</span>
   //<span id="span-clima" class="spans">Weather: ${climaDescripcion}</span>
   //<img style=" border-radius: 2rem; width: 2rem; height: 2rem;" src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="">


   const divText = document.getElementById('div-text');
   const loaderClima = document.getElementById('id-clima-load');
   console.log(loaderClima);

    (async () => {
      try {
        const ClimaKey = "ccd47940cdd6cfbad918a9aa0d9cc3af";
        const climaResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${ClimaKey}&units=metric`);

        if (climaResponse.status >= 400) {
           throw new Error ('Error1');
       }

       const dataClima = await climaResponse.json();
       console.log(dataClima);
       const grades = dataClima.main.temp;
       const climaDescripcion = dataClima.weather[0].description;
       const iconClima = dataClima.weather[0].icon;

       loaderClima.classList.add('loader-clima-dissapear');

       
       
       //me sirve
        divText.innerHTML += `
        <div class="div-gradosylogo">
        <span id="grades">${grades}</span>
        <img id="icono-del-clima" style=" width: 3.5rem; height: 3.5rem;" src="https://openweathermap.org/img/wn/${iconClima}@2x.png" alt="">
        </div>
        <span id="span-clima" class="spans">Weather: ${climaDescripcion}</span>
        ` 

    } catch (error) {
       alert('error2')
       console.log(error);
      }
   })();


  } else if (filteredCountries.length < 9 && filteredCountries.length > 0 ) {
   nombresPaises = filteredCountries.map(country => country.name.common); // .map me crea un nuevo array a partir de otro ya dado
   banderasPaises = filteredCountries.map(country => country.flags.svg); 
   divCountries.classList.add('div-show');
   divCountries.classList.remove('div-mensaje');

   divCountries.innerHTML = `<div id="div-multiples-paises" class="multiple-countries">`;

   
   const multipleCountries = document.getElementById('div-multiples-paises');


    multipleCountries.addEventListener('click', e => {
      if (e.target.closest('.banderas') || e.target.closest('.spans-multiple') || e.target.closest('.country-m')) {
        const divPadreCountries = e.target.parentElement;
        const spanName = divPadreCountries.children[1].textContent;
        console.log(spanName);
      }
    })

   for (let i = 0; i < filteredCountries.length; i++) {
    document.getElementById('div-multiples-paises').innerHTML += `
    <div class="country-m">
        <img class="banderas" src="${banderasPaises[i]}" alt="">
        <span class="spans-multiple">${nombresPaises[i]}</span>
    </div>`;
   } 
  } else if (filteredCountries.length > 0 && filteredCountries.length > 9) {
    console.log(inputCountry.value);
    divCountries.classList.remove('div-show');
    divCountries.classList.remove('div-hide');
    divCountries.classList.add('div-mensaje');
    divCountries.innerHTML = `<div id="mensaje-busqueda" class="mensaje-busqueda">
    <h3>Su busqueda tiene que ser mas especifica</h3>
 </div>`
  } else if (filteredCountries.length === 0) {
    console.log('hola')

    divCountries.classList.add('div-mensaje');
    divCountries.classList.remove('div-show');
    divCountries.classList.remove('div-hide');
    divCountries.innerHTML = `<div id="mensaje-busqueda" class="mensaje-busqueda">
    <h3>Su busqueda no arrojo resultados</h3>
 </div>`
  };
 

  const Validation = REGEX.test(inputCountry.value)
  if (Validation) {
    divCountries.classList.remove('div-show');
    divCountries.classList.add('div-hide');
    divCountries.classList.remove('div-mensaje');
  }
}


inputCountry.addEventListener('input', e => {
busqueda();
})


buttonSearch.addEventListener('click', e => {
  e.preventDefault();
  busqueda();
})

