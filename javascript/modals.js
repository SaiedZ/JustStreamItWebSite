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

export function uploadDataSet(element) {
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