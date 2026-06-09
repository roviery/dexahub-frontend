"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CameraIcon,
  CameraOffIcon,
  CheckIcon,
  Loader2Icon,
  RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onConfirm: (photo: File) => void | Promise<void>;
  isSubmitting: boolean;
}

const CAMERA_ERROR =
  "Camera access is required to check in. Enable it in your browser settings and try again.";

const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: "user" },
  audio: false,
};

export function CameraCapture({ onConfirm, isSubmitting }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const attachStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      attachStream(await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS));
    } catch {
      setError(CAMERA_ERROR);
    }
  }, [attachStream]);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia(VIDEO_CONSTRAINTS)
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        attachStream(stream);
      })
      .catch(() => {
        if (!cancelled) setError(CAMERA_ERROR);
      });

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [attachStream, stopStream]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!previewUrl && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [previewUrl]);

  function capture() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "check-in.jpg", { type: "image/jpeg" });
        setCapturedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.9,
    );
  }

  function retake() {
    setCapturedFile(null);
    setPreviewUrl(null);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed bg-white p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <CameraOffIcon className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Camera unavailable</p>
          <p className="max-w-xs text-sm text-muted-foreground">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={startCamera}
          className="cursor-pointer"
        >
          <CameraIcon className="size-4" />
          Retry camera
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Instruction */}
      {!previewUrl && (
        <p className="text-center text-sm text-muted-foreground">
          Position your face in the frame, then tap the button to capture.
        </p>
      )}

      {/* Camera / preview */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black shadow-sm">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Check-in preview"
            className="h-full w-full -scale-x-100 object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full -scale-x-100 object-cover"
            />
            {/* Face guide oval */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-56 w-44 rounded-full border-2 border-white/40" />
            </div>
            {/* Circular shutter button */}
            <div className="absolute inset-x-0 bottom-5 flex justify-center">
              <button
                onClick={capture}
                aria-label="Capture photo"
                className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/30 transition-transform duration-150 active:scale-95"
              >
                <div className="size-12 rounded-full bg-red-600" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Post-capture actions */}
      {capturedFile && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={retake}
            disabled={isSubmitting}
          >
            <RotateCcwIcon className="size-4" />
            Retake
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => onConfirm(capturedFile)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <CheckIcon className="size-4" />
            )}
            {isSubmitting ? "Checking in…" : "Confirm check-in"}
          </Button>
        </div>
      )}
    </div>
  );
}
