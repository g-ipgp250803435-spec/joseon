/** Optional original atmospheric soundscape, generated locally by Web Audio.
 * No external files, network requests, voice, or copyrighted music.
 * Playback begins ONLY after a user gesture and is muted by default.
 */
let context: AudioContext | null = null
let source: AudioBufferSourceNode | null = null
let gain: GainNode | null = null

export async function setAmbience(enabled: boolean): Promise<boolean> {
  if (!enabled) {
    try { source?.stop(); source?.disconnect(); await context?.suspend() } catch { /* already stopped */ }
    source = null
    return false
  }
  try {
    if (!context) context = new AudioContext()
    await context.resume()
    if (source) return true
    // Deterministic smooth noise with no pitched melody or imported sample.
    const length = Math.floor(context.sampleRate * 3)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const samples = buffer.getChannelData(0)
    let acc = 0, seed = 7219
    for (let i = 0; i < length; i++) {
      seed = (seed * 16807) % 2147483647
      const white = (seed / 2147483647) * 2 - 1
      acc = (acc + 0.027 * white) / 1.027
      samples[i] = acc * 2.3
    }
    source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const lowpass = context.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 360
    gain = context.createGain()
    gain.gain.value = 0.12
    source.connect(lowpass).connect(gain).connect(context.destination)
    source.start()
    return true
  } catch { return false }
}
