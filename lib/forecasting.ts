import type { Dish, SimulationScenario } from './types'
import { calculateForecast, predictionRange, preparationRecommendation, scenarioDemand } from './calculations'
export function buildForecast(dish:Dish, orders:number, scenario:SimulationScenario){
  const forecast=calculateForecast(dish, orders, scenario)
  const confidence=Math.max(78, Math.min(97, dish.confidence - Math.abs(scenario.customerChange)/8 + (scenario.promotion ? 1 : 0)))
  const range=predictionRange(forecast, confidence)
  return { forecast, confidence:Math.round(confidence), ...range, projectedDemand:scenarioDemand(forecast, scenario), recommendedPreparation:preparationRecommendation(forecast, dish.prepared, dish.batchSize) }
}
export function explainForecast(scenario:SimulationScenario, ordersPerMinute:number){return [
 {label:'Order velocity',impact:ordersPerMinute>8?'High':'Moderate',direction:ordersPerMinute>8?'up':'flat',explanation:`Orders are arriving at ${ordersPerMinute.toFixed(1)} per minute.`},
 {label:'Weather',impact:scenario.weather==='Clear'?'Neutral':'Downward',direction:scenario.weather==='Clear'?'flat':'down',explanation:`${scenario.weather} conditions are included in the forecast.`},
 {label:'Local factors',impact:scenario.promotion||scenario.localEvent!=='None'?'Positive':'Neutral',direction:scenario.promotion||scenario.localEvent!=='None'?'up':'flat',explanation:'Local events and promotions are recalculated with each scenario.'}
]}
export type ForecastFactor=ReturnType<typeof explainForecast>[number]
