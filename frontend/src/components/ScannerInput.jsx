import { useState } from "react";
import { QrBarcodeScanner } from "react-qr-barcode-scanner";

export default function ScannerInput({ onScan }) {
  const [error, setError] = useState(null);

  return (
    <div>
      <QrBarcodeScanner
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
        style={{ width: 320 }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}


