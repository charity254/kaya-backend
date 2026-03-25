# Kilimo Trace - Buyer Profile Implementation (Version 9)

## Overview
Complete implementation of two distinct buyer profiles with separate onboarding processes and specialized dashboards featuring traceability maps.

---

## 🔄 BUYER ONBOARDING FLOW

### Step 1: Role Selection
**Screen:** `LandingPage.tsx` → `RoleSelection.tsx`
- User selects "Buyer" role from three options (Farmer, Aggregator, Buyer)

### Step 2: Buyer Type Selection
**Screen:** `BuyerTypeSelection.tsx`
**Options:**
1. **Supplier / Trader**
   - For local traders, wholesalers, retailers, institutional buyers
   - Local and domestic markets
   
2. **Exporter**
   - For international export businesses
   - Requires certifications and export licenses

**Key Feature:** Buyer type is **immutable** after registration

---

## 👔 SUPPLIER / TRADER PROFILE

### Onboarding Process
**Screen:** `SupplierTraderRegistration.tsx`

**Required Fields:**
- ✅ Business Name
- ✅ County (Kenya counties dropdown)
- ✅ End Market Type (Local / Wholesale / Retail / Institutional)
- ✅ Average Weekly Volume (kg)

**Optional Fields:**
- Preferred Crops (multi-select chips)

**System Action:**
- Creates buyer profile with `buyer_type = supplier_trader`
- Generates unique `buyer_id`
- Stores timestamp and marks as immutable

### Dashboard Features
**Screen:** `BuyerDashboard.tsx` (with `buyerType='supplier_trader'`)

**Main Features:**
1. **Sourcing Traceability Map** 🗺️
   - Visual map of Kenya showing:
     - Aggregator hubs (orange markers)
     - Direct farmer sources (green markers)
     - Connection lines to buyer location
   - Interactive tooltips with produce details
   - Source statistics (X hubs • Y farms)

2. **Produce Catalog**
   - Browse from aggregators or direct from farmers
   - Filter options: All / Direct from Farmers / From Aggregators
   - Full traceability information per batch

3. **Order Management**
   - View orders
   - Track status (pending / confirmed)
   - Cancel pending orders

---

## 🌍 EXPORTER PROFILE

### Onboarding Process
**Screen:** `ExporterRegistration.tsx`

**Required Fields:**
- ✅ Business Name
- ✅ County
- ✅ Export Markets (multi-select)
  - European Union, UK, United States, Middle East, Asia Pacific, East/South/North Africa
- ✅ Certification Type
  - GlobalGAP, Organic (EU/USDA), Fair Trade, Rainforest Alliance, HACCP
- ✅ Certification ID
- ✅ Certification Expiry Date (must be future date)
- ✅ Export License Number

**Optional Fields:**
- Packhouse Required (checkbox, default: true)

**System Action:**
- Creates buyer profile with `buyer_type = exporter`
- Generates unique `buyer_id`
- Validates certification expiry is in future
- Stores timestamp and marks as immutable

### Dashboard Features
**Screen:** `BuyerDashboard.tsx` (with `buyerType='exporter'`)

**Main Features:**
1. **Export Sourcing Traceability Map** 🗺️
   - Same visual map with special export focus:
     - Highlights aggregator hubs (certified produce)
     - Shows direct farm options
     - **Special Note:** "Aggregator hubs provide verified, certified produce suitable for export markets"

2. **Certified Produce Catalog**
   - Browse certified produce suitable for export
   - Additional filter: "Certified Only"
   - Quality grades clearly displayed
   - Source verification (Via Aggregator badge)

3. **Order Management**
   - Same order features as supplier/trader
   - Emphasis on certification tracking

---

## 🗺️ TRACEABILITY MAP COMPONENT

**Component:** `BuyerSourcingMap.tsx`

### Visual Elements

**Map Display:**
- Simplified Kenya map outline
- GPS-based positioning of sources
- Color-coded markers:
  - 🟠 Orange (Aggregator Hubs) - Package icon
  - 🟢 Green (Direct Farms) - Sprout icon
  - 🟢 Green Center (Buyer Location) - Building icon

**Interactive Features:**
- Hover tooltips showing:
  - Source name
  - Location (County)
  - Available produce
  - Quantity available
- Connection lines from sources to buyer
- Real-time counts: "X hubs • Y farms"

**Source List:**
Two sections below map:
1. **Aggregator Hubs (Count)**
   - Orange background cards
   - Hub name, location, produce, quantity
   
2. **Direct from Farms (Count)**
   - Green background cards
   - Farmer name, location, produce, quantity

**Legend:**
- Clear visual guide for marker types
- Helps users understand sourcing options

---

## 📊 DATA STRUCTURE

