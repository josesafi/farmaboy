import re

with open('src/config/initialAdminData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace initialDeliveryRates
content = re.sub(
    r'export const initialDeliveryRates: DeliveryRate\[\] = \[.*?\];',
    '''export const initialDeliveryRates: DeliveryRate[] = [
  {
    id: "rate-duitama",
    department: "Boyacá",
    municipality: "Duitama",
    zone: "Casco Urbano Duitama",
    rateCOP: 5000,
    minOrderCOP: 0,
    freeShippingFromCOP: 70000,
    estimatedTime: "30 a 60 min",
    isActive: true,
  },
];''',
    content,
    flags=re.DOTALL
)

# Replace initialPickupPoints
content = re.sub(
    r'export const initialPickupPoints: PickupPoint\[\] = \[.*?\];',
    '''export const initialPickupPoints: PickupPoint[] = [
  {
    id: "pickup-duitama-centro",
    name: "Sede Principal Farmaboy - Duitama",
    address: "Transversal 29 # 10-63, Duitama, Boyacá",
    municipality: "Duitama",
    phone: "+57 313 427 9559 / 321 265 1303",
    coordinates: "5.8172853, -73.0295171",
    schedule: "Lunes a Sábado: 7:00 a.m. – 8:30 p.m. | Domingos y Festivos: 8:00 a.m. – 5:00 p.m.",
    days: "Lunes a Domingo",
    status: "ACTIVO",
  },
];''',
    content,
    flags=re.DOTALL
)

# Also update deliveryZones in storeSettings
content = re.sub(
    r'deliveryZones: \[\s*{[^]]*}\s*\],',
    '''deliveryZones: [
    { city: "Duitama", feeCOP: 5000, estimatedTime: "30 a 60 min", isActive: true },
  ],''',
    content,
    flags=re.DOTALL
)

with open('src/config/initialAdminData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated initialAdminData.ts")
