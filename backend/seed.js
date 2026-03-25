require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

const hotels = [
    {
        name: 'The Grand Imperial', description: 'A luxurious 5-star hotel in the heart of Mumbai with world-class amenities and breathtaking views.',
        location: { city: 'Mumbai', address: '22 Marine Drive, Nariman Point', country: 'India' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        rating: 4.8, reviewCount: 542, featured: true, amenities: ['Free WiFi', 'Spa', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Valet Parking', 'Concierge'],
        cheapestPrice: 8500,
    },
    {
        name: 'Raj Palace Heritage', description: 'Experience the royal Rajputana lifestyle in this 200-year-old palace converted into a boutique hotel.',
        location: { city: 'Jaipur', address: 'Civil Lines, Near Albert Hall', country: 'India' },
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1551882547-ff40c4fe5f6c?w=800'],
        rating: 4.9, reviewCount: 389, featured: true, amenities: ['Free WiFi', 'Heritage Tours', 'Pool', 'Restaurant', 'Bar', 'Spa', 'Cultural Shows'],
        cheapestPrice: 12000,
    },
    {
        name: 'Beachside Retreat', description: 'Wake up to the sound of waves in this stunning beachside resort with private beach access.',
        location: { city: 'Goa', address: 'Calangute Beach Road, North Goa', country: 'India' },
        images: ['https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        rating: 4.6, reviewCount: 723, featured: true, amenities: ['Private Beach', 'Pool', 'Water Sports', 'Restaurant', 'Bar', 'Spa', 'Free WiFi'],
        cheapestPrice: 6500,
    },
    {
        name: 'Himalayan Serenity Lodge', description: 'Nestled in the Himalayas, this eco-resort offers panoramic mountain views and guided treks.',
        location: { city: 'Manali', address: 'Old Manali Road, Vashisht', country: 'India' },
        images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800'],
        rating: 4.7, reviewCount: 214, featured: true, amenities: ['Mountain View', 'Trekking', 'Bonfire', 'Restaurant', 'Yoga', 'Free WiFi'],
        cheapestPrice: 4500,
    },
    {
        name: 'City Hub Business Hotel', description: 'Modern business hotel in central Delhi with state-of-the-art conference facilities.',
        location: { city: 'Delhi', address: 'Connaught Place, New Delhi', country: 'India' },
        images: ['https://images.unsplash.com/photo-1455587734955-081b22074882?w=800', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
        rating: 4.3, reviewCount: 891, featured: false, amenities: ['Free WiFi', 'Business Center', 'Gym', 'Restaurant', 'Concierge', 'Airport Shuttle'],
        cheapestPrice: 3500,
    },
    {
        name: 'Backwaters Houseboat Resort', description: 'Stay on a floating houseboat cruising the serene Kerala backwaters — a truly unique experience.',
        location: { city: 'Kerala', address: 'Alleppey Backwaters, Alappuzha', country: 'India' },
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'],
        rating: 4.9, reviewCount: 302, featured: true, amenities: ['Boat Cruise', 'Kerala Cuisine', 'Fishing', 'Yoga', 'Free WiFi', 'Sunset Views'],
        cheapestPrice: 9000,
    },
];

const roomTypes = [
    { title: 'Standard Room', description: 'A cozy and well-appointed standard room with all basic amenities.', price: null, maxGuests: 2, roomType: 'Standard', amenities: ['AC', 'TV', 'WiFi', 'Attached Bathroom', 'Room Service'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'] },
    { title: 'Deluxe Room', description: 'A spacious deluxe room with premium furnishings and a city/garden view.', price: null, maxGuests: 2, roomType: 'Deluxe', amenities: ['AC', 'Smart TV', 'WiFi', 'Minibar', 'Bathtub', 'Room Service', 'Daily Housekeeping'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'] },
    { title: 'Luxury Suite', description: 'An opulent suite with a separate living area, jacuzzi and premium amenities.', price: null, maxGuests: 4, roomType: 'Suite', amenities: ['AC', 'Smart TV', 'WiFi', 'Jacuzzi', 'Kitchen', 'Butler Service', 'Premium Toiletries', 'Welcome Drink'], images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'] },
    { title: 'Family Room', description: 'A large family room with extra beds, perfect for families travelling together.', price: null, maxGuests: 5, roomType: 'Family', amenities: ['AC', 'TV', 'WiFi', 'Extra Beds', 'Crib Available', 'Room Service'], images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'] },
];

const priceMultipliers = { Standard: 1, Deluxe: 1.6, Suite: 3, Family: 2 };

const seed = async () => {
    await connectDB();
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();

    // Create admin
    await User.create({ name: 'Admin User', email: 'admin@hotel.com', password: 'admin123', role: 'admin', phone: '9999999999' });
    // Create test user
    await User.create({ name: 'John Doe', email: 'john@hotel.com', password: 'john1234', role: 'user', phone: '8888888888' });

    for (const hotelData of hotels) {
        const hotel = await Hotel.create(hotelData);
        for (const rt of roomTypes) {
            const multiplier = priceMultipliers[rt.roomType];
            await Room.create({ ...rt, hotel: hotel._id, price: Math.round(hotel.cheapestPrice * multiplier / 100) * 100 });
        }
        // Update cheapest price to populate rooms array
        const rooms = await Room.find({ hotel: hotel._id });
        hotel.rooms = rooms.map(r => r._id);
        hotel.cheapestPrice = Math.min(...rooms.map(r => r.price));
        await hotel.save();
    }

    console.log('✅ Seed complete! 6 hotels, 24 rooms, 2 users created.');
    console.log('   Admin: admin@hotel.com / admin123');
    console.log('   User:  john@hotel.com / john1234');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
