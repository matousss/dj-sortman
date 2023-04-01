export const getFrequencyGenerator = () => {
    // @ts-ignore
    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    return async (frequency: number, duration: number) => {
        let oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.connect(audioCtx.destination);
        oscillator.start();

        await new Promise(r => setTimeout(r, duration));
        oscillator.stop()

    }

}