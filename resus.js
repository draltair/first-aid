/**
 * Modulo Resus PRO / Arrest Coach Avanzato
 * Gestione cicli, farmaci ACLS, timer Adrenalina e Log Eventi
 */

class ResusProEngine {
    constructor() {
        this.totalSeconds = 0;
        this.cycleSeconds = 120; // 2 minuti per ciclo RCP
        this.adrenTimerSeconds = 0; // Timer per la prossima dose di Adrenalina (3-5 min)
        this.timerInterval = null;
        this.isRunning = false;

        this.state = {
            ritmo: "Non ancora analizzato",
            shockCount: 0,
            adrenalinaCount: 0,
            amiodaroneTotal: 0,
            eventiLog: []
        };
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            this.totalSeconds++;
            this.adrenTimerSeconds++;

            // Countdown ciclo 2 minuti
            if (this.cycleSeconds > 0) {
                this.cycleSeconds--;
            } else {
                this.triggerAlert("⚠️ Fine ciclo 2 minuti: Controllare ritmo e polso!");
                this.cycleSeconds = 120;
            }

            // Promemoria Adrenalina (ogni 4 minuti / 240 secondi)
            if (this.adrenTimerSeconds >= 240 && this.state.adrenalinaCount > 0) {
                this.triggerAlert("🔔 È ora di valutare la seconda/successiva dose di Adrenalina 1 mg!");
            }

            this.updateDisplay();
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
    }

    reset() {
        this.pause();
        this.totalSeconds = 0;
        this.cycleSeconds = 120;
        this.adrenTimerSeconds = 0;
        this.state = {
            ritmo: "Non ancora analizzato",
            shockCount: 0,
            adrenalinaCount: 0,
            amiodaroneTotal: 0,
            eventiLog: []
        };
        this.registrataEvento("Reset della rianimazione avviato.");
        this.updateDisplay();
    }

    impostaRitmo(ritmo) {
        this.state.ritmo = ritmo;
        document.getElementById('ritmo-status').innerText = `RITMO: ${ritmo.toUpperCase()}`;
        this.registrataEvento(`Rilevato ritmo: ${ritmo}`);
    }

    registraShock() {
        this.state.shockCount++;
        this.cycleSeconds = 120; // Reset ciclo sui 2 min dopo lo shock
        this.registrataEvento(`⚡ Shock erogato #${this.state.shockCount}`);
        this.updateDisplay();
    }

    somministraAdrenalina() {
        this.state.adrenalinaCount++;
        this.adrenTimerSeconds = 0; // Reset timer adrenalina
        this.registrataEvento(`💊 Somministrata Adrenalina 1 mg (Tot: ${this.state.adrenalinaCount} mg)`);
        this.updateDisplay();
    }

    somministraAmiodarone(mg) {
        this.state.amiodaroneTotal += mg;
        this.registrataEvento(`💊 Somministrato Amiodarone ${mg} mg (Tot: ${this.state.amiodaroneTotal} mg)`);
        this.updateDisplay();
    }

    registrataEvento(desc) {
        const m = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
        const s = (this.totalSeconds % 60).toString().padStart(2, '0');
        const timestamp = `${m}:${s}`;
        this.state.eventiLog.unshift({ time: timestamp, text: desc });
        this.aggiornaListaLog();
    }

    formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    updateDisplay() {
        const elTot = document.getElementById('tot-timer');
        const elCycle = document.getElementById('cycle-timer');
        const elShock = document.getElementById('shock-counter');
        const elAdren = document.getElementById('adren-counter');
        const elAmio = document.getElementById('amio-counter');

        if (elTot) elTot.innerText = `TOT ${this.formatTime(this.totalSeconds)}`;
        if (elCycle) elCycle.innerText = this.formatTime(this.cycleSeconds);
        if (elShock) elShock.innerText = this.state.shockCount;
        if (elAdren) elAdren.innerText = `${this.state.adrenalinaCount} mg`;
        if (elAmio) elAmio.innerText = `${this.state.amiodaroneTotal} mg`;
    }

    aggiornaListaLog() {
        const container = document.getElementById('resus-log-list');
        if (!container) return;
        container.innerHTML = this.state.eventiLog
            .map(ev => `<div style="font-size: 0.8rem; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);"><span style="color:var(--accent); font-weight:bold;">[${ev.time}]</span> ${ev.text}</div>`)
            .join('');
    }

    triggerAlert(msg) {
        if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
        console.warn(msg);
    }
}

const resus = new ResusProEngine();
