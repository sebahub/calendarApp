var checks = document.getElementsByClassName("reserve");

for (elem of checks) {
  elem.addEventListener("click", function(){
    if (this.checked == true) {
      console.log(this.getAttribute("value"));
      this.parentElement.classList.add("hotpink");
    }
    else if (this.checked == false) {
      console.log("Unregistered:", this.getAttribute("value"));
      this.parentElement.classList.remove("hotpink");
    }
  })}
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





