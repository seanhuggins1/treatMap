import { flyToCenter, addTreatToMap, filterTreatFeatures } from './map.js'
import { treatDietTags, treatTypeTags } from './tags.js';
import { getLocation } from './geocoder.js';



//create a form data object to store the info about the treat provider
export let treatData = {};

window.goToQuestion = goToQuestion;

function toggleFilterTags() {
      filterTags.classList.toggle('shown');
      if (filterButton.innerHTML == 'filter treats'){
            filterButton.innerHTML = 'hide'; 
      } else {
            filterButton.innerHTML = 'filter treats'
      }
      
}

window.toggleFilterTags = toggleFilterTags;

let activeQuestion = 0;
function initQuestions(){
      let questions = questionContainer.getElementsByClassName("question");
      questions[activeQuestion].style.display = 'flex';
      setTimeout(function (){
            questions[activeQuestion].style.opacity = '1.0';
      }, 250);
}
initQuestions();

export function goToQuestion(questionNumber) {
      let questions = questionContainer.getElementsByClassName("question");
      questions[activeQuestion].style.opacity = '0.0';
      setTimeout(function () {
            questions[activeQuestion].style.display = 'none';
            activeQuestion = questionNumber;
            if (activeQuestion == 6 || activeQuestion == 2) {
                  setTimeout(() => {showMap(treatData.center)}, 2000);
            }
            questions[activeQuestion].style.display = 'flex';
            setTimeout(function (){
                  questions[activeQuestion].style.opacity = '1.0';
            }, 250);
            
            
      }, 250);
}


async function addTreat(treatData) {
      addTreatToMap(treatData);     //TODO can get rid of this when we pull all treats from db

      let locationJson = await getLocation(treatData.center);
      let locationData = {
            county: 'None',
            state: 'None',
            country: 'None',
      };
      for (let feature of locationJson.features){
            switch(feature.place_type[0]){
                  case 'place':
                        locationData.county = feature.text;
                        break;
                  case 'region':
                        locationData.state = feature.text;
                        break;
                  case 'country':
                        locationData.country = feature.text;
                        break;
                  default:
            }
      }
      

      let response = await fetch(`/Safety/${locationData.country}/${locationData.state}/${locationData.county}`);
      let json = await response.json();

      treatData.safetyRating = json.safety;

      response = await fetch('/Candy', {
            method: 'POST',
            headers: {
             'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(treatData), // We send data in JSON format
      });
}

function showMap(center = [0, 0]) {
      activeQuestion = null;

      //hide the question container
      questionContainer.style.opacity = '0.0';

      //show the map container
      mapContainer.style.display = 'flex';
      
      setTimeout(() => {
            questionContainer.style.display = 'none';



            //add the treat data to the map

            flyToCenter(center);
      }, 400);

}


questionContainer.style.display = 'flex';
mapContainer.style.display = 'none';
treatInfo.style.display = 'none';
//refreshQuestions();


function handleTagClick(event) {
      let tagElem = event.target.closest('.tag-button');
      tagElem.classList.toggle('selected');

}
function handleMapTagClick(event) {
      let tagElem = event.target.closest('.tag-button');
      tagElem.classList.toggle('selected');

      //update the map with the new filters
      let typeTags = [];
      for(let typeFilterTagElem of typeFilterTags.getElementsByClassName('selected')){
            typeTags.push(typeFilterTagElem.innerHTML);
      }
      let dietTags = [];
      for(let dietFilterTagElem of dietFilterTags.getElementsByClassName('selected')){
            dietTags.push(dietFilterTagElem.innerHTML);
      }

      filterTreatFeatures(
            typeTags,
            dietTags
            );
}

function handleSubmitTypeTags(event) {
      let typeTagElems = typeTags.getElementsByClassName('selected');
      treatData.treatTypeTags = [];
      for (let typeTagElem of typeTagElems) {
            let tagName = typeTagElem.innerHTML;
            treatData.treatTypeTags.push(tagName);
      }
      goToQuestion(6);
      addTreat(treatData);
}

function handleSubmitDietTags(event) {
      let dietTagElems = dietTags.getElementsByClassName('selected');
      treatData.treatDietTags = [];
      for (let dietTagElem of dietTagElems) {
            let tagName = dietTagElem.innerHTML;
            treatData.treatDietTags.push(tagName);
      }
      goToQuestion(5);
}


submitTypeTags.addEventListener('click', handleSubmitTypeTags);
submitDietTags.addEventListener('click', handleSubmitDietTags);


for (let tag of treatTypeTags) {
      //create a tag element for the questionnaire
      let tagElem = document.createElement('div');
      tagElem.classList.add('button', 'tag-button','typeTag');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleTagClick);
      typeTags.append(tagElem);

      //create a tag element for the map filters
      tagElem = document.createElement('div');
      tagElem.classList.add('button', 'tag-button','typeTag');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleMapTagClick);
      typeFilterTags.append(tagElem);
}
for (let tag of treatDietTags) {
      //create a tag element for the questionnaire
      let tagElem = document.createElement('div');
      tagElem.classList.add('button', 'tag-button','dietTag');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleTagClick);
      dietTags.append(tagElem);

      //create a tag element for the map filters
      tagElem = document.createElement('div');
      tagElem.classList.add('button', 'tag-button', 'dietTag');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleMapTagClick);
      dietFilterTags.append(tagElem);
}


//initialize the dietary restrictions tags

