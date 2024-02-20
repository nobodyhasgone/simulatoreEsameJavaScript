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
let risposteErrate = 0; // Assicurati che questa sia definita
let timer;
let domandeMostrate = [];

function mostraDomandaCasuale() {
  if (!timer) {
    avviaTimer();
  }

  if (domandeMostrate.length === domande.length) {
    alert("Tutte le domande sono state mostrate. Il gioco è finito!");
    clearInterval(timer); // Opzionale: ferma il timer
    return; // Qui puoi gestire cosa fare quando il gioco è finito
  }

  do {
    indiceDomandaCorrente = Math.floor(Math.random() * domande.length);
  } while (domandeMostrate.includes(indiceDomandaCorrente));

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
  // Usa trim() e toLowerCase() per standardizzare il confronto
  if (
    scelta.trim().toLowerCase() ===
    domanda.rispostaCorretta.trim().toLowerCase()
  ) {
    alert("La risposta è corretta!");
    risposteCorrette++;
  } else {
    alert("La risposta è errata!");
    risposteErrate++;
  }

  domandeMostrate.push(indiceDomandaCorrente);
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

document.getElementById("reset-button").addEventListener("click", resetQuiz);

function resetQuiz() {
  // Reset delle variabili di stato
  domandeMostrate = [];
  risposteCorrette = 0;
  risposteErrate = 0;
  clearInterval(timer); // Se hai un timer
  timer = null;

  // Aggiorna UI
  aggiornaConteggi();
  // Riavvia il quiz
  mostraDomandaCasuale();
}
