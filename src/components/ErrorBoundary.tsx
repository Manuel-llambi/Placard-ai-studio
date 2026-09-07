import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <AlertCircle size={24} color="#7A4655" />
            </View>
            <Text style={styles.title}>
              Algo inesperado ocurrió
            </Text>
            <Text style={styles.description}>
              Ocurrió un error temporal al cargar la vista. Podés reintentar para continuar usando Placard.
            </Text>
            <TouchableOpacity
              onPress={this.handleReset}
              activeOpacity={0.85}
              style={styles.resetButton}
            >
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>Recargar aplicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100vh' as any,
    backgroundColor: '#F6F1EA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  card: {
    maxWidth: 384,
    width: '100%',
    backgroundColor: '#FAF7F2',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCD2C4',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECE4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: '600',
    color: '#2B2420',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#75695E',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});
