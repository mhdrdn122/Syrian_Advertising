export const RoadSignFields = [
  { label: 'نموذج', key: 'template.model', icon: 'mdi:shape-outline' },
  { label: 'رقم اللوحة', key: 'number', icon: 'mdi:numeric' },
  { label: 'عدد الأوجه', key: 'faces_number', icon: 'mdi:cube-outline' },
  { label: 'عدد الأمتار', key: 'advertising_meters', icon: 'mdi:image-area', format: (value) => `${value}m²` },
  { label: 'عدد أمتار الطباعة', key: 'printing_meters', icon: 'mdi:printer', format: (value) => `${value}m²` },
  { label: 'المدينة', key: 'city.name', icon: 'mdi:map' },
  { label: 'المنطقة', key: 'region.name', icon: 'mdi:map' },
  { label: 'مكان التموضع', key: 'place', icon: 'mdi:map-marker' },
  { label: 'الاتجاه', key: 'directions', icon: 'mdi:compass' },
  { label: 'الحالة', key: 'is_available', icon: 'mdi:check-circle-outline', format: (value) => (value ? 'متاح' : 'غير متاح') },
];