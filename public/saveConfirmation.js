let modalDiv = document.createElement("div");
document.body.appendChild(modalDiv);
modalDiv.innerHTML = "Saved to Net!";
modalDiv.style.position = "fixed";
modalDiv.style.backgroundColor = "lightgrey";
modalDiv.style.right = "20px";
modalDiv.style.top = "20px";
modalDiv.style.zIndex = "16777271";
modalDiv.style.padding = "8px 16px";
modalDiv.style.fontWeight = "600";
modalDiv.style.fontSize = "16px";
modalDiv.style.boxShadow = "0 1px 3px hsla(0,0%,0%,0.2)";
modalDiv.style.borderRadius = "4px";

document.getElementsByTagName("body")[0].appendChild(modalDiv);

function fade() {
  var element = modalDiv;
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}

setTimeout(fade, 3000);
