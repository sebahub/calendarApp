var week = 0;
var woche;
var woche_von = "";
var woche_bis = "";

var nextweek = document.getElementById("forwb");
nextweek.addEventListener("click", function(){
    week++;
    dateget(week);
    remclass();
  });

var prevweek = document.getElementById("nextb");
prevweek.addEventListener("click", function(){
    week--;
    dateget(week);
    remclass();
  });

function updateweek() {
  document.getElementById("wochennummer").innerHTML = "Woche " + woche;
  document.getElementById("woche_von_bis").innerHTML = woche_von + " - " + woche_bis;
}

function remclass() {
  var checks = document.getElementsByClassName("reserve");
  for (elem of checks) {
    elem.parentElement.className = "";
    elem.checked = false;
    elem.disabled = false;
  }
}

function populateres(woche2) {
weekoffset = woche2;
var checks = document.getElementsByClassName("reserve");
for (elem of checks) {
  elem.addEventListener("click", function(){
    if (this.checked == true) {
      console.log(this.getAttribute("value"));
      rescell = this.getAttribute("value");
      this.parentElement.classList.add("hotpink");
      xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
          console.log(xhttp2.responseText);
        }
      };
      xhttp2.open("GET", "/dores?dores=" + rescell + "&offset=" + weekoffset, true);
      xhttp2.send();
    }
    else if (this.checked == false) {
      console.log("Unregistered:", this.getAttribute("value"));
      this.parentElement.className = "";
      rescell2 = this.getAttribute("value");
      xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
          console.log(xhttp2.responseText);
        }
      };
      xhttp2.open("GET", "/remres?delres=" + rescell2 + "&offset=" + weekoffset, true);
      xhttp2.send(); 
    }
  })}
}


function calldates(woche1) {
  weekoffset = woche1;
/* create and send ajax request; */
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("submit").innerHTML = "jetzedle hallo was isch los";
      response = this.responseText;
      var jsonobj = JSON.parse(response);
      console.log(jsonobj);
      /**if reservation for current user exists loop through the date-values */
      if (jsonobj.self) {
        for (i = 0; i < jsonobj.self.length; i++) {
          console.log(jsonobj.self[i]);
          var allInputs = document.getElementsByTagName("input");
          var selfchecks;
          for(var x=0;x<allInputs.length;x++) {
            if(allInputs[x].value == jsonobj.self[i]) {
            selfchecks = allInputs[x];
            selfchecks.parentElement.classList.add("self");
            selfchecks.checked = true;
            }
          }
        }
      }
      /**if reservation dates exist, iterate through the list of date values per band-id element (user id) */
      for (bandn in jsonobj) {
        if (bandn != "self") {
          console.log(bandn);
          var tmp = jsonobj[bandn];
          /** loop through the dates in each band-id entry and get the corresponding checkboxes (according to their values) */
          for (t = 0; t < tmp.length; t++) 
          {
            tmp1 = tmp[t];
            console.log(tmp1);
            var allInputs = document.getElementsByTagName("input");
            var disa;
            for(x=0;x<allInputs.length;x++) {
              if(allInputs[x].value == tmp1) {
              disa = allInputs[x];
              disa.disabled = true;
              disa.parentElement.classList.add("band1");
              }
            }
          }
          }
        }
      }
    };
  xhttp.open("GET", "/res?week=" + weekoffset, true);
  xhttp.send(); 
  }
  


function dateget(woch) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = this.responseText;
      var jsonobj = JSON.parse(response);
      woche_von = jsonobj.Wochenstart;
      woche_bis = jsonobj.Wochenend;
      woche = jsonobj.Wochennummer;
      updateweek();
      populateres(woche);
      calldates(woche);
    }
  }
    xhttp.open("GET", "/date?week=" + woch, true);
    xhttp.send();
    };

window.onload = dateget();

    // Query for only the checked checkboxes and put the result in an array
    /*
    let checked = Array.prototype.slice.call(document.querySelectorAll("input[type='checkbox']:checked"));
    
    // TESTING
    var isReserved = document.getElementsByClassName("reserve");
    
    console.log(checked.length);
  
    for (i = 0; i < checked.length; i++) { 
      var temp = checked[i].parentElement;
      temp.classList.add("hotpink");
    }  
    
    var unchecked = [];
    for (elem of checks) {
      if (elem.checked == false) {
        unchecked.push(elem);
      }
    }

    for (i = 0; i < unchecked.length; i++) { 
      var temp = unchecked[i].parentElement;
      temp.classList.remove("hotpink");
    }  

})}

document.querySelector(".submit").addEventListener("click", function(){
  // Query for only the checked checkboxes and put the result in an array
  let checked = Array.prototype.slice.call(document.querySelectorAll("input[type='checkbox']:checked"));

  // TESTING
  var isReserved = document.getElementsByClassName("reserve");
  
  console.log(checked.length);

  for (i = 0; i < checked.length; i++) { 
    var temp = checked[i].parentElement;
    temp.classList.add("hotpink");
  }

  //TEST END
  
  //console.clear();

*/
/*
  // Loop over the array and inspect contents
  checked.forEach(function(cb){
    console.log(cb.value);
    //isReserved.style.background = 'hotpink';
  });*/





