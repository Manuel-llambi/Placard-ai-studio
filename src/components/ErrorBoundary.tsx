import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore third-party extension errors like MetaMask
    if (error?.message?.includes('MetaMask') || error?.message?.includes('ethereum')) {
      this.setState({ hasError: false, error: null });
      return;
    }
    console.warn('Caught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F1EA] text-[#2B2420] flex items-center justify-center p-5">
          <div className="max-w-sm w-full bg-[#FAF7F2] p-6 rounded-[20px] border border-[#DCD2C4] shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-[#ECE4DA] text-[#7A4655] flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-[20px] font-semibold text-[#2B2420] mb-2">
              Algo inesperado ocurrió
            </h2>
            <p className="text-[13px] text-[#75695E] mb-5 leading-relaxed">
              Ocurrió un error temporal al cargar la vista. Podés reintentar para continuar usando Placard.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-[14px] bg-[#7A4655] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#693846] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar aplicación</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

