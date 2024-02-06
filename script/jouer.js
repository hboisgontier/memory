const plateau = document.getElementById('plateau');
const carteTemplate = document.getElementById('carteTemplate');
const message = document.getElementById('message');
const victoire = document.getElementById('victoire');
const nouvellePartie = document.getElementById('nouvellePartie');
const inputTotalPaires = document.getElementById('totalPaires');
const alternativesTextuelles = ['fraise', 'pomme', 'banane', 'brocoli', 'cerise', 'piment'];

nouvellePartie.onclick = init;
let carteDevoilee1;
let carteDevoilee2;
let totalPaires;
let nbPaires;
let nbCoups;
let cartes;
init();

let androidLinux = null;
if(navigator.userAgent.match(/Android|Linux/) !== null) {
    androidLinux = document.createElement('div');
    androidLinux.id = 'androidLinux';
    androidLinux.setAttribute('aria-live', 'polite');
    document.querySelector('body').appendChild(androidLinux);
}

function init() {
    message.innerHTML = '';
    plateau.innerHTML = '';
    victoire.innerHTML = '';
    totalPaires=Number(inputTotalPaires.value);
    nbCoups=0;
    nbPaires=0;
    carteDevoilee1 = null;
    carteDevoilee2 = null;
    // construit un tableau avec le numéro de chaque carte présent 2 fois positionné aléatoirement
    // exemple : [ 5, 0, 1, 0, 2, 3, 2, 3, 4, 5, 4, 1 ]
    cartes = [0, 0];
    for(let i=1; i<totalPaires; i++) {
        cartes.splice(getRandomInt(cartes.length+1), 0, i);
        cartes.splice(getRandomInt(cartes.length+1), 0, i);
    }

    // création du plateau de jeu
    for(let i=0; i<totalPaires*2; i++) {
        let templateCarte = document.importNode(carteTemplate.content, true);
        let carte = templateCarte.firstElementChild;
        carte.setAttribute('alt', 'carte inconnue en position '+(i+1));
        carte.id = i;
        carte.onclick = devoiler;
        plateau.appendChild(templateCarte);
    }
}

// clic sur une carte
function devoiler() {
    // si deux cartes n'ont pas déjà été dévoilées par le joueur pour ce tour de jeu
    if(carteDevoilee1 === null || carteDevoilee2 === null) {
        let pos = this.id;
        if(this.getAttribute('src') === 'ressources/dos.svg') {
            // dévoiler la carte
            this.setAttribute('src', 'ressources/memory-legume/' + cartes[pos] + '.svg');
            this.setAttribute('alt', alternativesTextuelles[cartes[pos]]);
            if(androidLinux!=null)
                androidLinux.innerText = alternativesTextuelles[cartes[pos]];
            if(carteDevoilee1 == null) {
                carteDevoilee1 = this;
            } else if(this.id !== carteDevoilee1.id) {
                nbCoups++;
                if(cartes[pos]===cartes[carteDevoilee1.id]) {
                    nbPaires++;
                    setTimeout(afficher, 50);
                    carteDevoilee1 = null;
                    carteDevoilee2 = null;
                } else {
                    carteDevoilee2 = this;
                    setTimeout(retourner, 2000);
                }
            }
        }
    }
}

// remettre les cartes faces cachées
function retourner() {
    cacher(carteDevoilee1);
    cacher(carteDevoilee2);
    carteDevoilee1 = null;
    carteDevoilee2 = null;
}

function cacher(carte) {
    carte.setAttribute('src', 'ressources/dos.svg');
    carte.setAttribute('alt', 'carte inconnue en position '+(1+parseInt(carte.id)));
    if(androidLinux!=null)
        androidLinux.innerText = '';
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function afficher() {
    message.innerText = nbPaires + ' sur ' + totalPaires + ' paires';
    if(nbPaires === totalPaires) {
        setTimeout(() => {
            victoire.innerHTML = 'Vous avez gagné en ' + nbCoups + ' coups';
        }, 50);
        setTimeout(() => {
            nouvellePartie.focus();
        }, 100);
    }
}