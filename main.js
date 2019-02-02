// alijas
const s = selektor => document.getElementById(selektor)
// selektori
const naslovPesme = document.getElementById("naslov-pesme")
const tekstPesme = document.getElementById("tekst-pesme")
const forma = document.getElementById("forma")
const trazeniIzvodjac = document.getElementById("trazeni-izvodjac")
const trazenaPesma = document.getElementById("trazena-pesma")
const wikiClanak = document.getElementById('wiki-clanak');
const wikiNaslov = document.getElementById('wiki-naslov');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ucitajWiki() {
    const trazenaRec = trazeniIzvodjac.value.split(' ').map(capitalize).join(' ');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${trazenaRec}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`;
    wikiClanak.innerHTML = '';
    wikiNaslov.innerText = '';

    fetch(url)
        .then(response => response.json())
        .then(podatak => {
            s('wiki-loader').style.display = 'none';
            const pages = podatak.query.pages;
            const clanak = Object.values(pages)[0] // pretvara vrednosti objekta u niz
            const imgSrc = clanak.thumbnail ? clanak.thumbnail.source : 'default.jpg';
    
            wikiNaslov.innerText = 'Wikipedia: ' + clanak.title;
            wikiClanak.innerHTML += `<img src="${imgSrc}" alt="${clanak.title}">`
            wikiClanak.innerHTML += clanak.extract.substring(0, 1000) + ' [...] ';
            wikiClanak.innerHTML += `<a href="${clanak.fullurl}" target="_blank">Read more</a>`
        })
}

function ucitajLyrics() {
    const izvodjac = trazeniIzvodjac.value 
    const pesma = trazenaPesma.value
    const url = `https://api.lyrics.ovh/v1/${izvodjac}/${pesma}`
    fetch(url)
        .then(response => response.json())
        .then(objekat => {
            s('lyrics-loader').style.display = 'none';
            naslovPesme.innerText = izvodjac + ' - ' + pesma
            tekstPesme.innerText = objekat.lyrics ? objekat.lyrics : "Nema pesme"
        })
}

forma.addEventListener('submit', function(e) {
    e.preventDefault();
    s('lyrics-loader').style.display = 'inline';
    s('wiki-loader').style.display = 'inline';
    ucitajLyrics();
    ucitajWiki();
})
