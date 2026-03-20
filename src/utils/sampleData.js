/**
 * Demo/sample data for the application
 * Used when Firebase is not configured
 */

export const sampleProperties = [
  {
    id: '1',
    title: 'Luxury Sky Villa at Koregaon Park',
    price: 35000000,
    city: 'Pune',
    area: 'Koregaon Park',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    areaSize: 3500,
    parking: 2,
    floor: '12th',
    facing: 'East',
    furnished: 'Semi-Furnished',
    featured: true,
    description: 'Experience luxury living with panoramic city views in this stunning sky villa featuring modern architecture and premium finishes.',
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Garden', 'Security', 'Power Backup', 'Lift'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Premium 3BHK at Hinjewadi Phase 1',
    price: 12500000,
    city: 'Pune',
    area: 'Hinjewadi',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    areaSize: 1850,
    parking: 1,
    floor: '7th',
    facing: 'North',
    furnished: 'Unfurnished',
    featured: true,
    description: 'Modern apartment in the heart of IT hub with excellent connectivity and world-class amenities.',
    amenities: ['Swimming Pool', 'Gym', 'Playground', 'Security', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    createdAt: new Date('2024-02-10')
  },
  {
    id: '3',
    title: 'Commercial Office Space at Baner',
    price: 28000000,
    city: 'Pune',
    area: 'Baner',
    type: 'Office',
    bedrooms: 0,
    bathrooms: 2,
    areaSize: 4200,
    parking: 4,
    floor: '3rd',
    facing: 'West',
    furnished: 'Furnished',
    featured: false,
    description: 'Prime commercial office space in a prestigious business district.',
    amenities: ['Lift', 'Security', 'Power Backup', 'Parking', 'Cafeteria'],
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    createdAt: new Date('2024-03-01')
  },
  {
    id: '4',
    title: 'Elegant Row House in Wagholi',
    price: 8500000,
    city: 'Pune',
    area: 'Wagholi',
    type: 'Villa',
    bedrooms: 3,
    bathrooms: 3,
    areaSize: 2400,
    parking: 2,
    floor: 'Ground + 1',
    facing: 'South',
    furnished: 'Semi-Furnished',
    featured: true,
    description: 'Beautiful row house with private garden and modern interiors in a gated community.',
    amenities: ['Garden', 'Club House', 'Playground', 'Security', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    createdAt: new Date('2024-03-10')
  },
  {
    id: '5',
    title: 'Modern 2BHK at Kharadi',
    price: 7800000,
    city: 'Pune',
    area: 'Kharadi',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSize: 1200,
    parking: 1,
    floor: '15th',
    facing: 'North-East',
    furnished: 'Unfurnished',
    featured: false,
    description: 'Contemporary 2BHK apartment with stunning views and excellent connectivity.',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    createdAt: new Date('2024-03-15')
  },
  {
    id: '6',
    title: 'Industrial Warehouse at Chakan',
    price: 45000000,
    city: 'Pune',
    area: 'Chakan',
    type: 'Warehouse',
    bedrooms: 0,
    bathrooms: 2,
    areaSize: 15000,
    parking: 10,
    floor: 'Ground',
    facing: 'South',
    furnished: 'Unfurnished',
    featured: false,
    description: 'Spacious industrial warehouse ideal for manufacturing and logistics operations.',
    amenities: ['Loading Dock', 'Security', 'Power Supply', 'Water Supply'],
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
    createdAt: new Date('2024-03-20')
  }
];

export const sampleProjects = [
  {
    id: '1',
    name: 'SkyLine Towers',
    location: 'Baner, Pune',
    status: 'Ongoing',
    category: 'Residential',
    description: 'Premium residential towers with world-class amenities and breathtaking views.',
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Jogging Track', 'Children Play Area'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'TechPark Plaza',
    location: 'Hinjewadi, Pune',
    status: 'Completed',
    category: 'Commercial',
    description: 'State-of-the-art commercial complex in the IT corridor.',
    amenities: ['Parking', 'Food Court', 'Conference Rooms', 'High-Speed Internet'],
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    createdAt: new Date('2023-06-15')
  },
  {
    id: '3',
    name: 'Green Valley Residences',
    location: 'Wakad, Pune',
    status: 'Upcoming',
    category: 'Residential',
    description: 'Eco-friendly residential development surrounded by nature.',
    amenities: ['Organic Farm', 'Solar Power', 'Rainwater Harvesting', 'EV Charging'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    createdAt: new Date('2024-06-01')
  },
  {
    id: '4',
    name: 'Industrial Hub Complex',
    location: 'Chakan, Pune',
    status: 'Ongoing',
    category: 'Industrial',
    description: 'Modern industrial complex with plug-and-play facilities.',
    amenities: ['Loading Bay', 'Fire Safety', '24/7 Security', 'Utilities'],
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    name: 'Luxury Interior Studio',
    location: 'Koregaon Park, Pune',
    status: 'Completed',
    category: 'Interior',
    description: 'Bespoke interior design studio and showroom.',
    amenities: ['Display Gallery', 'Consultation Room', 'VR Room'],
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800'],
    createdAt: new Date('2023-12-01')
  }
];

export const sampleTestimonials = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    review: 'Outstanding quality construction and timely delivery. BuildEstate exceeded all our expectations with their attention to detail.',
    rating: 5,
    photo: null,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Priya Patel',
    review: 'We found our dream home through BuildEstate. The entire process was smooth and transparent. Highly recommended!',
    rating: 5,
    photo: null,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Amit Deshmukh',
    review: 'Professional team, excellent project management, and premium quality materials. A truly reliable construction partner.',
    rating: 4,
    photo: null,
    createdAt: new Date('2024-03-10')
  }
];

export const services = [
  {
    id: 1,
    title: 'Contracting & EPC Projects',
    description: 'Complete engineering and construction solutions for large-scale infrastructure projects.',
    icon: 'HiOutlineBuildingOffice2',
    dummyImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Industrial Construction',
    description: 'Specialized industrial facility construction with focus on efficiency and safety.',
    icon: 'HiOutlineCog6Tooth',
    dummyImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Commercial Construction',
    description: 'Premium commercial spaces designed for modern business needs.',
    icon: 'HiOutlineBuildingStorefront',
    dummyImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'Residential Construction',
    description: 'Dream homes built with precision, quality, and attention to every detail.',
    icon: 'HiOutlineHome',
    dummyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    title: 'Interior Design',
    description: 'Bespoke interior solutions that transform spaces into extraordinary experiences.',
    icon: 'HiOutlinePaintBrush',
    dummyImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    title: 'Land Development',
    description: 'Strategic land development and township planning for sustainable growth.',
    icon: 'HiOutlineMap',
    dummyImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 7,
    title: 'Real Estate Development',
    description: 'Comprehensive real estate development from concept to completion.',
    icon: 'HiOutlineChartBar',
    dummyImage: 'https://images.unsplash.com/photo-1454165833767-027558334011?auto=format&fit=crop&q=80&w=800'
  }
];

export const stats = [
  { label: 'Years of Experience', value: 15, suffix: '+' },
  { label: 'Projects Completed', value: 200, suffix: '+' },
  { label: 'Cities Served', value: 12, suffix: '' },
  { label: 'Happy Clients', value: 500, suffix: '+' }
];

export const sampleLeads = [
  {
    id: '1',
    name: 'Vikram Singh',
    phone: '9876543210',
    email: 'vikram@example.com',
    property: 'Luxury Sky Villa at Koregaon Park',
    message: 'Interested in site visit this weekend.',
    status: 'New',
    notes: [],
    createdAt: new Date('2024-03-14')
  },
  {
    id: '2',
    name: 'Sneha Kulkarni',
    phone: '9876543211',
    email: 'sneha@example.com',
    property: 'Premium 3BHK at Hinjewadi',
    message: 'Looking for home loan assistance.',
    status: 'Contacted',
    notes: [{ text: 'Called and discussed pricing', date: '2024-03-13' }],
    createdAt: new Date('2024-03-12')
  },
  {
    id: '3',
    name: 'Rahul Joshi',
    phone: '9876543212',
    email: 'rahul@example.com',
    property: 'Commercial Office Space at Baner',
    message: 'Need 4000 sqft office space.',
    status: 'Follow Up',
    notes: [],
    createdAt: new Date('2024-03-10')
  }
];
