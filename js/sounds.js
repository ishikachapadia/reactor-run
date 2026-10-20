const heroStepSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 1,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
}).toDestination();
export function playHeroMoveSound() {
    heroStepSynth.triggerAttackRelease("C2", "16n");
}

const heroDeathSynth = new Tone.MembraneSynth({
    pitchDecay: 0.1,
    octaves: 2,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.2 }
}).toDestination();
export function playHeroDeathSound() {
    heroDeathSynth.triggerAttackRelease("C3", "8n");
    setTimeout(() => heroDeathSynth.triggerAttackRelease("A2", "8n"), 100);
    setTimeout(() => heroDeathSynth.triggerAttackRelease("F2", "8n"), 200);
}

const enemyMoveSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 1,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.05 }
}).toDestination();
export function playEnemyMoveSound() {
    enemyMoveSynth.triggerAttackRelease("G2", "16n");
}

const monsterScreamSynth = new Tone.FMSynth({
    harmonicity: 0.5,
    modulationIndex: 15,
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.05, decay: 0.7, sustain: 0.1, release: 2 },
    modulation: { type: "square" },
    modulationEnvelope: { attack: 0.05, decay: 0.4, sustain: 0, release: 0.7 }
}).toDestination();
export function tryMonsterScream() {
    if (Math.random() < 0.15) { 
        const now = Tone.now();
        const baseNote = Math.floor(Math.random() * (50 - 40 + 1)) + 40; 
        const noteWithWobble = baseNote + (Math.random() * 4 - 2);

        monsterScreamSynth.frequency.setValueAtTime(Tone.Frequency(noteWithWobble, "midi"), now);
        monsterScreamSynth.triggerAttackRelease(Tone.Frequency(noteWithWobble, "midi"), "1n", now);
    }
}

// ! Background Music Setup
const effect1 = new Tone.Reverb({ decay: 5, wet: 0.6 });
const effect2 = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.5, wet: 0.4 });
const effect3 = new Tone.Distortion(0.2);

const musicVolume = new Tone.Volume(0).toDestination(); 

const mainSound1 = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 3, decay: 1, sustain: 0.6, release: 5 }
}).connect(musicVolume); 

const mainSound2 = new Tone.MonoSynth({
    oscillator: { type: "fmsquare", modulationType: "sawtooth" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 1 },
    modulation: { type: "sine" },
    modulationEnvelope: { attack: 0.05, decay: 0.2, sustain: 0, release: 0.3 }
});

mainSound2.chain(effect1, effect2, effect3, musicVolume);

mainSound1.triggerAttack("C2");

const notes = ["C4", "D#4", "F4", "G#4", "G#4", "A4"];
Tone.Transport.scheduleRepeat((time) => {
    const note = notes[Math.floor(Math.random() * notes.length)];
    mainSound2.detune.value = (Math.random() - 0.5) * 100;
    mainSound2.triggerAttackRelease(note, "16n", time);
}, "4n");

Tone.Transport.start();

let isMusicMuted = false;
export function setupMusicButton() {
    const musicButton = document.createElement("button");
    musicButton.textContent = "Mute Music";
    musicButton.style.position = "fixed";
    musicButton.style.top = "20px";
    musicButton.style.right = "20px";
    musicButton.style.zIndex = 1000;
    document.body.appendChild(musicButton);

    musicButton.addEventListener("click", () => {
        isMusicMuted = !isMusicMuted;
        musicVolume.mute = isMusicMuted; 
        musicButton.textContent = isMusicMuted ? "Unmute Music" : "Mute Music";
    });
}