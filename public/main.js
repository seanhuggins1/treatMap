import {initMap} from './map.js'



var activeQuestion = 0;

//create a form data object to store the info about the treat provider
export let treatData = {};

window.nextQuestion = nextQuestion;


function refreshQuestions() {
      let questions = questionContainer.getElementsByClassName("question");
      for (let q = 0; q < questions.length; q++) {
            console.log(q);
            if (q == activeQuestion) {
                  questions[q].style.display = '';
                  questions[q].style.opacity = '1.0';
            } else {
                  questions[q].style.display = 'none';
                  questions[q].style.opacity = '0.0';
            }
      }
}

export function nextQuestion() {
      let questions = questionContainer.getElementsByClassName("question");
      questions[activeQuestion].style.opacity = '0.0';
      setTimeout(function () {
            questions[activeQuestion].style.display = 'none';
            if (activeQuestion == questions.length - 1){
                  showMap(treatData.center);
            } else {
                  activeQuestion++;
                  questions[activeQuestion].style.display = '';
                  questions[activeQuestion].style.opacity = '1.0';
            }
      }, 200);
}
function showMap(center = [0,0]) {
      activeQuestion = null;

      //hide the question container
      questionContainer.style.display = 'none';

      //show the map container
      mapContainer.style.display = 'flex';

      initMap(center);
}
mapContainer.style.display = 'none';
refreshQuestions();


function handleTagClick(event){
      let tagElem = event.target.closest('.tag-button');
      tagElem.classList.toggle('selected');

}

function handleSubmitTypeTags(event){
      let typeTagElems = typeTags.getElementsByClassName('selected');
      treatData.typeTags = [];
      for (let typeTagElem of typeTagElems){
            let tagName = typeTagElem.innerHTML;
            treatData.typeTags.push(tagName);
      }
      console.log(treatData);
      nextQuestion();
}

function handleSubmitDietTags(event){
      let dietTagElems = dietTags.getElementsByClassName('selected');
      treatData.dietTags = [];
      for (let dietTagElem of dietTagElems){
            let tagName = dietTagElem.innerHTML;
            treatData.dietTags.push(tagName);
      }
      console.log(treatData);
      nextQuestion();
}


submitTypeTags.addEventListener('click', handleSubmitTypeTags);
submitDietTags.addEventListener('click', handleSubmitDietTags);

let tags = [
      'Peanuts',
      'Tree Nuts',
      'Dairy',
      'Eggs',
      'Wheat',
      'Soy',
]
let treatTypeTags = [
      'Chips',
      'Candy',
      'Chocolate',
      'KitKat',
      'Caramilk',
]
for (let tag of treatTypeTags){
      let tagElem = document.createElement('div');
      tagElem.classList.add('button','tag-button');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleTagClick);
      typeTags.append(tagElem);
}
for (let tag of tags){
      let tagElem = document.createElement('div');
      tagElem.classList.add('button','tag-button');
      tagElem.innerHTML = tag;
      tagElem.addEventListener('click', handleTagClick);
      dietTags.append(tagElem);
}


//initialize the dietary restrictions tags

