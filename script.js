let dragged = null;
let selectedElement = null;
let zIndexCounter = 1;
const textinput = document.querySelector("#txt");
const colorinput = document.querySelector("#color");
const sizeinput = document.querySelector("#size");
const imgInput = document.querySelector("#imgInput");
const download = document.querySelector("#downloadbtn");
const deletebtn = document.querySelector("#deletebtn");
const widthInput = document.querySelector("#btnWidth");
const heightInput = document.querySelector("#btnHeight");


function makeResizable(el) {
    const resizer = document.createElement("div");
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.background = "red";
    resizer.style.position = "absolute";
    resizer.style.right = 0;
    resizer.style.bottom = 0;
    resizer.style.cursor = "se-resize";
    el.appendChild(resizer);
    el.style.position = "absolute";

    resizer.addEventListener("mousedown", initResize);

    function initResize(e) {
        e.preventDefault();
        window.addEventListener("mousemove", Resize);
        window.addEventListener("mouseup", stopResize);
    }

    function Resize(e) {
        const rect = el.getBoundingClientRect();
        el.style.width = e.clientX - rect.left + "px";
        el.style.height = e.clientY - rect.top + "px";

        // live sync with input
        if (el === selectedElement) {
            document.querySelector("#btnWidth").value = parseInt(el.style.width);
            document.querySelector("#btnHeight").value = parseInt(el.style.height);
        }
    }

    function stopResize() {
        window.removeEventListener("mousemove", Resize);
        window.removeEventListener("mouseup", stopResize);
    }
}


function makedraggable(el) {
    el.draggable = true;
    el.style.position = "absolute";

    el.addEventListener("dragstart", (e) => {
        dragged = e.target;
    });
    el.addEventListener("click", () => {
        if (selectedElement) {
            selectedElement.style.border = "none";
        }

        selectedElement = el;
        selectedElement.style.border = "2px dashed red";
        selectedElement.style.zIndex = zIndexCounter++;


        if (el.tagName === "P" || el.tagName === "BUTTON") {
            textinput.value = el.innerText;
            colorinput.value = rgbToHex(el.style.color || "#000000");
            sizeinput.value = parseInt(el.style.fontSize) || 16;
            imgInput.value = " ";
        }
        else if (el.tagName === "IMG") {
            imgInput.value = el.src;
            textinput.value = "";
            colorinput.value = "#000000";
            sizeinput.value = 16;
            const box = el.getBoundingClientRect();
            widthInput.value = Math.round(box.width);
            heightInput.value = Math.round(box.height);


        }
        else {
            textinput.value = " ";
            colorinput.value = "#000000";
            sizeinput.value = 16;
            imgInput.value = " ";
        }
    });
}

let tbtn = document.querySelector("#tbtn");
tbtn.addEventListener("click", () => {
    const p = document.createElement("p");
    p.innerText = "paragraph";
    makedraggable(p);
    document.querySelector(".canvas").appendChild(p);
});

let ibtn = document.querySelector("#ibtn");
ibtn.addEventListener("click", () => {
    const img = document.createElement("img");
    img.src = "https://www.pixelstalk.net/wp-content/uploads/2016/07/3840x2160-Images-Free-Download.jpg";
    img.style.width = "200px";
    img.style.height = "150px";
    img.style.display = "block";
    img.style.maxWidth = "none";
    img.style.maxHeight = "none";

    makedraggable(img);
    makeResizable(img);
    document.querySelector(".canvas").appendChild(img);
});

let bbtn = document.querySelector("#bbtn");
bbtn.addEventListener("click", () => {
    const btn = document.createElement("button");
    btn.innerText = "Hello";
    makedraggable(btn);
    makeResizable(btn);
    document.querySelector(".canvas").appendChild(btn);
})



const canvas = document.querySelector(".canvas");

canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragged) {
        dragged.style.position = "absolute";
        dragged.style.left = e.offsetX + "px";
        dragged.style.top = e.offsetY + "px";
    }
});


textinput.addEventListener("input", () => {
    if (selectedElement && (selectedElement.tagName === "P" || selectedElement.tagName === "BUTTON")) {
        selectedElement.innerText = textinput.value;
    }
});

colorinput.addEventListener("input", () => {
    if (selectedElement && (selectedElement.tagName === "P" || selectedElement.tagName === "BUTTON")) {
        selectedElement.style.color = colorinput.value;
    }
});

sizeinput.addEventListener("input", () => {
    if (selectedElement && (selectedElement.tagName === "P" || selectedElement.tagName === "BUTTON")) {
        selectedElement.style.fontSize = sizeinput.value + "px";
    }
});

imgInput.addEventListener("input", () => {
    if (selectedElement && selectedElement.tagName === "IMG") {
        selectedElement.src = imgInput.value;
    }
});

download.addEventListener("click", () => {
    const canvascontent = canvas.innerHTML;
    const fullhtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    
    <title>websiteBuilder</title>
</head>
<body>
<div class="canvas">
${canvascontent}
</div>
</body>
</html>`;
    const blob = new Blob([fullhtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my-website.html";
    link.click();

});

deletebtn.addEventListener("click", () => {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        textinput.value = "";
        colorinput.value = "#000000";
        imgInput.value = "";
    }
});

bgcolor.addEventListener("input", () => {
    if (selectedElement) {
        selectedElement.style.backgroundColor = bgcolor.value;
    }
});

widthInput.addEventListener("input", () => {
    if (selectedElement) {
        selectedElement.style.width = widthInput.value + "px";
    }
});

heightInput.addEventListener("input", () => {
    if (selectedElement) {
        selectedElement.style.height = heightInput.value + "px";
    }
});

const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const properties = document.querySelector(".properties");

let toggleState = 0;

hamburger.addEventListener("click", () => {
  toggleState = (toggleState + 1) % 3;

  if (toggleState === 0) {
    sidebar.classList.remove("show");
    properties.classList.remove("show");
  } else if (toggleState === 1) {
    sidebar.classList.add("show");
    properties.classList.remove("show");
  } else {
    sidebar.classList.remove("show");
    properties.classList.add("show");
  }
});
