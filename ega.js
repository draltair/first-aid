function calcolaEGA(input) {
    const { ph, paco2, hco3, na, cl, k, lat, pao2, fio2, usaK } = input;
    let reportLines = [];
    reportLines.push("=== REFERTO ANALISI EMOGASANALITICA ===");
    reportLines.push(`Valori -> pH: ${isNaN(ph)?'--':ph}, PaCO2: ${isNaN(paco2)?'--':paco2} mmHg, HCO3: ${isNaN(hco3)?'--':hco3} mmol/L`);
    reportLines.push("");

    let primario = "";
    if (ph < 7.35) {
        primario = (paco2 > 45) ? "Acidosi Respiratoria" : (hco3 < 22) ? "Acidosi Metabolica" : "Acidemia (Mista)";
    } else if (ph > 7.45) {
        primario = (paco2 < 35) ? "Alcalosi Respiratoria" : (hco3 > 26) ? "Alcalosi Metabolica" : "Alcalemia (Mista)";
    } else {
        primario = "pH Normale (possibile disturbo misto o compensato)";
    }
    reportLines.push(`• Disturbo Primario: ${primario}`);

    if (primario.includes("Acidosi Metabolica") && !isNaN(paco2) && !isNaN(hco3)) {
        let paco2Attesa = (1.5 * hco3) + 8;
        let diff = paco2 - paco2Attesa;
        let compenso = Math.abs(diff) <= 2 ? "Compenso respiratorio adeguato." : diff > 2 ? "Sovrapposta Acidosi Respiratoria." : "Sovrapposta Alcalosi Respiratoria.";
        reportLines.push(`• Winter: PaCO2 attesa = ${paco2Attesa.toFixed(1)} mmHg (±2). Rilevata: ${paco2} mmHg. (${compenso})`);
    }

    if (!isNaN(na) && !isNaN(cl) && !isNaN(hco3)) {
        let ag = usaK ? (na + k) - (cl + hco3) : na - (cl + hco3);
        let agNorm = usaK ? 16 : 12;
        let evalAG = ag > (agNorm + 2) ? "Anion Gap ELEVATO" : ag < (agNorm - 2) ? "Anion Gap ridotto" : "Anion Gap Normale";
        reportLines.push(`• Anion Gap: ${ag.toFixed(1)} mmol/L -> ${evalAG}`);
    }

    if (!isNaN(lat)) {
        reportLines.push(`• Lattati: ${lat} mmol/L (${lat > 2.0 ? "Iperlattatemia" : "Nella norma"})`);
    }

    if (!isNaN(pao2) && !isNaN(fio2)) {
        let f = fio2 > 1 ? fio2 / 100 : fio2;
        let pf = pao2 / f;
        reportLines.push(`• Rapporto P/F: ${pf.toFixed(0)} (${pf > 300 ? "Normale/Lieve" : "Moderata/Grave ipossiemia"})`);
    }

    return reportLines.join('\n');
}
