//speech(txt) : 말할 내용을 작성

// html 상에서 활용 예시

//     <script>
// function sayText() {
//     var txt = document.getElementById('speechInput').value;
//     speech(txt);
// }
// </script>

// js 파일 내에서는 같은 위치에 있으면 그냥 사용하면 됩니다!


//sayAgain() : 마지막에 말한 내용을 반복함. 

// 버튼 활용 예시


//<button id="btn" type="button" onclick="sayAgain()">다시말하기</button> 



var voices = [];
function setVoiceList() {
  voices = window.speechSynthesis.getVoices();
}
setVoiceList();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = setVoiceList;
}


var lastTxt = localStorage.getItem('lastTxt');
if (lastTxt===undefined){
  lastTxt="";
};

function sayAgain(){
    if(lastTxt) {
        speech(lastTxt)
      } else {
        console.log("There's no text to repeat.");
      }
}


function speech(txt) {
  lastTxt=txt;  
  localStorage.setItem('lastTxt', lastTxt);
  if(!window.speechSynthesis) {
    alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
    return;
  }
  var lang = 'ko-KR';
  var utterThis = new SpeechSynthesisUtterance(txt);
  utterThis.onend = function (event) {
    console.log('end');
  };
  utterThis.onerror = function(event) {
    console.log('error', event);
  };
  var voiceFound = false;
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
      utterThis.voice = voices[i];
      voiceFound = true;
    }
  }
  if(!voiceFound) {
    alert('voice not found');
    return;
  }
  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1;  //속도
  window.speechSynthesis.speak(utterThis);
}

if ("geolocation" in navigator) {
  // Request permission and start watching position
  var watchID = navigator.geolocation.watchPosition(function(position) {
  }, function(error) {
    console.log("Error occurred: " + error.message);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}



