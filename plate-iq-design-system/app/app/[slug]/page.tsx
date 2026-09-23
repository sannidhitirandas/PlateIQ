import type React from 'react'
import { AppShell } from '@/components/app-shell'
import { ProductPage } from '@/components/product-pages'
import { LiveOperationsPage, KitchenPlannerPage, DemandForecastPage, InventoryPage, WasteIntelligencePage, AnalyticsPage } from '@/components/operational-pages'
export default async function ProductRoute({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const pages:Record<string,React.ReactNode>={ 'live-operations':<LiveOperationsPage/>, 'kitchen-planner':<KitchenPlannerPage/>, 'demand-forecast':<DemandForecastPage/>, inventory:<InventoryPage/>, 'waste-intelligence':<WasteIntelligencePage/>, analytics:<AnalyticsPage/> }; return <AppShell>{pages[slug]||<ProductPage kind={slug}/>}</AppShell>}
