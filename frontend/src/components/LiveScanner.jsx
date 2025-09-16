import { useEffect, useRef, useState } from "react";

export default function LiveScanner({ onCaptured }){
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState("");

  const stopStream = () => {
    if (stream) stream.getTracks().forEach(t=>t.stop());
    setStream(null);
  };

  const startStream = async () => {
    try{
      const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' } });
      setStream(s);
      if (videoRef.current){
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    }catch(err){ setError('Camera access denied'); }
  };

  useEffect(()=>{
    startStream();
    return ()=>{ stopStream(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = async () => {
    if (!videoRef.current || busy) return;
    setBusy(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSnapshot(dataUrl);
    stopStream();
    setBusy(false);
  };

  const accept = () => {
    if (snapshot) onCaptured?.(snapshot);
  };

  const rescan = async () => {
    setSnapshot("");
    await startStream();
  };

  return (
    <div className="scan-preview">
      {!snapshot && (
        <>
          <video ref={videoRef} className="scan-video" muted playsInline />
          <div className="scan-frame" />
          {error && <div style={{ color:'var(--danger)', marginTop:8 }}>{error}</div>}
          <div className="scan-controls">
            <button className="btn" onClick={capture} disabled={busy}>Capture</button>
          </div>
        </>
      )}
      {snapshot && (
        <div>
          <img src={snapshot} alt="Captured ID" style={{ width:'100%', borderRadius:12 }} />
          <div className="scan-controls">
            <button className="btn" onClick={accept}>Accept</button>
            <button className="btn secondary" onClick={rescan}>Rescan</button>
          </div>
        </div>
      )}
    </div>
  );
}


