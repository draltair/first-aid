/**
 * Modulo Arrest Coach per Rianimazione
 */
class ResusCoachMini {
    constructor() {
        this.sec = 0; this.cycle = 120; this.timer = null; this.adren = 0;
    }
    start() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.sec++;
            if (this.cycle > 0) this.cycle--; else this.cycle = 120;
            const m = Math.floor(this.sec / 60).toString().padStart(2, '0');
            const s = (this.sec % 60).toString().padStart(2, '0');
            const cm = Math.floor(this.cycle / 60).toString().padStart(2, '0');
            const cs = (this.cycle % 60).toString().padStart(2, '0');
            
            const elTot = document.getElementById('tot-timer');
            const elCy = document.getElementById('cycle-timer');
            if(elTot) elTot.innerText = `TOT ${m}:${s}`;
            if(elCy) elCy.innerText = `${cm}:${cs}`;
        }, 1000);
    }
    pause() { clearInterval(this.timer); this.timer = null; }
    somministraAdrenalina() { this.adren++; document.getElementById('adren-counter').innerText = `${this.adren} mg`; }
    registraShock() { alert("Shock registrato!"); }
    registraEvento(msg) { alert("Evento registrato: " + msg); }
}
const resus = new ResusCoachMini();
