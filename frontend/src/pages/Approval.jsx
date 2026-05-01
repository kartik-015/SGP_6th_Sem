import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApproval, decideApproval } from '../api/approvals.js';
import { toast } from 'react-toastify';

export default function ApprovalPage(){
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(()=>{
    (async()=>{
      try{
        const res = await getApproval(token);
        setData(res?.data || res);
      }catch(err){ /* toast handled globally */ }
      setLoading(false);
    })();
  }, [token]);

  const decide = async (decision)=>{
    setBusy(true);
    try{
      const res = await decideApproval(token, decision);
      toast.success(`Request ${decision}`);
      setData(prev => ({ ...prev, data: { ...prev?.data, approval: res?.data?.approval || prev?.data?.approval } }));
    }catch(e){}
    setBusy(false);
  };

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  const approval = data?.approval || data?.data?.approval;
  const expired = data?.expired || data?.data?.expired;
  if (!approval) return <div className="container"><div className="card">Invalid link</div></div>;

  return (
    <div className="container">
      <div className="topbar"><h2 style={{margin:0}}>Borrow Approval</h2></div>
      <div className="card">
        <p>Status: <strong>{approval.status}</strong>{expired? ' (expired)':''}</p>
        <div className="row" style={{ gap:8 }}>
          <button className="btn" disabled={busy||expired||approval.status!=='pending'} onClick={()=>decide('approved')}>Approve</button>
          <button className="btn secondary" disabled={busy||expired||approval.status!=='pending'} onClick={()=>decide('rejected')}>Reject</button>
        </div>
      </div>
    </div>
  );
}
