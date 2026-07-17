"use client";

import { useRef, useState, useCallback } from "react";

interface UseRecordingReturn {
  recording: boolean;
  seconds: number;
  audioUrl: string | null;
  audioBlob: Blob | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useRecording(): UseRecordingReturn {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunks = useRef<Blob[]>([]);

  const reset = useCallback(() => {
    setRecording(false);
    setSeconds(0);
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = mediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm" });
      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        mediaStream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.onerror = () => {
        setError("Recording failed. Please try again.");
        reset();
      };
      recorder.current = mediaRecorder;
      setSeconds(0);
      setAudioUrl(null);
      setAudioBlob(null);
      setError(null);
      mediaRecorder.start(200);
      setRecording(true);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone access is required to record a contribution.");
    }
  }, [reset]);

  const stop = useCallback(() => {
    recorder.current?.stop();
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRecording(false);
  }, []);

  return { recording, seconds, audioUrl, audioBlob, error, start, stop, reset };
}
