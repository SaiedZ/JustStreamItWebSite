const mainEntryUrl = "http://localhost:8000/api/v1/titles";
const numberMovieCaroussel = 7;

const catagoriesToImplement = [
    {name: "best-movies", uri: "?sort_by=-imdb_score", startIndex: 1},
    {name: "animation", uri: "?genre=Animation&sort_by=-imdb_score", startIndex: 0},
    {name: "history", uri: "?genre=History&sort_by=-imdb_score", startIndex: 0},
    {name: "family", uri: "?genre=Family&sort_by=-imdb_score", startIndex: 0}
];


// function to set up caroussels //

function fetchMovies(urlCategory, numberMovies, moviesData = []) {
    const dataFetched = fetch(urlCategory)
        .then( function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then (function(data) {
            
            for (let movieData of data.results) {
                movieIdImg = {id: movieData.id, image_url: movieData.image_url, title: movieData.title};
                moviesData.push(movieIdImg);
                if (moviesData.length === numberMovies) {
                    break;
                }
            }
            if (moviesData.length < numberMovies) {
                urlCategory = data.next;
                return fetchMovies(urlCategory, numberMovies, moviesData)
            }
            else {
                return moviesData;
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            alert(error.message);
        })

    return dataFetched;
}


function addMovieCaroussel(infoCaroussel) {
    const urlCategory =  mainEntryUrl + infoCaroussel.uri;

    fetchMovies(urlCategory, numberMovieCaroussel + infoCaroussel.startIndex).then(function(datas) {
        for (let i = infoCaroussel.startIndex; i < datas.length; i++) {

            const liMovie = document.createElement("li");
            liMovie.innerHTML = `<img src="${datas[i].image_url}" alt="${datas[i].title}" id="${datas[i].id}">`;
            uploadDataSet(liMovie.getElementsByTagName("img")[0]);
            document.querySelector("." + infoCaroussel.name + "-caroussel ul")
                .appendChild(liMovie);
        }
    })
}

function addMovieAllCaroussel(catagories) {
    for (let categorie of catagories) {
        addMovieCaroussel(categorie);
    }
}

// Best movie section //

async function getBetMovieUrl(urlMoviesByScore){
    try {
        const resp = await fetch(urlMoviesByScore);
        const data = await resp.json();
        return data.results[0].url;
    } catch (error) {
        console.error('Error:', error);
    }
}

function showPreviewBestMovie(urlMoviesByScore) {
    getBetMovieUrl(urlMoviesByScore)
        .then(function(url){
            fetch(url)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(function(data) {
                    // update title //
                    document.querySelector(".best-movie__infos h2").textContent = data.title;
                    // update description //
                    document.querySelector(".best-movie__infos article p").textContent = data.description;
                    document.querySelector(".best-movie__infos aside p").innerHTML = '<img src=' + data.image_url + " alt=" + data.title+" id="+ data.id+ " >";
                    document.querySelector(".best-movie__btn").setAttribute('id', data.id);
                    uploadDataSet(document.querySelector(".best-movie__btn"));

                })
                .catch(function(error) {
                    console.error('Error:', error);
                })
            })
}

// Scroll horizontally Caroussel

function scrollHorizontally(element, btnScrollLeft, btnScrollRight, val) {

    let lentghTotal = element.offsetWidth;
    let lengthHiddenContent = element.getElementsByTagName("li")[0].offsetWidth * element.getElementsByTagName("li").length - lentghTotal;

    element.scrollLeft += val;

    if (element.scrollLeft == 0){
        btnScrollLeft.style.opacity = "0";
    }else{
        btnScrollLeft.style.opacity = "1";
    }

    if (element.scrollLeft >= lengthHiddenContent){
        btnScrollRight.style.opacity = "0";
    }else{
        btnScrollRight.style.opacity = "1";
    }
}

function setScrollingProperties(carousselName) {

    const sCont = document.querySelector("."+ carousselName + " ul");
    const btnScrollLeft = document.querySelector("."+ carousselName + " .left");
    btnScrollLeft.style.opacity = "0";
    const btnScrollRight = document.querySelector("."+ carousselName + " .right");
    
    btnScrollLeft.addEventListener("click", function(e) {
        e.preventDefault();
        scrollHorizontally(sCont, btnScrollLeft, btnScrollRight, -95);
    })

    btnScrollRight.addEventListener("click", function(e) {
        e.preventDefault();
        scrollHorizontally(sCont, btnScrollLeft, btnScrollRight, 95);
    })
}

function setScrollingAllCaroussels (catagoriesToImplement) {
    for (categorieInfo of catagoriesToImplement) {
        setScrollingProperties(categorieInfo.name + "-caroussel");
    }
}

// Switch light / dark themes

function switchTheme(){
    document.querySelector(".switcher").addEventListener("click", function(e){
        e.preventDefault();
        this.classList.toggle("switcher--light-mode");
        document.getElementsByTagName("body")[0].classList.toggle("white-theme-body");
        document.getElementsByTagName("main")[0].classList.toggle("white-theme-main");
        document.getElementsByTagName("header")[0].classList.toggle("white-theme-header");
    })
}


// Create the modal

function displayModal(data) {

    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    // Create update modal with movie information
    document.getElementsByClassName("modal-titre")[0]
    .innerHTML = data.title;

    let modal_img_el = document.getElementsByClassName("modal__img")[0];
	modal_img_el.innerHTML = "<p><img src='" +  data.image_url + "'></p>";

	let modal_content_el = document.getElementsByClassName("modal__contents");

    let genres_li = document.createElement("li");
    genres_li.innerHTML = "<em>Genre(s) : </em>" + chnageContentIfNone(data.genres);
    modal_content_el[0].appendChild(genres_li);

    let year_li = document.createElement("li");
    year_li.innerHTML = "<em>Date de sortie : </em>" + chnageContentIfNone(data.date_published);
    modal_content_el[0].appendChild(year_li);

    let vote_li = document.createElement("li");
    vote_li.innerHTML = "<em>Score spectateurs : </em>" + chnageContentIfNone(data.avg_vote);
    modal_content_el[0].appendChild(vote_li);

    let imdb_score_li = document.createElement("li");
    imdb_score_li.innerHTML = "<em>Score Imdb : </em>" + chnageContentIfNone(data.imdb_score);
    modal_content_el[0].appendChild(imdb_score_li);

    let directors_li = document.createElement("li");
    directors_li.innerHTML = "<em>Réalisateur(s) : </em>" + chnageContentIfNone(data.directors);
    modal_content_el[0].appendChild(directors_li);
    
    let duration_li = document.createElement("li");
    duration_li.innerHTML = "<em>Durée : </em>" + chnageContentIfNone(data.duration) + " minutes.";
    modal_content_el[0].appendChild(duration_li);
    
    let country_li = document.createElement("li");
    country_li.innerHTML = "<em>Pays d'origine : </em>" + chnageContentIfNone(data.countries);
    modal_content_el[0].appendChild(country_li);
    
    let box_office_results = document.createElement("li");
    box_office_results.innerHTML = "<em>Box-office : </em>" + chnageContentIfNone(data.worldwide_gross_income);    
    modal_content_el[0].appendChild(box_office_results);
    
    let actors_li = document.createElement("li");
    actors_li.innerHTML = "<em>Acteurs : </em>" + chnageContentIfNone(data.actors);
    modal_content_el[0].appendChild(actors_li);
    
    let description_li = document.createElement("li");
    description_li.innerHTML = "<em>Résumé : </em>" + data.long_description;
    modal_content_el[0].appendChild(description_li);
    
    // utils for closing the modal
    
    function deactivateAndDeleteContent() {
        modal.style.display = "none";
        document.getElementsByClassName("modal-titre")[0]
        .innerHTML = "";
        document.getElementsByClassName("modal__img")[0].innerHTML = "";
        document.getElementsByClassName("modal__contents")[0].innerHTML = "";
    }

    // Close the modal if click on X and delete modal's content
    
    span.addEventListener("click", function(e) {
        e.preventDefault();
        deactivateAndDeleteContent();
    })

    // Clors the modal when click on the window outside modal and delete content

    window.addEventListener("click", function(e) {
        if (e.target == modal) {
            e.preventDefault();
            deactivateAndDeleteContent();
        }
    })
}

function chnageContentIfNone(content) {
    if ((content === undefined) || (content === null)) {
        return "No Data";
    }
    if (Array.isArray(content)) {
        return content.join(" ,");
    }
    return content;
}

// Upload dataset for Modals

function uploadDataSet(element) {
    const urlMovie =  mainEntryUrl + "/" +element.getAttribute('id');

    fetch(urlMovie)
        .then( function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then (function(dataInfo) {
            element.setAttribute("data-info", JSON.stringify(dataInfo));

            element.addEventListener("click", function(e) {
                e.preventDefault();
                displayModal(dataInfo);
            })
    })
}


// Main function to excecute


const main = async () => {

    switchTheme();
    const urlMoviesByScore = mainEntryUrl + "?sort_by=-imdb_score";
    showPreviewBestMovie(urlMoviesByScore);
    addMovieAllCaroussel(catagoriesToImplement);
    setScrollingAllCaroussels (catagoriesToImplement);

}

main();