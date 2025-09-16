import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error){
    return { hasError: true, error };
  }
  componentDidCatch(error, info){
    // eslint-disable-next-line no-console
    console.error('UI ErrorBoundary caught:', error, info);
  }
  render(){
    if (this.state.hasError){
      return (
        <div className="card" style={{ margin:16 }}>
          <h3 style={{ marginTop:0 }}>Something went wrong</h3>
          <div style={{ color:'var(--muted)' }}>{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}


