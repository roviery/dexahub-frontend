"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CameraIcon,
  CameraOffIcon,
  Loader2Icon,
  RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onConfirm: (photo: File) => void | Promise<void>;
  isSubmitting: boolean;
}

const CAMERA_ERROR =
  "Camera access is required to check in. Enable it in your browser and try again.";

const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: "user" },
  audio: false,
};

/**
 * Opens the front camera, lets the employee snap a selfie, preview it, and
 * either retake or confirm. The confirmed frame is handed up as a JPEG File.
 */
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

  // Manual retry from the error state.
  const startCamera = useCallback(async () => {
    try {
      attachStream(await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS));
    } catch {
      setError(CAMERA_ERROR);
    }
  }, [attachStream]);

  // Acquire the camera on mount. setState only runs inside the async callbacks
  // (after the await), never synchronously in the effect body.
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

  // Revoke the object URL when the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
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
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-8 text-center">
        <CameraOffIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={startCamera}>
          <CameraIcon />
          Retry camera
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Check-in preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full -scale-x-100 object-cover"
          />
        )}
      </div>

      {capturedFile ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={retake}
            disabled={isSubmitting}
          >
            <RotateCcwIcon />
            Retake
          </Button>
          <Button
            className="flex-1"
            onClick={() => onConfirm(capturedFile)}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
            Confirm check-in
          </Button>
        </div>
      ) : (
        <Button size="lg" onClick={capture}>
          <CameraIcon />
          Capture photo
        </Button>
      )}
    </div>
  );
}
