import { Fuel, Gauge, Calendar, DollarSign, Zap, Settings } from 'lucide-react';

interface CarSpecsProps {
  postId: number;
}

export default function CarSpecs({ postId }: CarSpecsProps) {
  // Generate fake specs based on post ID for consistency
  const getSpecsByPostId = (id: number) => {
    const models = ['2024', '2023', '2025'];
    const fuelTypes = ['Electric', 'Hybrid', 'Gasoline', 'Diesel'];
    const speeds = ['120', '150', '180', '200', '250'];
    const prices = ['$25,000', '$35,000', '$45,000', '$55,000', '$75,000'];
    const power = ['150', '200', '300', '400', '500'];
    const transmission = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];

    return {
      modelYear: models[id % models.length],
      fuelType: fuelTypes[id % fuelTypes.length],
      topSpeed: `${speeds[id % speeds.length]} mph`,
      price: prices[id % prices.length],
      horsepower: `${power[id % power.length]} HP`,
      transmission: transmission[id % transmission.length]
    };
  };

  const specs = getSpecsByPostId(postId);

  const specItems = [
    {
      icon: Calendar,
      label: 'Model Year',
      value: specs.modelYear,
      color: 'text-blue-600'
    },
    {
      icon: Fuel,
      label: 'Fuel Type',
      value: specs.fuelType,
      color: 'text-green-600'
    },
    {
      icon: Gauge,
      label: 'Top Speed',
      value: specs.topSpeed,
      color: 'text-red-600'
    },
    {
      icon: DollarSign,
      label: 'Starting Price',
      value: specs.price,
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      label: 'Horsepower',
      value: specs.horsepower,
      color: 'text-orange-600'
    },
    {
      icon: Settings,
      label: 'Transmission',
      value: specs.transmission,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Vehicle Specifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 p-3 rounded-lg bg-white shadow-sm`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert Rating</h4>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-6 h-6 bg-yellow-400 rounded-full"></div>
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">4.8/5</span>
          <span className="text-gray-600">Based on expert review</span>
        </div>
      </div>
    </div>
  );
}