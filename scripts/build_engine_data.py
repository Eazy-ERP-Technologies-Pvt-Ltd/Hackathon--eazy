#!/usr/bin/env python3
"""
build_engine_data.py
Processes the 8 Hackathon Excel datasets and generates structured, prescriptive
Opportunity Loss and Growth Engine JSON payloads for Backend and Frontend.
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime

def run_pipeline():
    print("🚀 [Pipeline] Ingesting 7 core hackathon datasets...")

    orders = pd.read_excel('1_Sales_Orders.xlsx')
    stock = pd.read_excel('2_Distributor_Stock.xlsx')
    ret_sales = pd.read_excel('3_Retailer_Sales.xlsx')
    visits = pd.read_excel('4_Field_Visits.xlsx')
    retailers = pd.read_excel('5_Retailer_Master.xlsx')
    schemes = pd.read_excel('6_Schemes_Promotions.xlsx')
    skus = pd.read_excel('7_SKU_Master.xlsx')

    # Date formatting
    orders['order_date'] = pd.to_datetime(orders['order_date'])
    stock['snapshot_date'] = pd.to_datetime(stock['snapshot_date'])
    visits['visit_date'] = pd.to_datetime(visits['visit_date'])
    retailers['last_order_date'] = pd.to_datetime(retailers['last_order_date'])
    schemes['start_date'] = pd.to_datetime(schemes['start_date'])
    schemes['end_date'] = pd.to_datetime(schemes['end_date'])

    # 1. High-Level KPIs
    total_ordered_val = float(orders['order_value'].sum())
    total_delivered_val = float(orders['delivered_value'].sum())
    direct_lost_val = total_ordered_val - total_delivered_val
    overall_fill_rate = (total_delivered_val / total_ordered_val) * 100

    latest_stock_date = stock['snapshot_date'].max()
    latest_stock = stock[stock['snapshot_date'] == latest_stock_date]
    total_stock_val = float(latest_stock['stock_value'].sum())
    total_stock_qty = int(latest_stock['stock_on_hand'].sum())
    aged_90_qty = int(latest_stock['qty_aged_90_plus'].sum())
    aged_180_qty = int(latest_stock['qty_aged_180_plus'].sum())

    total_visits_count = len(visits)
    orders_taken_count = int(visits['orders_generated'].sum())
    strike_rate = (orders_taken_count / total_visits_count) * 100
    non_gps_visits = int((visits['gps_verified'] == 'No').sum())
    drive_by_visits = int((visits['duration_min'] < 10).sum())

    # 2. DETECT LEAKAGES

    leakage_items = []

    # --- LEAK 1: GHOST STOCKOUTS ---
    orders['shortfall_qty'] = orders['qty_ordered'] - orders['qty_delivered']
    orders['unfulfilled_val'] = orders['shortfall_qty'] * orders['unit_price']
    unfulfilled_orders = orders[orders['shortfall_qty'] > 0].copy()

    unfulfilled_orders['month_str'] = unfulfilled_orders['order_date'].dt.strftime('%Y-%m')
    stock['month_str'] = stock['snapshot_date'].dt.strftime('%Y-%m')

    stock_map = stock.groupby(['distributor_id', 'sku_code', 'month_str'])['available_qty'].mean().to_dict()

    ghost_stockout_val = 0.0
    ghost_stockout_count = 0

    for _, row in unfulfilled_orders.iterrows():
        key = (row['distributor_id'], row['sku_code'], row['month_str'])
        avail = stock_map.get(key, 0)
        shortfall = row['shortfall_qty']
        lost_amt = float(row['unfulfilled_val'])

        is_ghost = avail >= shortfall
        if is_ghost:
            ghost_stockout_val += lost_amt
            ghost_stockout_count += 1

        if lost_amt > 10000 or is_ghost:
            ret_name = retailers.loc[retailers['retailer_id'] == row['retailer_id'], 'retailer_name'].values
            ret_name_str = ret_name[0] if len(ret_name) > 0 else row['retailer_id']
            
            leakage_items.append({
                "id": f"LEAK_GS_{row['order_id']}_{row['line_no']}",
                "category": "GHOST_STOCKOUT" if is_ghost else "SUPPLY_CHAIN_STOCKOUT",
                "severity": "CRITICAL" if lost_amt > 25000 or is_ghost else "HIGH",
                "entity_id": row['retailer_id'],
                "entity_name": ret_name_str,
                "territory": row['territory_name'],
                "distributor_id": row['distributor_id'],
                "sku_code": row['sku_code'],
                "product_category": row['category'],
                "revenue_at_risk": round(lost_amt, 2),
                "root_cause": f"Distributor had {int(avail)} units free in warehouse while order for {shortfall} units was unfulfilled/cut." if is_ghost else f"Supply stockout at distributor hub (0 available units).",
                "what_to_do": f"Automate dispatch alert: allocate {int(shortfall)} units from {row['distributor_id']} to {ret_name_str} immediately.",
                "why_it_matters": f"Prevent loss of ₹{lost_amt:,.0f} and retain shelf placement against competitors in {row['territory_name']}.",
                "metric_to_track": "Order Fill Rate % & Distributor Fulfillment SLA"
            })

    # --- LEAK 2: SILENT CHURN ---
    max_date = pd.to_datetime('2026-09-30')
    retailers['days_since_last_order'] = (max_date - retailers['last_order_date']).dt.days

    silent_churners = retailers[(retailers['days_since_last_order'] > 60) & (retailers['status'] == 'Active')].copy()
    silent_churn_rev = float(silent_churners['sales_value_12m'].sum())
    monthly_churn_risk = silent_churn_rev / 12.0

    # Top silent churners to highlight
    for _, row in silent_churners.sort_values(by='sales_value_12m', ascending=False).head(40).iterrows():
        est_lost_monthly = float(row['sales_value_12m']) / 12.0
        leakage_items.append({
            "id": f"LEAK_CHURN_{row['retailer_id']}",
            "category": "SILENT_CHURN",
            "severity": "CRITICAL" if row['tier'] == 'A' else "HIGH",
            "entity_id": row['retailer_id'],
            "entity_name": row['retailer_name'],
            "territory": row['city'],
            "distributor_id": row['distributor_id'],
            "sku_code": "ALL_CATEGORIES",
            "product_category": "Multi-Category",
            "revenue_at_risk": round(est_lost_monthly, 2),
            "root_cause": f"Tier {row['tier']} store has placed 0 orders in {int(row['days_since_last_order'])} days despite ₹{row['sales_value_12m']:,.0f} historical annual sales.",
            "what_to_do": f"Schedule joint intervention visit with Rep {row['rep_name']} and Area Sales Manager; pitch targeted rebate scheme.",
            "why_it_matters": f"Account at imminent risk of permanent competitor defection. Historical monthly run-rate ₹{est_lost_monthly:,.0f}.",
            "metric_to_track": "Re-order Interval & Active Ordering Outlets"
        })

    # --- LEAK 3: FIELD FORCE DRAIN ---
    rep_stats = visits.groupby('salesperson_id').agg(
        total_visits=('visit_id', 'count'),
        orders=('orders_generated', 'sum'),
        order_val=('order_value', 'sum'),
        avg_duration=('duration_min', 'mean'),
        non_gps=('gps_verified', lambda x: (x == 'No').sum()),
        drive_by=('duration_min', lambda x: (x < 10).sum())
    ).reset_index()

    rep_stats['strike_rate'] = (rep_stats['orders'] / rep_stats['total_visits']) * 100

    # Merge rep names from retailers
    rep_names = retailers[['assigned_rep', 'rep_name', 'city']].drop_duplicates().set_index('assigned_rep')
    
    anomalous_reps = rep_stats[rep_stats['total_visits'] > 1000].copy()
    for _, row in anomalous_reps.iterrows():
        r_id = row['salesperson_id']
        r_name = rep_names.loc[r_id, 'rep_name'] if r_id in rep_names.index else r_id
        r_city = rep_names.loc[r_id, 'city'] if r_id in rep_names.index else "Territory"
        if isinstance(r_name, pd.Series): r_name = r_name.iloc[0]
        if isinstance(r_city, pd.Series): r_city = r_city.iloc[0]

        est_wasted_hours = (row['drive_by'] * 20 + row['non_gps'] * 20) / 60.0
        leakage_items.append({
            "id": f"LEAK_REP_{r_id}",
            "category": "FIELD_FORCE_DRAIN",
            "severity": "CRITICAL",
            "entity_id": r_id,
            "entity_name": f"{r_name} ({r_id})",
            "territory": r_city,
            "distributor_id": "N/A",
            "sku_code": "BEAT_EXECUTION",
            "product_category": "Field Productivity",
            "revenue_at_risk": round(float(row['total_visits'] * 850 * (0.45 - row['strike_rate']/100)), 2),
            "root_cause": f"Abnormally high visit volume ({row['total_visits']} visits) with only {row['strike_rate']:.1f}% strike rate, {row['drive_by']} drive-by stops (<10 min), and {row['non_gps']} non-GPS verified logs.",
            "what_to_do": f"Audit rep GPS compliance; restrict beat frequency to high-intent stores; retrain on sales pitch conversion.",
            "why_it_matters": f"Field operational budget leakage: {int(est_wasted_hours)} estimated wasted productive field hours.",
            "metric_to_track": "Beat Strike Rate % & Productive Call Duration"
        })

    # Sort leakage items by revenue_at_risk descending
    leakage_items.sort(key=lambda x: x['revenue_at_risk'], reverse=True)

    # 3. Territory Benchmarks
    terr_summary = orders.groupby(['territory_id', 'territory_name']).agg(
        total_orders=('order_id', 'nunique'),
        order_value=('order_value', 'sum'),
        delivered_value=('delivered_value', 'sum'),
        shortfall_val=('unfulfilled_val', 'sum')
    ).reset_index()
    terr_summary['fill_rate'] = (terr_summary['delivered_value'] / terr_summary['order_value']) * 100
    territories_list = [
        {
            "territory_id": r['territory_id'],
            "territory_name": r['territory_name'],
            "order_value": float(r['order_value']),
            "delivered_value": float(r['delivered_value']),
            "lost_value": float(r['shortfall_val']),
            "fill_rate": round(float(r['fill_rate']), 2)
        }
        for _, r in terr_summary.sort_values(by='order_value', ascending=False).iterrows()
    ]

    # 4. Category Benchmarks
    cat_summary = orders.groupby('category').agg(
        order_val=('order_value', 'sum'),
        delivered_val=('delivered_value', 'sum'),
        shortfall_val=('unfulfilled_val', 'sum'),
        total_qty=('qty_ordered', 'sum')
    ).reset_index()
    cat_summary['fill_rate'] = (cat_summary['delivered_val'] / cat_summary['order_val']) * 100
    categories_list = [
        {
            "category": r['category'],
            "order_value": float(r['order_val']),
            "delivered_value": float(r['delivered_val']),
            "lost_value": float(r['shortfall_val']),
            "fill_rate": round(float(r['fill_rate']), 2)
        }
        for _, r in cat_summary.sort_values(by='order_val', ascending=False).iterrows()
    ]

    # 5. Schemes Effectiveness
    schemes_grouped = schemes.groupby(['scheme_id', 'scheme_name', 'category']).agg(
        eligible=('eligible', 'count'),
        redeemed=('redeemed', lambda x: (x == 'Yes').sum()),
        cost=('scheme_cost', 'sum'),
        sales_during=('category_sales_during_scheme', 'sum'),
        sales_prev=('category_sales_prev_period', 'sum')
    ).reset_index()
    schemes_grouped['redemption_rate'] = (schemes_grouped['redeemed'] / schemes_grouped['eligible']) * 100
    schemes_grouped['lift'] = schemes_grouped['sales_during'] - schemes_grouped['sales_prev']
    schemes_list = [
        {
            "scheme_id": r['scheme_id'],
            "scheme_name": r['scheme_name'],
            "category": r['category'],
            "eligible": int(r['eligible']),
            "redeemed": int(r['redeemed']),
            "redemption_rate": round(float(r['redemption_rate']), 1),
            "scheme_cost": float(r['cost']),
            "sales_lift": float(r['lift']),
            "roi_ratio": round(float(r['lift'] / (r['cost'] if r['cost'] > 0 else 1)), 2)
        }
        for _, r in schemes_grouped.iterrows()
    ]

    # 6. Rep Productivity Roster
    reps_list = []
    for _, r in rep_stats.iterrows():
        r_id = r['salesperson_id']
        r_name = rep_names.loc[r_id, 'rep_name'] if r_id in rep_names.index else r_id
        r_city = rep_names.loc[r_id, 'city'] if r_id in rep_names.index else "Unknown"
        if isinstance(r_name, pd.Series): r_name = r_name.iloc[0]
        if isinstance(r_city, pd.Series): r_city = r_city.iloc[0]

        reps_list.append({
            "rep_id": r_id,
            "rep_name": r_name,
            "city": r_city,
            "total_visits": int(r['total_visits']),
            "orders": int(r['orders']),
            "order_value": float(r['order_val']),
            "strike_rate": round(float(r['strike_rate']), 1),
            "drive_by_stops": int(r['drive_by']),
            "non_gps_visits": int(r['non_gps']),
            "is_anomaly": bool(r['total_visits'] > 1000 or r['strike_rate'] < 25.0)
        })
    reps_list.sort(key=lambda x: x['total_visits'], reverse=True)

    # 7. Prescriptive Daily Directives (Ready for Morning Field Dispatch)
    directives = []
    # Sample 15 prioritized actions combining Ghost Stockouts, Churned Outlets, and Schemes
    priority_stockouts = [l for l in leakage_items if l['category'] == 'GHOST_STOCKOUT'][:6]
    priority_churn = [l for l in leakage_items if l['category'] == 'SILENT_CHURN'][:6]
    priority_reps = [l for l in leakage_items if l['category'] == 'FIELD_FORCE_DRAIN'][:3]

    for item in priority_stockouts:
        directives.append({
            "directive_id": f"DIR_{item['id']}",
            "type": "STOCKOUT_PREVENTION",
            "priority": "P0_URGENT",
            "store_id": item['entity_id'],
            "store_name": item['entity_name'],
            "territory": item['territory'],
            "action_title": f"Fulfill Backorder: {item['sku_code']} at {item['entity_name']}",
            "recommended_action": item['what_to_do'],
            "commercial_rationale": item['why_it_matters'],
            "revenue_impact_inr": item['revenue_at_risk'],
            "whatsapp_message": f"🚨 URGENT ORDER DISPATCH: Store {item['entity_name']} ({item['entity_id']}) has pending demand for {item['sku_code']}. Distributor {item['distributor_id']} has stock on hand. Value at risk: ₹{item['revenue_at_risk']:,.0f}. Dispatch today!"
        })

    for item in priority_churn:
        directives.append({
            "directive_id": f"DIR_{item['id']}",
            "type": "CHURN_RECOVERY",
            "priority": "P1_HIGH",
            "store_id": item['entity_id'],
            "store_name": item['entity_name'],
            "territory": item['territory'],
            "action_title": f"Win-Back Visit: {item['entity_name']}",
            "recommended_action": item['what_to_do'],
            "commercial_rationale": item['why_it_matters'],
            "revenue_impact_inr": item['revenue_at_risk'],
            "whatsapp_message": f"📍 PRIORITY BEAT STOP: Visit {item['entity_name']} ({item['territory']}). Zero orders for >60 days! Pitch LED Festive Scheme with 4% extra margin to win back account. Est. monthly rev: ₹{item['revenue_at_risk']:,.0f}."
        })

    for item in priority_reps:
        directives.append({
            "directive_id": f"DIR_{item['id']}",
            "type": "ROUTE_AUDIT",
            "priority": "P1_HIGH",
            "store_id": item['entity_id'],
            "store_name": item['entity_name'],
            "territory": item['territory'],
            "action_title": f"Route Realignment: Rep {item['entity_name']}",
            "recommended_action": item['what_to_do'],
            "commercial_rationale": item['why_it_matters'],
            "revenue_impact_inr": item['revenue_at_risk'],
            "whatsapp_message": f"📋 SUPERVISOR ALERT: Rep {item['entity_name']} has abnormal check-in volume with low strike rate. Mandate joint manager beat ride tomorrow."
        })

    # Master Output Payload
    payload = {
        "metadata": {
            "title": "Eazy AI Opportunity Loss & Prescriptive Growth Engine",
            "period": "Oct 2025 - Sep 2026",
            "generated_at": datetime.now().isoformat(),
            "total_outlets_audited": len(retailers),
            "total_skus": len(skus),
            "total_territories": len(territories_list),
            "total_orders": len(orders)
        },
        "kpis": {
            "total_ordered_value": total_ordered_val,
            "total_delivered_value": total_delivered_val,
            "direct_lost_sales": direct_lost_val,
            "overall_fill_rate": round(overall_fill_rate, 2),
            "ghost_stockouts_value": ghost_stockout_val,
            "ghost_stockouts_count": ghost_stockout_count,
            "total_distributor_stock_value": total_stock_val,
            "stock_on_hand_units": total_stock_qty,
            "aged_90_plus_units": aged_90_qty,
            "aged_180_plus_units": aged_180_qty,
            "silent_churn_outlets_count": len(silent_churners),
            "silent_churn_annual_rev_at_risk": silent_churn_rev,
            "silent_churn_monthly_run_rate_at_risk": monthly_churn_risk,
            "total_rep_visits": total_visits_count,
            "rep_strike_rate": round(strike_rate, 1),
            "non_gps_visits_count": non_gps_visits,
            "drive_by_visits_count": drive_by_visits,
            "schemes_redemption_rate": round((schemes_grouped['redeemed'].sum() / schemes_grouped['eligible'].sum()) * 100, 1),
            "schemes_total_lift": float(schemes_grouped['lift'].sum())
        },
        "leakages": leakage_items[:100],  # Top 100 high-impact leakages
        "directives": directives,
        "territories": territories_list,
        "categories": categories_list,
        "schemes": schemes_list,
        "reps": reps_list[:30]
    }

    # Save to Backend & Frontend data directories
    os.makedirs('apps/backend/src/data', exist_ok=True)
    os.makedirs('apps/frontend/src/data', exist_ok=True)

    with open('apps/backend/src/data/growth_engine_data.json', 'w') as f:
        json.dump(payload, f, indent=2)
    print("✅ Saved apps/backend/src/data/growth_engine_data.json")

    with open('apps/frontend/src/data/growth_engine_data.json', 'w') as f:
        json.dump(payload, f, indent=2)
    print("✅ Saved apps/frontend/src/data/growth_engine_data.json")

    print(f"🎉 Pipeline successfully generated {len(leakage_items)} leakages and {len(directives)} prescriptive field directives!")

if __name__ == '__main__':
    run_pipeline()
