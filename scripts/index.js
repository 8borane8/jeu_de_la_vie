// Initialisation des variables système
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const buttonToogle = document.getElementById("button-toogle");
const buttonRegen = document.getElementById("button-regen");
const buttonSettings = document.querySelector("#settings > input");

const labelIteration = document.getElementById("label-iteration");

let isStart = false;
let iteration = 0;


// Initialisation des variables de paramètres
let rows = 25;
let columns = 25;
let probability = 0.3;
let speed = 1000;

// Génération d'une configuration de base
let array = generateRandomConfiguration();
drawCanvas();


function generateRandomConfiguration() {
    // Création d'un array avec que des zéros
    const array = new Array(rows * columns).fill(0);
    for (let i = 0; i < array.length; i++) {
        // Remplacement 
        if (Math.random() < probability) { array[i] = 1; }
    }
    return array;
}


buttonToogle.addEventListener("click", function(){
    isStart = !isStart;

    if(isStart){
        buttonToogle.textContent = "Stoper";
        buttonRegen.setAttribute("disabled", "");
        buttonSettings.setAttribute("disabled", "");
    }else{
        buttonToogle.textContent = "Démarrer";
        buttonRegen.removeAttribute("disabled");
        buttonSettings.removeAttribute("disabled");
    }
});

buttonRegen.addEventListener("click", function(){
    // Génération d'une configuration de base
    array = generateRandomConfiguration();
    drawCanvas();

    // Remise à zero du compteur d'itérations
    iteration = 0;
    labelIteration.textContent = 0;
});

document.querySelectorAll("#settings > div > div > input").forEach(function(input){
    
    // Empeche l'ajout d'un caractère qui n'est pas un chiffre
    input.addEventListener("keypress", function(event){
        if(!/[^0-9]/.test(event.key)){ return; }
        event.preventDefault();
    });
});

document.getElementById("settings").addEventListener("submit", function(event){
    event.preventDefault();

    // Mise à jour des variables
    canvas.width = parseInt(document.querySelector("#settings input[name='canvas-width']").value);
    canvas.height = parseInt(document.querySelector("#settings input[name='canvas-height']").value);

    rows = parseInt(document.querySelector("#settings input[name='rows']").value);
    columns = parseInt(document.querySelector("#settings input[name='columns']").value);
    probability = parseInt(document.querySelector("#settings input[name='probability']").value) / 100;
    speed = parseInt(document.querySelector("#settings input[name='speed']").value);

    // Génération d'une configuration de base
    array = generateRandomConfiguration();
    drawCanvas();

    // Remise à zero du compteur d'itérations
    iteration = 0;
    labelIteration.textContent = 0;

    // Lancement de la mainloop avec la nouvelle vitesse
    clearInterval(interval)
    interval = setInterval(mainloop, speed);
});



function drawCanvas() {
    // Efface tout le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuration des couleurs
    ctx.strokeStyle = "#64626c";
    ctx.fillStyle = "#2d0caa";

    // Calcul la taille d'une cellule
    const cellWidth = canvas.width / columns;
    const cellHeight = canvas.height / rows;

    // Affiche les cellules vivantes
    for (let i = 0; i < array.length; i++) {
        if (!array[i]) { continue; }
        ctx.fillRect(i % rows * cellWidth, Math.floor(i / rows) * cellHeight, cellWidth + 1, cellHeight + 1);
    }

    // Affiche le cadriage horizontalement
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight + 0.5);
        ctx.lineTo(canvas.width, i * cellHeight + 0.5);
        ctx.stroke();
        
    }

    // Affiche le cadriage verticalement
    for (let i = 0; i <= columns; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth + 0.5, 0);
        ctx.lineTo(i * cellWidth + 0.5, canvas.height);
        ctx.stroke();
    }
}

function getLivingNeighboringCells(i) {
    let livingNeighboringCells = 0;
    const row = Math.floor(i / rows);
    const column = i % rows;

    for (let j = Math.max(0, row - 1); j < Math.min(rows, row + 2); j++) {
        for (let k = Math.max(0, column - 1); k < Math.min(columns, column + 2); k++) {
            if (j == row && k == column) { continue; }

            if (array[j * rows + k] == 1) {
                livingNeighboringCells += 1;
            }
        }
    }

    return livingNeighboringCells;
}

function mainloop(){
    if(!isStart){ return; }

    // création d'une copie de l'array de base
    const newarray = structuredClone(array);

    // iteration de chaque cellules
    for (let i = 0; i < array.length; i++) {
        // récupération du nombre de cellules voisines mortes
        const livingNeighboringCells = getLivingNeighboringCells(i);

        // Application des règles élémentaires
        if (array[i] === 1 && [2, 3].includes(livingNeighboringCells)) { continue; }
        if (array[i] === 0 && livingNeighboringCells === 3) {
            newarray[i] = 1;
            continue;
        }

        newarray[i] = 0;
    }

    // Mise a jour de l'array
    array = newarray;
    drawCanvas();

    // Mise à jour du compteur d'itérations
    iteration += 1;
    labelIteration.textContent = iteration;
}

// Lancement de la mainloop
let interval = setInterval(mainloop, speed);