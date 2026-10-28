import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import io
import wave
import struct
import difflib
import time
import subprocess
import speech_recognition as sr

def convert_to_wav(mp3_path, wav_path):
    cmd = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        "-y",
        "-i", mp3_path,
        "-ac", "1",
        "-ar", "16000",
        "-f", "wav",
        wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

def merge_chunks(accumulated_text, new_text):
    if not accumulated_text.strip():
        return new_text.strip()
    if not new_text.strip():
        return accumulated_text.strip()
        
    w1 = accumulated_text.strip().split()
    w2 = new_text.strip().split()
    
    tail_len = min(25, len(w1))
    head_len = min(25, len(w2))
    
    def norm(w):
        return w.lower().replace('-', '').replace('whatsappএ', 'whatsapp').replace('হোয়াটসঅ্যাপে', 'whatsapp')

    tail = [norm(w) for w in w1[-tail_len:]]
    head = [norm(w) for w in w2[:head_len]]
    
    sm = difflib.SequenceMatcher(None, tail, head)
    match = sm.find_longest_match(0, len(tail), 0, len(head))
    
    if match.size >= 2:
        # Cut w1 right where match starts, then append w2 from match.b
        cut_w1 = w1[: len(w1) - tail_len + match.a]
        cut_w2 = w2[match.b :]
        return " ".join(cut_w1 + cut_w2)
    else:
        # Fallback: simple join if no clear overlap found
        return accumulated_text.strip() + " " + new_text.strip()

def transcribe_file(mp3_path, output_txt_path):
    temp_wav = r"C:\Users\ashra\AppData\Local\Temp\chatbook_16k.wav"
    if not os.path.exists(temp_wav):
        print("Converting mp3 to 16kHz WAV...")
        convert_to_wav(mp3_path, temp_wav)
        
    print("Reading WAV file...")
    with wave.open(temp_wav, 'rb') as w:
        framerate = w.getframerate()
        n_frames = w.getnframes()
        raw_bytes = w.readframes(n_frames)
        samples = struct.unpack(f"<{n_frames}h", raw_bytes)
        
    total_seconds = len(samples) / framerate
    print(f"Total audio length: {total_seconds:.2f}s ({total_seconds/60:.2f} mins)")
    
    # Chunking parameters
    chunk_dur = 26.0
    overlap = 4.0
    step = chunk_dur - overlap # 22.0s
    
    r = sr.Recognizer()
    
    chunks = []
    curr = 0.0
    while curr < total_seconds:
        t_end = min(curr + chunk_dur, total_seconds)
        chunks.append((curr, t_end))
        if t_end >= total_seconds:
            break
        curr += step
        
    print(f"Total chunks to transcribe: {len(chunks)}")
    
    full_text = ""
    chunk_results = []
    
    for idx, (t_start, t_end) in enumerate(chunks):
        s1 = int(t_start * framerate)
        s2 = int(t_end * framerate)
        chunk_samples = samples[s1:s2]
        chunk_bytes = struct.pack(f"<{len(chunk_samples)}h", *chunk_samples)
        
        bio = io.BytesIO()
        with wave.open(bio, 'wb') as cw:
            cw.setnchannels(1)
            cw.setsampwidth(2)
            cw.setframerate(framerate)
            cw.writeframes(chunk_bytes)
        bio.seek(0)
        
        with sr.AudioFile(bio) as source:
            audio_data = r.record(source)
            
        chunk_txt = ""
        # Retry logic
        for attempt in range(3):
            try:
                chunk_txt = r.recognize_google(audio_data, language='bn-BD')
                break
            except sr.UnknownValueError:
                # Speech was unintelligible or silence
                chunk_txt = ""
                break
            except Exception as e:
                time.sleep(1.5)
                if attempt == 2:
                    print(f"Error on chunk {idx+1}: {e}")
                    
        print(f"[{idx+1}/{len(chunks)}] ({t_start:.1f}s - {t_end:.1f}s): {chunk_txt[:60]}...")
        chunk_results.append((t_start, t_end, chunk_txt))
        full_text = merge_chunks(full_text, chunk_txt)
        time.sleep(0.3) # prevent aggressive rate limiting
        
    # Write output to file
    with open(output_txt_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
        
    print("\n--- Transcription Completed Successfully! ---")
    print(f"Saved to: {output_txt_path}")
    print(f"Total words: {len(full_text.split())}")

if __name__ == "__main__":
    mp3 = r"C:\Users\ashra\Downloads\Music\chatbook.mp3"
    out = r"C:\Users\ashra\Downloads\Music\chatbook_transcript.txt"
    transcribe_file(mp3, out)
