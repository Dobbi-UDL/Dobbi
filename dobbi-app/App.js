import ExpoRouter from 'expo-router';
import { processMonthlyAutomaticSavings, shouldProcessAutomaticSavings, testAutomaticSavings } from './services/goalService';

export default function App() {
  useEffect(() => {
    const checkAutomaticSavings = async () => {
      const testDate = new Date();
      const targetDate = new Date('2023-12-23T01:13:00');
      
      // Si estamos en modo desarrollo, ejecutar el test
      if (__DEV__) {
        console.log('Modo desarrollo: simulando fecha específica');
        await testAutomaticSavings();
      } else {
        // En producción, usar la fecha real
        if (shouldProcessAutomaticSavings()) {
          await processMonthlyAutomaticSavings();
        }
      }
    };

    // Ejecutar la comprobación cada minuto
    const interval = setInterval(checkAutomaticSavings, 60000);

    // Ejecutar una vez al inicio
    checkAutomaticSavings();

    return () => clearInterval(interval);
  }, []);

  return <ExpoRouter />;
}
