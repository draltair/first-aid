const databaseScores = {
    heart: {
        title: "HEART Score (Dolore Toracico)",
        desc: "Stratificazione del rischio nel dolore toracico",
        items: [
            { label: "Anamnesi", opts: [{v:0, t:"Non specifico (0)"}, {v:1, t:"Moderatamente sospetto (1)"}, {v:2, t:"Altamente sospetto (2)"}] },
            { label: "ECG", opts: [{v:0, t:"Normale (0)"}, {v:1, t:"Anomalia ST/T non specifica (1)"}, {v:2, t:"Slittamento ST significativo (2)"}] },
            { label: "Età", opts: [{v:0, t:"< 45 anni (0)"}, {v:1, t:"45 - 64 anni (1)"}, {v:2, t:">= 65 anni (2)"}] },
            { label: "Fattori di rischio", opts: [{v:0, t:"Nessuno (0)"}, {v:1, t:"1-2 fattori (1)"}, {v:2, t:">= 3 fattori o anamnesi nota (2)"}] },
            { label: "Troponina", opts: [{v:0, t:"<= limite norma (0)"}, {v:1, t:"1-3 volte la norma (1)"}, {v:2, t:"> 3 volte la norma (2)"}] }
        ],
        eval: (tot) => tot <= 3 ? "Rischio basso (MACE 0.9-1.7%) - Dimissione/osservazione" : tot <= 6 ? "Rischio moderato - Valutare ricovero" : "Rischio alto - Consulenza cardiologica urgente"
    },
    curb65: {
        title: "CURB-65 (Polmonite Comunitaria)",
        desc: "Valutazione gravità e sede di cura",
        items: [
            { label: "Confusione mentale", opts: [{v:0, t:"Assente (0)"}, {v:1, t:"Presente (1)"}] },
            { label: "Urea sierica > 7 mmol/L", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "FR >= 30/min", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "PA Sistolica < 90 o Diastolica <= 60", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Età >= 65 anni", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] }
        ],
        eval: (tot) => tot <= 1 ? "Rischio basso - Valutare domicilio" : tot == 2 ? "Rischio moderato - Valutare ricovero" : "Rischio alto - Valutare subintensiva/intensiva"
    },
    gcs: {
        title: "Glasgow Coma Scale (GCS)",
        desc: "Valutazione dello stato di coscienza",
        items: [
            { label: "Apertura degli occhi (E)", opts: [{v:4, t:"Spontanea (4)"}, {v:3, t:"A comando verbale (3)"}, {v:2, t:"Al dolore (2)"}, {v:1, t:"Assente (1)"}] },
            { label: "Risposta verbale (V)", opts: [{v:5, t:"Orientata (5)"}, {v:4, t:"Confusa (4)"}, {v:3, t:"Inappropriata (3)"}, {v:2, t:"Incomprensibile (2)"}, {v:1, t:"Assente (1)"}] },
            { label: "Risposta motoria (M)", opts: [{v:6, t:"Ottempera ai comandi (6)"}, {v:5, t:"Localizza il dolore (5)"}, {v:4, t:"Ritira al dolore (4)"}, {v:3, t:"Flessione anomala (3)"}, {v:2, t:"Estensione (2)"}, {v:1, t:"Assente (1)"}] }
        ],
        eval: (tot) => tot <= 8 ? "Grave compromissione (Coma) - Protezione vie aeree" : tot <= 12 ? "Danno moderato" : "Danno lieve"
    },
    hasbled: {
        title: "HAS-BLED (Rischio emorragico in OAC)",
        desc: "Valutazione del rischio emorragico nei pazienti in terapia anticoagulante",
        items: [
            { label: "Ipertensione", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Funzione renale anormale", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Funzione epatica anormale", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Anamnesi di ictus", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Sanguinamento pregresso", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Labilità INR", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Età > 65 anni", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Farmaci concomitanti", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Uso di alcool", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] }
        ],
        eval: (tot) => tot >= 3 ? "Rischio emorragico ELEVATO ( >= 3 punti)" : "Rischio emorragico basso-moderato"
    }
};

function caricaScore(key) {
    const cfg = databaseScores[key];
    if(!cfg) return alert("Score in caricamento.");
    document.getElementById('score-title').innerText = cfg.title;
    document.getElementById('score-desc').innerText = cfg.desc;
    
    let html = "";
    cfg.items.forEach((it, idx) => {
        html += `<div class="score-row"><label>${it.label}</label><select id="sc-opt-${idx}" onchange="calcolaScoreCorrente('${key}')">`;
        it.opts.forEach(o => { html += `<option value="${o.v}">${o.t}</option>`; });
        html += `</select></div>`;
    });
    document.getElementById('score-inputs').innerHTML = html;
    document.getElementById('score-container').style.display = 'block';
    calcolaScoreCorrente(key);
}

function calcolaScoreCorrente(key) {
    const cfg = databaseScores[key];
    let tot = 0;
    cfg.items.forEach((it, idx) => {
        const sel = document.getElementById(`sc-opt-${idx}`);
        if(sel) tot += parseInt(sel.value) || 0;
    });
    document.getElementById('score-total').innerText = tot;
    document.getElementById('score-interpretation').innerText = cfg.eval(tot);
}
