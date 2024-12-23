export const calculateGoalMetrics = (targetAmount, monthlySaving) => {
    // Calculamos el número de meses necesarios
    const months = Math.ceil(targetAmount / monthlySaving);
    
    // Calculamos la fecha estimada de finalización
    const estimatedEndDate = new Date();
    estimatedEndDate.setMonth(estimatedEndDate.getMonth() + months);

    // Sistema de puntos inverso: más puntos para objetivos más cortos
    // Base de puntos: 1000 puntos máximo
    const basePoints = 1000;
    
    // Factor de tiempo: decrece exponencialmente con el número de meses
    // Para 1 mes: 1.0
    // Para 12 meses: 0.3
    // Para 24 meses: 0.1
    const timeMultiplier = Math.exp(-0.1 * months);

    // Factor de cantidad: aumenta logarítmicamente con el monto
    // Para €100: 0.6
    // Para €1000: 0.8
    // Para €10000: 1.0
    const amountMultiplier = Math.min(Math.log10(targetAmount) / 4, 1);

    // Cálculo de puntos base
    const rawPoints = Math.round(basePoints * timeMultiplier * amountMultiplier);
    
    // Redondear a múltiplos de 5 (usando Math.ceil para redondear hacia arriba)
    const points = Math.ceil(rawPoints / 5) * 5;

    return {
        estimatedEndDate,
        points: Math.max(points, 50) // Mínimo 50 puntos, también múltiplo de 5
    };
};