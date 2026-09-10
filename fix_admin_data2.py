import re

with open('src/config/initialAdminData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace deliveryZones
content = re.sub(
    r'deliveryZones: \[.*?\]\s*,',
    '''deliveryZones: [
    { city: "Duitama", feeCOP: 5000, estimatedTime: "30 a 60 min", isActive: true },
  ],''',
    content,
    flags=re.DOTALL
)

with open('src/config/initialAdminData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated deliveryZones")