### Buyer Profile (Supplier/Trader)
```typescript
{
  buyerId: "BUY-1737547200-ABC123XYZ",
  buyerType: "supplier_trader",
  businessName: "Fresh Produce Traders",
  county: "Nairobi",
  endMarketType: "wholesale",
  averageWeeklyVolume: "500",
  preferredCrops: ["Tomatoes", "Cabbage"],
  phoneNumber: "712345678",
  createdAt: "2026-01-22T10:30:00Z",
  immutable: true
}
```

### Buyer Profile (Exporter)
```typescript
{
  buyerId: "BUY-1737547200-DEF456UVW",
  buyerType: "exporter",
  businessName: "Kenya Export Ltd",
  county: "Nairobi",
  exportMarkets: ["European Union", "United Kingdom"],
  certificationType: "GlobalGAP",
  certificationId: "GGAP-2024-001",
  certificationExpiry: "2027-12-31",
  exportLicenseNumber: "EXP-2024-KE-001",
  packhouseRequired: true,
  phoneNumber: "712345678",
  createdAt: "2026-01-22T10:30:00Z",
  immutable: true
}
```

### Source Location (Map Data)
```typescript
{
  type: "aggregator" | "farmer",
  name: "Central Collection Hub" | "John Mwangi Farm",
  location: "Nairobi County",
  coordinates: { lat: -1.286389, lng: 36.817223 },
  availableProduce: "Mixed Vegetables",
  quantity: "730 kg"
}
```

---

## 🎯 KEY FEATURES & BENEFITS

### For Supplier/Trader:
✅ Simple onboarding (4 required fields)
✅ Visual sourcing map for decision making
✅ Option to source from aggregators OR directly from farmers
✅ Clear traceability from farm to market
✅ Order management and tracking

### For Exporter:
✅ Comprehensive certification tracking
✅ Multi-market selection
✅ Export-optimized sourcing recommendations
✅ Emphasis on certified, verified produce
✅ Packhouse requirements clearly communicated

### Shared Benefits:
✅ **Traceability Map** - Visual representation of sourcing options
✅ **Dual Sourcing Options** - Aggregator hubs OR direct from farmers
✅ **Full Transparency** - Complete batch history visible
✅ **GPS Verification** - Location-based trust building
✅ **Immutable Records** - Data integrity maintained

---

## 🔒 DATA INTEGRITY RULES

1. **Buyer Type Lock**
   - Once selected, buyer_type cannot be changed
   - Prevents profile type switching

2. **Certification Validation** (Exporters)
   - Expiry date must be in the future
   - All certification fields required

3. **Source Verification**
   - Aggregator records linked to facility_id
   - Farmer records linked to farm_id
   - GPS coordinates validated within Kenya bounds

---

## 🚀 USER JOURNEY

```
Landing Page (Agricultural Images)
    ↓
Get Started Button
    ↓
Role Selection (Farmer / Aggregator / Buyer)
    ↓
Buyer Type Selection (Supplier/Trader OR Exporter)
    ↓
Registration Form (Type-Specific Fields)
    ↓
✅ Profile Created (Immutable)
    ↓
Main Dashboard with Traceability Map
    ↓
Browse & Source Produce
    ↓
Place Orders & Track
```

---

## 📱 MOBILE-OPTIMIZED UI

- **Responsive Maps** - Touch-friendly interactions
- **Large Touch Targets** - Easy navigation
- **Clear Typography** - Readable on small screens
- **Swipeable Filters** - Horizontal scroll for categories
- **Bottom Navigation** - Thumb-friendly placement

---

## 🎨 DESIGN CONSISTENCY

**Color Scheme:**
- 🟢 Agricultural Green (#2d5f3f) - Primary, trust, farming
- 🟠 Market Orange (#e8915f) - Secondary, trade, movement
- ⚪ Clean Backgrounds (#fafaf8) - Clarity, readability
- 🔵 Info Blue - Aggregator indicators

**Icons:**
- Sprout 🌱 - Farmers
- Package 📦 - Aggregators
- ShoppingBag 🛍️ - Buyers/Orders
- Globe 🌍 - Export markets
- Building2 🏢 - Buyer location

---

## ✅ IMPLEMENTATION STATUS

- ✅ Buyer Type Selection implemented
- ✅ Supplier/Trader registration form complete
- ✅ Exporter registration form complete
- ✅ Dashboard with role-specific UI
- ✅ Traceability Map fully functional
- ✅ Interactive source tooltips
- ✅ Source list with categorization
- ✅ Order management interface
- ✅ Back navigation throughout flow
- ✅ Mobile-responsive design
- ✅ Data immutability enforced

---

**Version:** 9.0
**Last Updated:** January 22, 2026
**Status:** Production Ready ✅
