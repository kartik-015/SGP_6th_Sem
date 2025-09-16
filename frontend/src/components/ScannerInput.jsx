import { useEffect, useState } from "react";
let QrBarcodeScannerComp = null;
// Dynamically import to avoid SSR/DOM availability issues
async function loadScanner(){
  if (!QrBarcodeScannerComp){
    const mod = await import("react-qr-barcode-scanner");
    QrBarcodeScannerComp = mod.QrBarcodeScanner || mod.default || null;
  }
  return QrBarcodeScannerComp;
}

export default function ScannerInput({ onScan, allowManual = true }) {
  const [error, setError] = useState(null);
  const [manual, setManual] = useState("");
  const [Scanner, setScanner] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadScanner().then((Comp) => { if (mounted) setScanner(()=>Comp); });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 8, color: 'var(--muted)' }}>Allow camera access to scan the student ID barcode, or enter ID manually.</div>
      {Scanner && (
      <Scanner
        onUpdate={(err, result) => {
          if (err) {
            setError(err?.message || "Scan error");
            return;
          }
          if (result) {
            setError(null);
            onScan?.(result?.text || "");
          }
        }}
        constraints={{ facingMode: "environment" }}
        style={{ width: 320, maxWidth:'100%' }}
      />)}
      {!Scanner && <div className="card" style={{ padding:12 }}>Initializing camera...</div>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {allowManual && (
        <div className="row" style={{ gap:8, marginTop:8, alignItems:'center' }}>
          <input className="input" placeholder="Enter Student ID (barcode value)" value={manual} onChange={(e)=>setManual(e.target.value)} />
          <button className="btn" onClick={()=> manual && onScan?.(manual)}>Submit</button>
        </div>
      )}
      <div style={{ marginTop:8, padding:8, background:'#f0f9ff', borderRadius:8, fontSize:12, color:'#0369a1' }}>
        Position the barcode within the camera view. The scanner will detect it automatically.
      </div>
    </div>
  );
}


