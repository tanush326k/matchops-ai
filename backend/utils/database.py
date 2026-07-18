from typing import Dict, List, Any
from datetime import datetime

PHASE_TEMPLATES = {
    "Pre-match": {
        "crowd_status": {
            "Gate A": {"count": 1200, "wait_time_minutes": 5, "congestion": "Low", "accessibility_friendly": True},
            "Gate B": {"count": 900, "wait_time_minutes": 3, "congestion": "Low", "accessibility_friendly": True},
            "Gate C": {"count": 400, "wait_time_minutes": 2, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 800, "wait_time_minutes": 2, "congestion": "Low", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 2, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 4, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 1, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 5, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 10, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 5, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 15, "status": "Recommended", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 10, "status": "Recommended", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 8, "status": "Recommended", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 4, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 5, "surge_pricing": "No", "status": "Fluid"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 180, "on_break": 70,
            "allocations": {"Zone A (Gates A/B)": 40, "Zone B (Gates C/D)": 40, "Level 1 Concourse": 30, "Level 2 Concourse": 20, "Level 3 Concourse": 20, "Transport Hubs": 30}
        },
        "sustainability": {
            "water_used_gallons": 5200, "waste_diverted_percent": 88.0, "carbon_saved_tons": 2.1, "solar_energy_generated_kwh": 410, "energy_offset_percent": 45.0
        }
    },
    "Entry Rush": {
        "crowd_status": {
            "Gate A": {"count": 15000, "wait_time_minutes": 55, "congestion": "High", "accessibility_friendly": True},
            "Gate B": {"count": 9200, "wait_time_minutes": 25, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 2200, "wait_time_minutes": 8, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 11500, "wait_time_minutes": 35, "congestion": "High", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 15, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 25, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 5, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 20, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 10, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 4, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 8, "congestion": "Medium", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 3, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 8, "delay_minutes": 3, "status": "Busy - Commencing Entry", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 5, "delay_minutes": 2, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 88, "status": "Busy", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 45, "status": "Recommended", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 75, "status": "Busy", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 25, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 18, "surge_pricing": "Yes (1.2x)", "status": "Busy"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 220, "on_break": 30,
            "allocations": {"Zone A (Gates A/B)": 75, "Zone B (Gates C/D)": 75, "Level 1 Concourse": 30, "Level 2 Concourse": 20, "Level 3 Concourse": 10, "Transport Hubs": 40}
        },
        "sustainability": {
            "water_used_gallons": 12500, "waste_diverted_percent": 85.0, "carbon_saved_tons": 5.4, "solar_energy_generated_kwh": 950, "energy_offset_percent": 38.0
        }
    },
    "Kickoff": {
        "crowd_status": {
            "Gate A": {"count": 800, "wait_time_minutes": 3, "congestion": "Low", "accessibility_friendly": True},
            "Gate B": {"count": 500, "wait_time_minutes": 2, "congestion": "Low", "accessibility_friendly": True},
            "Gate C": {"count": 100, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 300, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 18, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 32, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 6, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 12, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 8, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 6, "congestion": "Medium", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 15, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 10, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 92, "status": "Full", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 89, "status": "Busy", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 35, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 8, "surge_pricing": "No", "status": "Fluid"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 210, "on_break": 40,
            "allocations": {"Zone A (Gates A/B)": 30, "Zone B (Gates C/D)": 30, "Level 1 Concourse": 60, "Level 2 Concourse": 40, "Level 3 Concourse": 30, "Transport Hubs": 20}
        },
        "sustainability": {
            "water_used_gallons": 18200, "waste_diverted_percent": 84.6, "carbon_saved_tons": 8.5, "solar_energy_generated_kwh": 1820, "energy_offset_percent": 36.2
        }
    },
    "Halftime": {
        "crowd_status": {
            "Gate A": {"count": 200, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate B": {"count": 100, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate C": {"count": 50, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 100, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 32, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 45, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 18, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 15, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 16, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 8, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 12, "congestion": "High", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 5, "congestion": "Medium", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 15, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 10, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 98, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 94, "status": "Full", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 35, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 5, "surge_pricing": "No", "status": "Fluid"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 230, "on_break": 20,
            "allocations": {"Zone A (Gates A/B)": 20, "Zone B (Gates C/D)": 20, "Level 1 Concourse": 90, "Level 2 Concourse": 50, "Level 3 Concourse": 35, "Transport Hubs": 15}
        },
        "sustainability": {
            "water_used_gallons": 32100, "waste_diverted_percent": 84.8, "carbon_saved_tons": 10.2, "solar_energy_generated_kwh": 2650, "energy_offset_percent": 36.8
        }
    },
    "Second Half": {
        "crowd_status": {
            "Gate A": {"count": 100, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate B": {"count": 50, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate C": {"count": 10, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 50, "wait_time_minutes": 1, "congestion": "Low", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 5, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 10, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 2, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 8, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 3, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 3, "congestion": "Low", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 15, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 10, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 98, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 94, "status": "Full", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 35, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 5, "surge_pricing": "No", "status": "Fluid"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 190, "on_break": 60,
            "allocations": {"Zone A (Gates A/B)": 30, "Zone B (Gates C/D)": 30, "Level 1 Concourse": 50, "Level 2 Concourse": 30, "Level 3 Concourse": 25, "Transport Hubs": 25}
        },
        "sustainability": {
            "water_used_gallons": 38400, "waste_diverted_percent": 84.6, "carbon_saved_tons": 12.8, "solar_energy_generated_kwh": 2980, "energy_offset_percent": 36.4
        }
    },
    "Final Whistle": {
        "crowd_status": {
            "Gate A": {"count": 4000, "wait_time_minutes": 10, "congestion": "Medium", "accessibility_friendly": True},
            "Gate B": {"count": 3000, "wait_time_minutes": 8, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 1000, "wait_time_minutes": 3, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 3500, "wait_time_minutes": 8, "congestion": "Medium", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 1, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 2, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 1, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 22, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 8, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 3, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 6, "congestion": "Medium", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 6, "delay_minutes": 2, "status": "Busy - Boarding Exit Rows", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 5, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 92, "status": "Discharging", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 90, "status": "Discharging", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 88, "status": "Discharging", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 30, "status": "Discharging", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 15, "surge_pricing": "Yes (1.3x)", "status": "Busy"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 210, "on_break": 40,
            "allocations": {"Zone A (Gates A/B)": 50, "Zone B (Gates C/D)": 50, "Level 1 Concourse": 40, "Level 2 Concourse": 20, "Level 3 Concourse": 10, "Transport Hubs": 80}
        },
        "sustainability": {
            "water_used_gallons": 41200, "waste_diverted_percent": 84.6, "carbon_saved_tons": 13.8, "solar_energy_generated_kwh": 3080, "energy_offset_percent": 36.2
        }
    },
    "Exit Rush": {
        "crowd_status": {
            "Gate A": {"count": 18000, "wait_time_minutes": 35, "congestion": "High", "accessibility_friendly": True},
            "Gate B": {"count": 12000, "wait_time_minutes": 25, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 4000, "wait_time_minutes": 8, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 15000, "wait_time_minutes": 30, "congestion": "High", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 0, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 0, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 0, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 25, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 14, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 6, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 10, "congestion": "High", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 4, "congestion": "Medium", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 4, "delay_minutes": 12, "status": "Congested - Extreme exit queues", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 4, "delay_minutes": 4, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 65, "status": "Discharging", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 55, "status": "Discharging", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 62, "status": "Discharging", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 15, "status": "Discharging", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 32, "surge_pricing": "Yes (2.2x)", "status": "Congested"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 240, "on_break": 10,
            "allocations": {"Zone A (Gates A/B)": 60, "Zone B (Gates C/D)": 60, "Level 1 Concourse": 20, "Level 2 Concourse": 10, "Level 3 Concourse": 5, "Transport Hubs": 85}
        },
        "sustainability": {
            "water_used_gallons": 42500, "waste_diverted_percent": 84.6, "carbon_saved_tons": 14.8, "solar_energy_generated_kwh": 3120, "energy_offset_percent": 36.2
        }
    },
    "Stadium Closed": {
        "crowd_status": {
            "Gate A": {"count": 0, "wait_time_minutes": 0, "congestion": "Low", "accessibility_friendly": True},
            "Gate B": {"count": 0, "wait_time_minutes": 0, "congestion": "Low", "accessibility_friendly": True},
            "Gate C": {"count": 0, "wait_time_minutes": 0, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 0, "wait_time_minutes": 0, "congestion": "Low", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 0, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 0, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 0, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 0, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 0, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 0, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 0, "congestion": "Low", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 0, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 0, "delay_minutes": 0, "status": "Closed", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 0, "delay_minutes": 0, "status": "Closed", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 0, "status": "Closed", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 0, "status": "Closed", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 0, "status": "Closed", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 0, "status": "Closed", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 0, "surge_pricing": "No", "status": "Closed"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 0, "on_break": 0,
            "allocations": {"Zone A (Gates A/B)": 0, "Zone B (Gates C/D)": 0, "Level 1 Concourse": 0, "Level 2 Concourse": 0, "Level 3 Concourse": 0, "Transport Hubs": 0}
        },
        "sustainability": {
            "water_used_gallons": 44800, "waste_diverted_percent": 84.6, "carbon_saved_tons": 15.6, "solar_energy_generated_kwh": 3120, "energy_offset_percent": 0
        }
    },
    "Emergency Scenario": {
        "crowd_status": {
            "Gate A": {"count": 8000, "wait_time_minutes": 25, "congestion": "High", "accessibility_friendly": True},
            "Gate B": {"count": 4000, "wait_time_minutes": 12, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 1200, "wait_time_minutes": 5, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 12200, "wait_time_minutes": 45, "congestion": "High", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 5, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 8, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 2, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 10, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 4, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 3, "congestion": "Low", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 8, "delay_minutes": 2, "status": "Operational - High Security", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 4, "delay_minutes": 1, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 42, "status": "Recommended", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 88, "status": "Busy", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 25, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 25, "surge_pricing": "Yes (1.8x)", "status": "High Security Check"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 235, "on_break": 15,
            "allocations": {"Zone A (Gates A/B)": 65, "Zone B (Gates C/D)": 65, "Level 1 Concourse": 40, "Level 2 Concourse": 25, "Level 3 Concourse": 15, "Transport Hubs": 25}
        },
        "sustainability": {
            "water_used_gallons": 22400, "waste_diverted_percent": 84.6, "carbon_saved_tons": 9.4, "solar_energy_generated_kwh": 2100, "energy_offset_percent": 36.2
        }
    },
    "Heavy Crowd": {
        "crowd_status": {
            "Gate A": {"count": 22000, "wait_time_minutes": 75, "congestion": "High", "accessibility_friendly": True},
            "Gate B": {"count": 14000, "wait_time_minutes": 45, "congestion": "High", "accessibility_friendly": True},
            "Gate C": {"count": 5200, "wait_time_minutes": 18, "congestion": "Medium", "accessibility_friendly": True},
            "Gate D": {"count": 17500, "wait_time_minutes": 55, "congestion": "High", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 28, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 55, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 15, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 35, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 22, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 12, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 18, "congestion": "High", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 9, "congestion": "Medium", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 6, "delay_minutes": 8, "status": "Congested", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 4, "delay_minutes": 3, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 98, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 95, "status": "Full", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 45, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 28, "surge_pricing": "Yes (1.8x)", "status": "Busy"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 240, "on_break": 10,
            "allocations": {"Zone A (Gates A/B)": 85, "Zone B (Gates C/D)": 85, "Level 1 Concourse": 30, "Level 2 Concourse": 15, "Level 3 Concourse": 10, "Transport Hubs": 15}
        },
        "sustainability": {
            "water_used_gallons": 28400, "waste_diverted_percent": 84.6, "carbon_saved_tons": 11.2, "solar_energy_generated_kwh": 2720, "energy_offset_percent": 36.2
        }
    },
    "Transport Delay": {
        "crowd_status": {
            "Gate A": {"count": 12000, "wait_time_minutes": 25, "congestion": "Medium", "accessibility_friendly": True},
            "Gate B": {"count": 4500, "wait_time_minutes": 15, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 1200, "wait_time_minutes": 5, "congestion": "Low", "accessibility_friendly": True},
            "Gate D": {"count": 8200, "wait_time_minutes": 20, "congestion": "Medium", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 12, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 18, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 3, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 15, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 6, "congestion": "Medium", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 2, "congestion": "Low", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 4, "congestion": "Medium", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 1, "congestion": "Low", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 20, "delay_minutes": 25, "status": "Critical Delay - Switch issue", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 3, "delay_minutes": 1, "status": "Fluid Shuttle Operations", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 55, "status": "Recommended", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 88, "status": "Busy", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 25, "status": "Open", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 35, "surge_pricing": "Yes (2.0x)", "status": "Extremely Busy"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 210, "on_break": 40,
            "allocations": {"Zone A (Gates A/B)": 45, "Zone B (Gates C/D)": 45, "Level 1 Concourse": 30, "Level 2 Concourse": 20, "Level 3 Concourse": 20, "Transport Hubs": 50}
        },
        "sustainability": {
            "water_used_gallons": 21200, "waste_diverted_percent": 84.6, "carbon_saved_tons": 7.4, "solar_energy_generated_kwh": 1950, "energy_offset_percent": 36.2
        }
    },
    "Accessibility Surge": {
        "crowd_status": {
            "Gate A": {"count": 12000, "wait_time_minutes": 45, "congestion": "High", "accessibility_friendly": True},
            "Gate B": {"count": 4500, "wait_time_minutes": 15, "congestion": "Medium", "accessibility_friendly": True},
            "Gate C": {"count": 8500, "wait_time_minutes": 25, "congestion": "High", "accessibility_friendly": True},
            "Gate D": {"count": 8200, "wait_time_minutes": 25, "congestion": "Medium", "accessibility_friendly": False}
        },
        "concessions": [
            {"id": "c-01", "name": "Liberty Burger & Grill", "section": "Section 102", "wait_time_minutes": 22, "type": "Food", "options": ["Halal", "Gluten-Free"]},
            {"id": "c-02", "name": "Taco World Cup", "section": "Section 220", "wait_time_minutes": 35, "type": "Food", "options": ["Vegetarian"]},
            {"id": "c-03", "name": "Hudson Valley Greens", "section": "Section 315", "wait_time_minutes": 12, "type": "Food", "options": ["Vegan", "Gluten-Free", "Halal"]},
            {"id": "c-04", "name": "FIFA Official Merchandise", "section": "Section 110", "wait_time_minutes": 18, "type": "Retail", "options": []}
        ],
        "restrooms": {
            "Restroom Block A (Level 1)": {"wait_time_minutes": 15, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block B (Level 1)": {"wait_time_minutes": 10, "congestion": "High", "wheelchair_accessible": True},
            "Restroom Block C (Level 2)": {"wait_time_minutes": 8, "congestion": "Medium", "wheelchair_accessible": False},
            "Restroom Block D (Level 3)": {"wait_time_minutes": 12, "congestion": "High", "wheelchair_accessible": True}
        },
        "transport": {
            "metro": {"station": "Meadowlands Station", "frequency_minutes": 8, "delay_minutes": 3, "status": "Operational - Peak Demand", "recommended_for": "Manhattan & Hoboken connections"},
            "bus": {"route": "Express Shuttle Line 10", "frequency_minutes": 5, "delay_minutes": 0, "status": "Fluid", "recommended_for": "Offsite Lot P5 & Local Hotels"},
            "parking": {
                "Lot A": {"occupancy_percent": 96, "status": "Full", "category": "General Parking"},
                "Lot B": {"occupancy_percent": 42, "status": "Recommended", "category": "General Parking"},
                "Lot C": {"occupancy_percent": 88, "status": "Busy", "category": "General Parking"},
                "Lot D": {"occupancy_percent": 95, "status": "Full", "category": "Accessibility Priority Only"}
            },
            "rideshare": {"zone": "Zone G (East Lot)", "average_wait_minutes": 18, "surge_pricing": "Yes (1.5x)", "status": "Busy"}
        },
        "volunteers": {
            "total_active": 250, "on_shift": 220, "on_break": 30,
            "allocations": {"Zone A (Gates A/B)": 40, "Zone B (Gates C/D)": 80, "Level 1 Concourse": 30, "Level 2 Concourse": 20, "Level 3 Concourse": 20, "Transport Hubs": 30}
        },
        "sustainability": {
            "water_used_gallons": 24500, "waste_diverted_percent": 84.6, "carbon_saved_tons": 10.1, "solar_energy_generated_kwh": 2200, "energy_offset_percent": 36.2
        }
    }
}

class StadiumDatabase:
    def __init__(self):
        # Simulation Phase state
        self.sim_phase = "Pre-match"
        self.auto_progress = False
        self.tick_count = 0
        self.last_tick_time = datetime.now()

        # Telemetry databases (Baseline loaded from Pre-match template)
        self.matches = [
            {
                "id": "match-01",
                "teams": "USA vs England",
                "stage": "Group Stage",
                "date": "2026-07-04",
                "time": "18:00",
                "attendance": 82500,
                "status": "Completed",
                "score": "2 - 1"
            },
            {
                "id": "match-02",
                "teams": "Mexico vs Argentina",
                "stage": "Quarterfinal",
                "date": "2026-07-19",
                "time": "20:00",
                "attendance": 83000,
                "status": "Upcoming",
                "score": None
            },
            {
                "id": "match-03",
                "teams": "Canada vs France",
                "stage": "Group Stage",
                "date": "2026-07-08",
                "time": "15:00",
                "attendance": 78900,
                "status": "Completed",
                "score": "0 - 2"
            }
        ]

        # Load values from Pre-match template
        self.crowd_status = dict(PHASE_TEMPLATES["Pre-match"]["crowd_status"])
        self.concessions = list(PHASE_TEMPLATES["Pre-match"]["concessions"])
        self.restrooms = dict(PHASE_TEMPLATES["Pre-match"]["restrooms"])
        self.transport = dict(PHASE_TEMPLATES["Pre-match"]["transport"])
        self.volunteers = dict(PHASE_TEMPLATES["Pre-match"]["volunteers"])
        self.sustainability = dict(PHASE_TEMPLATES["Pre-match"]["sustainability"])

        # Incidents List
        self.incidents = [
            {
                "id": "inc-01",
                "title": "Medical Assist: Dehydration",
                "description": "A fan requires medical assessment for severe dehydration in Block 114, Row 12.",
                "location": "Block 114",
                "zone": "Zone A",
                "reporter": "Volunteer #4022",
                "status": "Active",
                "priority": "High",
                "assigned_staff": 2,
                "created_at": "2026-07-18T21:45:00"
            },
            {
                "id": "inc-02",
                "title": "Liquid Spill",
                "description": "Large beverage spill causing slipping hazard near Concession Section 102.",
                "location": "Concourse 102",
                "zone": "Zone A",
                "reporter": "Venue Staff #102",
                "status": "Resolved",
                "priority": "Low",
                "assigned_staff": 1,
                "created_at": "2026-07-18T20:10:00"
            },
            {
                "id": "inc-03",
                "title": "Turnstile Blockage",
                "description": "Scanner failure on Gate A Turnstile #5 causing visual queues build-up.",
                "location": "Gate A",
                "zone": "Zone A",
                "reporter": "Security Lead #12",
                "status": "Active",
                "priority": "Medium",
                "assigned_staff": 3,
                "created_at": "2026-07-18T21:55:00"
            }
        ]

        # Chronological Operation events
        self.timeline_events = [
            {"id": "evt-1", "timestamp": "2026-07-18T19:30:00", "category": "Match Phase", "message": "Pre-match stadium doors opened.", "severity": "Info"},
            {"id": "evt-2", "timestamp": "2026-07-18T20:10:00", "category": "Incident", "message": "Incident Reported: Liquid spill near Section 102.", "severity": "Low"},
            {"id": "evt-3", "timestamp": "2026-07-18T20:45:00", "category": "Staffing", "message": "Deployed 20 volunteers to Transit Hub platforms.", "severity": "Info"},
            {"id": "evt-4", "timestamp": "2026-07-18T21:45:00", "category": "Incident", "message": "Medical assist active in Block 114.", "severity": "High"},
            {"id": "evt-5", "timestamp": "2026-07-18T21:55:00", "category": "Incident", "message": "Gate A Turnstile scanner delay reported.", "severity": "Medium"},
            {"id": "evt-6", "timestamp": "2026-07-18T21:56:00", "category": "AI Recommendation", "message": "AI advised: Divert Gate A traffic to Gate B.", "severity": "Medium"}
        ]

    def update_simulation_phase(self, phase: str) -> bool:
        if phase not in PHASE_TEMPLATES:
            return False
            
        self.sim_phase = phase
        template = PHASE_TEMPLATES[phase]
        
        # Load variables
        self.crowd_status = dict(template["crowd_status"])
        self.concessions = list(template["concessions"])
        self.restrooms = dict(template["restrooms"])
        self.transport = dict(template["transport"])
        self.volunteers = dict(template["volunteers"])
        self.sustainability = dict(template["sustainability"])

        # Setup custom variables for match score progression
        upcoming_match = next((m for m in self.matches if m["id"] == "match-02"), None)
        if upcoming_match:
            if phase in ["Pre-match", "Entry Rush"]:
                upcoming_match["status"] = "Upcoming"
                upcoming_match["score"] = None
            elif phase in ["Kickoff", "Emergency Scenario", "Heavy Crowd", "Transport Delay", "Accessibility Surge"]:
                upcoming_match["status"] = "In-Progress"
                upcoming_match["score"] = "0 - 0"
            elif phase == "Halftime":
                upcoming_match["status"] = "In-Progress"
                upcoming_match["score"] = "1 - 0"
            elif phase == "Second Half":
                upcoming_match["status"] = "In-Progress"
                upcoming_match["score"] = "1 - 1"
            elif phase in ["Final Whistle", "Exit Rush", "Stadium Closed"]:
                upcoming_match["status"] = "Completed"
                upcoming_match["score"] = "2 - 1"

        # Special setup for Emergency Scenario
        if phase == "Emergency Scenario":
            # Add severe incidents if not already present
            cardiac_assist = next((i for i in self.incidents if i["title"] == "Medical assistance: Cardiac Arrest"), None)
            if not cardiac_assist:
                self.add_incident({
                    "title": "Medical Assist: Cardiac Arrest",
                    "description": "Spectator collapsed near Block 114 row 5. Stretcher required.",
                    "location": "Block 114",
                    "zone": "Zone A",
                    "reporter": "Security Post #4",
                    "status": "Active",
                    "priority": "High"
                })
            fire_spill = next((i for i in self.incidents if i["title"] == "Concourse Smoke Alert"), None)
            if not fire_spill:
                self.add_incident({
                    "title": "Concourse Smoke Alert",
                    "description": "Minor smoke reported near concession taco stall in Section 220.",
                    "location": "Section 220",
                    "zone": "Zone B",
                    "reporter": "Concession Manager",
                    "status": "Active",
                    "priority": "High"
                })

        # Append timeline log event
        self.add_timeline_event(
            category="Match Phase",
            message=f"Simulation phase modified to: {phase}.",
            severity="Info" if phase not in ["Emergency Scenario", "Heavy Crowd", "Transport Delay"] else "High"
        )
        return True

    def tick_simulation(self):
        self.tick_count += 1
        self.last_tick_time = datetime.now()
        
        # Advance sustainability metrics slightly on every tick
        self.sustainability["water_used_gallons"] += 12
        self.sustainability["solar_energy_generated_kwh"] += 3
        
        # Add small fluctuations to Gate wait times (e.g. within [1, 95] mins)
        for gate, info in self.crowd_status.items():
            if info["wait_time_minutes"] > 0:
                import random
                delta = random.choice([-1, 0, 1])
                info["wait_time_minutes"] = max(1, min(95, info["wait_time_minutes"] + delta))

        # Perform auto-progression if enabled (e.g. switch phase every 24 ticks = 2 minutes)
        if self.auto_progress and self.tick_count % 24 == 0:
            phases_list = ["Pre-match", "Entry Rush", "Kickoff", "Halftime", "Second Half", "Final Whistle", "Exit Rush", "Stadium Closed"]
            try:
                curr_idx = phases_list.index(self.sim_phase)
                next_phase = phases_list[(curr_idx + 1) % len(phases_list)]
                self.update_simulation_phase(next_phase)
            except ValueError:
                self.update_simulation_phase("Pre-match")

    def add_timeline_event(self, category: str, message: str, severity: str = "Info") -> Dict:
        evt_id = f"evt-{len(self.timeline_events) + 1}"
        new_event = {
            "id": evt_id,
            "timestamp": datetime.now().isoformat(),
            "category": category,
            "message": message,
            "severity": severity
        }
        self.timeline_events.append(new_event)
        return new_event

    def get_timeline_events(self) -> List[Dict]:
        return self.timeline_events

    def get_simulation_state(self) -> Dict:
        # Calculate dynamic health scores and explanations for dashboard widgets
        active_incidents = self.get_incidents(active_only=True)
        high_severity_count = sum(1 for i in active_incidents if i["priority"] == "High")
        med_severity_count = sum(1 for i in active_incidents if i["priority"] == "Medium")
        
        # Health score: start at 100, deduct for delays and incidents
        health_score = 100
        health_score -= (high_severity_count * 15)
        health_score -= (med_severity_count * 5)
        
        # Deduct for gate delays > 30 mins
        high_gate_waits = sum(1 for g, info in self.crowd_status.items() if info["wait_time_minutes"] > 30)
        health_score -= (high_gate_waits * 10)
        health_score = max(10, health_score)

        # Accessibility Status
        acc_status = "Nominal"
        acc_severity = "nominal"
        acc_desc = "All elevators operational. Accessible Lot D at 25% occupancy."
        if self.transport["parking"]["Lot D"]["occupancy_percent"] > 80:
            acc_status = "Capacity Surge"
            acc_severity = "warning"
            acc_desc = "Lot D is 95% full. Accessible shuttles diverted to backup lanes."
        elif any(i["location"] == "Gate C" and i["status"] == "Active" for i in active_incidents):
            acc_status = "Bottleneck Alert"
            acc_severity = "critical"
            acc_desc = "Gate C (Accessibility Entrance) blockage. Rerouting via Gate B elevators."

        # Staff coverage
        vol_pct = int((self.volunteers["on_shift"] / self.volunteers["total_active"]) * 100) if self.volunteers["total_active"] > 0 else 0
        vol_status = "nominal" if vol_pct >= 80 else ("warning" if vol_pct >= 60 else "critical")
        vol_desc = f"Optimal coverage: {self.volunteers['on_shift']} of {self.volunteers['total_active']} staff on shift."

        # Transport Reliability
        metro_del = self.transport["metro"].get("delay_minutes", 0)
        trans_score = max(30, 100 - (metro_del * 2.5))
        trans_status = "nominal" if trans_score >= 85 else ("warning" if trans_score >= 60 else "critical")
        trans_desc = f"Transit reliability high: metro running on {self.transport['metro']['frequency_minutes']}m intervals."
        if metro_del > 10:
            trans_desc = f"Metro Line Delay: train frequency delayed by {metro_del} minutes."

        # Crowd Flow Score
        crowd_waits = [info["wait_time_minutes"] for info in self.crowd_status.values()]
        avg_wait = sum(crowd_waits) / len(crowd_waits) if crowd_waits else 0
        flow_score = max(10, int(100 - (avg_wait * 1.5)))
        flow_status = "nominal" if flow_score >= 80 else ("warning" if flow_score >= 65 else "critical")
        flow_desc = f"Fluid stadium entry: average wait time across gates is {int(avg_wait)}m."
        if avg_wait > 30:
            flow_desc = f"Gate Congestion Alert: Gate A queue delay is {self.crowd_status['Gate A']['wait_time_minutes']}m."

        # Sustainability Index
        sust_score = int(self.sustainability["waste_diverted_percent"])
        sust_status = "nominal" if sust_score >= 80 else "warning"
        sust_desc = f"Green stadium goal achieved: solar panels generate {self.sustainability['solar_energy_generated_kwh']} kwh today."

        # Incidents KPI
        inc_status = "nominal" if len(active_incidents) == 0 else ("warning" if high_severity_count == 0 else "critical")
        inc_desc = f"Zero active hazards. Operational grid safe."
        if active_incidents:
            inc_desc = f"{len(active_incidents)} active incident(s): high priority help dispatcher alert."

        return {
            "phase": self.sim_phase,
            "auto_progress": self.auto_progress,
            "telemetry_freshness": datetime.now().isoformat(),
            "kpis": {
                "health": {"score": f"{health_score}%", "trend": "stable" if health_score == 100 else "down", "status": "nominal" if health_score >= 85 else ("warning" if health_score >= 65 else "critical"), "explanation": "Health score calculated based on active incidents and queue delay indicators."},
                "accessibility": {"score": acc_status, "trend": "stable", "status": acc_severity, "explanation": acc_desc},
                "volunteers": {"score": f"{vol_pct}%", "trend": "stable", "status": vol_status, "explanation": vol_desc},
                "transport": {"score": f"{int(trans_score)}%", "trend": "down" if metro_del > 5 else "stable", "status": trans_status, "explanation": trans_desc},
                "crowd": {"score": f"{flow_score}%", "trend": "stable", "status": flow_status, "explanation": flow_desc},
                "sustainability": {"score": f"{sust_score}%", "trend": "up", "status": sust_status, "explanation": sust_desc},
                "incidents": {"score": "Critical" if high_severity_count > 0 else ("Medium" if med_severity_count > 0 else "Nominal"), "trend": "up" if active_incidents else "stable", "status": inc_status, "explanation": inc_desc}
            }
        }

    def get_proactive_insights(self) -> List[str]:
        # Generate list of actionable scrolling toast notifications based on active state
        insights = []
        
        # Check gate wait times
        for gate, info in self.crowd_status.items():
            if info["wait_time_minutes"] > 35:
                insights.append(f"Gate {gate[-1]} wait time spiked to {info['wait_time_minutes']} minutes. Suggest rerouting traffic.")
                
        # Check transport delays
        metro_del = self.transport["metro"].get("delay_minutes", 0)
        if metro_del > 8:
            insights.append(f"Meadowlands Station Metro delayed by {metro_del} minutes. Expect train queues.")
            
        # Check active high priority incidents
        active = self.get_incidents(active_only=True)
        for inc in active:
            if inc["priority"] == "High":
                insights.append(f"ALERT: High priority incident '{inc['title']}' active in {inc['location']}.")
                
        # Check sustainability
        if self.sustainability["waste_diverted_percent"] > 85.0:
            insights.append("Sustainability Achievement: waste diversion targets exceeded (85%+ diverted).")
            
        # Default fallback insights if empty
        if not insights:
            insights.append("MatchOps AI telemetry feed synchronized. All systems running nominal.")
            insights.append("Gate C remains the fastest spectator entry checkpoint (5m wait).")
            
        return insights

    # Original Database Query methods
    def get_all_matches(self) -> List[Dict]:
        return self.matches

    def get_crowd_status(self) -> Dict:
        return self.crowd_status

    def get_concessions(self) -> List[Dict]:
        return self.concessions

    def get_restrooms(self) -> Dict:
        return self.restrooms

    def get_transport(self) -> Dict:
        return self.transport

    def get_incidents(self, active_only: bool = False) -> List[Dict]:
        if active_only:
            return [i for i in self.incidents if i["status"] == "Active"]
        return self.incidents

    def add_incident(self, incident: Dict) -> Dict:
        new_id = f"inc-{len(self.incidents) + 1:02d}"
        incident["id"] = new_id
        if "created_at" not in incident:
            incident["created_at"] = datetime.utcnow().isoformat()
        self.incidents.append(incident)
        
        # Log to timeline
        self.add_timeline_event(
            category="Incident",
            message=f"Incident Reported: {incident['title']} in {incident['location']}.",
            severity=incident.get("priority", "Medium")
        )
        return incident

    def update_incident_status(self, incident_id: str, status: str) -> bool:
        for incident in self.incidents:
            if incident["id"] == incident_id:
                incident["status"] = status
                # Log to timeline
                self.add_timeline_event(
                    category="Incident",
                    message=f"Incident {incident_id} ({incident['title']}) status updated to {status}.",
                    severity="Info"
                )
                return True
        return False

    def get_volunteers(self) -> Dict:
        return self.volunteers

    def reallocate_volunteers(self, from_zone: str, to_zone: str, count: int) -> bool:
        alloc = self.volunteers["allocations"]
        if from_zone in alloc and to_zone in alloc:
            if alloc[from_zone] >= count:
                alloc[from_zone] -= count
                alloc[to_zone] += count
                # Log to timeline
                self.add_timeline_event(
                    category="Staffing",
                    message=f"Reallocated {count} staff from {from_zone} to {to_zone}.",
                    severity="Info"
                )
                return True
        return False

    def get_sustainability(self) -> Dict:
        return self.sustainability

    def update_sustainability(self, field: str, value: float) -> bool:
        if field in self.sustainability:
            self.sustainability[field] = value
            return True
        return False

# Global database instance
db = StadiumDatabase()
