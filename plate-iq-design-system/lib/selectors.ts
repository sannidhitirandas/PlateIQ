import type { PlateIQState } from './types'
import { wasteSummary } from './waste-engine'

export function getRestaurantMetrics(state: PlateIQState) {
  const demand = state.forecasts.reduce((sum, item) => sum + item.forecast, 0)
  const prepared = state.batches.reduce((sum, batch) => sum + (batch.status === 'Completed' || batch.status === 'Ready' || batch.status === 'In Preparation' ? batch.quantity : 0), 0)
  const waste = wasteSummary(state.waste)
  return { demand, prepared, wasteKg: waste.wasteKg, wasteCost: waste.wasteCost, savings: Math.max(0, Math.round((state.waste.length * 1200) - waste.wasteCost)) }
}

export function getForecastMetrics(state: PlateIQState, dishId = 'biryani') {
  return state.forecasts.find(item => item.dishId === dishId) ?? null
}

export function getInventoryMetrics(state: PlateIQState) {
  const projectedStockouts = state.inventory.filter(item => item.daysLeft <= 1).length
  return { projectedStockouts, stockoutRate: state.inventory.length ? projectedStockouts / state.inventory.length * 100 : 0 }
}

export function getCopilotContext(state: PlateIQState) {
  const forecast = getForecastMetrics(state)
  const nextBatch = state.batches.find(batch => batch.status === 'Recommended' || batch.status === 'In Preparation')
  return { forecast, nextBatch, prepared: state.demo.prepared, orders: state.demo.orders, inventory: state.inventory, waste: wasteSummary(state.waste), scenario: state.scenario }
}

export function validateStateConsistency(state: PlateIQState): string[] {
  const warnings: string[] = []
  if (state.inventory.some(item => item.currentStock < 0)) warnings.push('Inventory contains negative stock.')
  if (state.demo.projectedDemand < state.demo.orders) warnings.push('Projected demand is below current orders.')
  if (state.batches.some(batch => batch.status === 'Completed' && batch.status === 'Recommended')) warnings.push('Completed batch is still recommended.')
  if (state.demo.prepared < 0) warnings.push('Prepared quantity is negative.')
  if (state.waste.some(record => record.wasteKg < 0 || record.wasteCost < 0)) warnings.push('Waste record contains negative values.')
  return warnings
}

export function simulateScenario(state: PlateIQState, scenario: PlateIQState['scenario']) {
  const forecast = getForecastMetrics({ ...state, scenario })
  const projectedDemand = Math.max(state.demo.orders, Math.round((forecast?.forecast ?? state.demo.orders) * (1 + scenario.customerChange / 100)))
  const recommendedPreparation = Math.max(0, Math.ceil((projectedDemand - state.demo.prepared) / 30) * 30)
  const stockoutRate = getInventoryMetrics(state).stockoutRate
  return { projectedDemand, recommendedPreparation, recommendedBatches: recommendedPreparation ? 1 : 0, inventoryRequirements: recommendedPreparation * 0.25, projectedWasteKg: Math.max(0, recommendedPreparation * 0.045), projectedWasteCost: Math.round(recommendedPreparation * 0.045 * 150), stockoutRisk: stockoutRate > 20 ? 'High' : stockoutRate > 0 ? 'Medium' : 'Low' }
}
