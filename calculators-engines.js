/**
 * Motore universale per i calcolatori clinici
 */
const databaseScores = {
    heart: {
        title: "HEART Score (Dolore Toracico)[span_29](start_span)[span_29](end_span)",
        desc: "Stratificazione del rischio nel dolore toracico[span_30](start_span)[span_30](end_span)",
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
        title: "CURB-65 (Polmonite Comunitaria)[span_31](start_span)[span_31](end_span)[span_32](start_span)[span_32](end_span)",
        desc: "Valutazione gravità e sede di cura[span_33](start_span)[span_33](end_span)[span_34](start_span)[span_34](end_span)",
        items: [
            { label: "Confusione mentale", opts: [{v:0, t:"Assente (0)"}, {v:1, t:"Presente (1)"}] },
            { label: "Urea sierica > 7 mmol/L", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "FR >= 30/min", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "PA Sistolica < 90 o Diastolica <= 60", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] },
            { label: "Età >= 65 anni", opts: [{v:0, t:"No (0)"}, {v:1, t:"Sì (1)"}] }
        ],
        eval: (tot) => tot <= 1 ? "Rischio basso - Valutare domicilio" : tot == 2 ? "Rischio moderato - Valutare ricovero" : "Rischio alto - Valutare subintensiva/intensiva"
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
