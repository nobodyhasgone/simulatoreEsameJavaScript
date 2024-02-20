//carica le domande dal file json

let domande = [];
fetch("/js/testjs.json")
  .then((response) => response.json())
  .then((data) => {
    domande = data;
    mostraDomandaCasuale();
  })
  .catch((error) =>
    console.error("Errore nel caricamento delle domande:", error)
  );

//mostra una domanda casuale

let indiceDomandaCorrente;
let risposteCorrette = 0;
let risposteErrate = 0;
let timer;

function mostraDomandaCasuale() {
  if (!timer) {
    avviaTimer();
  }

  indiceDomandaCorrente = Math.floor(Math.random() * domande.length);
  const domanda = domande[indiceDomandaCorrente];
  document.querySelector(".card-title").textContent = `Domanda ${
    indiceDomandaCorrente + 1
  }`;

  document.querySelector(".card-text").textContent = domanda.domanda;
  impostaOpzioniDiRisposta(domanda);
}

//Impostare le Opzioni di Risposta
function impostaOpzioniDiRisposta(domanda) {
  domanda.opzioni.forEach((opzione, indice) => {
    const bottone = document.querySelector(`#opzione${indice + 1}`);
    bottone.textContent = opzione;
    bottone.onclick = () => verificaRisposta(opzione);
  });
}

//Verificare la Risposta e Aggiornare il Conteggio

function verificaRisposta(scelta) {
  const domanda = domande[indiceDomandaCorrente];
  if (scelta === domanda.rispostaCorretta) {
    alert("La risposta è corretta!");
    risposteCorrette++;
  } else {
    alert("La risposta è errata!");
    risposteErrate++;
  }
  aggiornaConteggi();
  aggiornaProgressBar();
  mostraDomandaCasuale();
}

function aggiornaConteggi() {
  document.querySelector("#total-questions").textContent =
    risposteCorrette + risposteErrate;
  document.querySelector("#correct-answers").textContent = risposteCorrette;
  document.querySelector("#wrong-answers").textContent = risposteErrate;
  aggiornaProgressBar();
}

//Gestire la Barra di Progresso

function aggiornaProgressBar() {
  const percentuale =
    ((risposteCorrette + risposteErrate) / domande.length) * 100;
  document.querySelector("#progress-bar").style.width = `${percentuale}%`;
}

//Gestire il Timer

function avviaTimer() {
  let secondi = 0;
  timer = setInterval(() => {
    secondi++;
    document.querySelector("#timer").textContent = formattaTempo(secondi);
  }, 1000);
}

function formattaTempo(secondi) {
  const ore = Math.floor(secondi / 3600);
  const minuti = Math.floor((secondi % 3600) / 60);
  secondi = secondi % 60;
  return [ore, minuti, secondi].map((v) => (v < 10 ? "0" + v : v)).join(":");
}
