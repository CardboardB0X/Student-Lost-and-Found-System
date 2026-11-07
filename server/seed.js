import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import LostFoundItem from './models/LostFoundItem.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const sampleUsers = [
  {
    name: 'Emmanuel Creo',
    studentId: '2024-10101',
    email: 'emmanuel.creo@cvsu.edu.ph',
    password: 'password123',
    role: 'STUDENT',
    phone: '09171010101'
  },
  {
    name: 'Von Arvin Apilado',
    studentId: '2024-10202',
    email: 'vonarvin.apilado@cvsu.edu.ph',
    password: 'password123',
    role: 'STUDENT',
    phone: '09172020202'
  },
  {
    name: 'Prof. Rai Acosta',
    studentId: 'PROF-001',
    email: 'rai.acosta@cvsu.edu.ph',
    password: 'password123',
    role: 'STAFF',
    phone: '09183030303'
  },
  {
    name: 'Prof. Adrian Sanchez',
    studentId: 'PROF-002',
    email: 'adrian.sanchez@cvsu.edu.ph',
    password: 'password123',
    role: 'STAFF',
    phone: '09184040404'
  },
  {
    name: 'Officer Andersen Avellana',
    studentId: 'SEC-001',
    email: 'andersen.avellana@cvsu.edu.ph',
    password: 'password123',
    role: 'STAFF',
    phone: '09195050505'
  },
  {
    name: 'Gabrielle Red Jeciel',
    studentId: 'LAB-001',
    email: 'gabrielle.jeciel@cvsu.edu.ph',
    password: 'password123',
    role: 'STAFF',
    phone: '09196060606'
  }
];

const sampleItems = [
  {
    title: 'Apple iPad Pro 11-inch with Apple Pencil (2nd Gen)',
    category: 'Electronics',
    itemType: 'FOUND',
    description: 'Space Gray iPad Pro (11-inch) displaying 8:33 on lock screen with vibrant red/blue wallpaper. Left on the study desk together with a white magnetic Apple Pencil (2nd Gen) and folded charcoal Smart Folio cover.',
    locationFound: 'Main Library 2nd Floor - Quiet Study Area',
    dateFound: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'With Finder (Prof. Rai Acosta)',
    imageUrl: '/sample-items/ipad.jpg',
    deviceDetails: {
      brand: 'Apple',
      model: 'iPad Pro 11-inch',
      color: 'Space Gray'
    },
    contactInfo: {
      founderName: 'Prof. Rai Acosta',
      contactChannel: 'rai.acosta@cvsu.edu.ph | 09183030303'
    }
  },
  {
    title: 'Lost Apple iPad Pro 11-inch with Apple Pencil',
    category: 'Electronics',
    itemType: 'LOST',
    description: 'Misplaced my Space Gray 11-inch iPad Pro with a white 2nd Gen Apple Pencil attached while studying for finals. Lock screen has a colorful red/cyan wave wallpaper. Urgently needed for thesis.',
    locationFound: 'Main Library 2nd Floor',
    dateFound: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'Lost by Owner (Von Arvin Apilado)',
    imageUrl: '/sample-items/ipad.jpg',
    deviceDetails: {
      brand: 'Apple',
      model: 'iPad Pro 11-inch',
      color: 'Space Gray'
    },
    contactInfo: {
      founderName: 'Von Arvin Apilado',
      contactChannel: 'vonarvin.apilado@cvsu.edu.ph | 09172020202'
    }
  },
  {
    title: 'Orange Campus Lanyard with Transparent ID Badge Holder',
    category: 'ID & Cards',
    itemType: 'FOUND',
    description: 'Bright orange woven neck lanyard with white Namics typography and silver swivel snap clasp holding a clear horizontal plastic ID badge sleeve.',
    locationFound: 'Engineering Building Lobby (Near East Entrance)',
    dateFound: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'Turned In to Office',
    custodyLocation: 'Campus Security & Lost/Found Office (Officer Andersen Avellana)',
    imageUrl: '/sample-items/lanyard.jpg',
    contactInfo: {
      founderName: 'Officer Andersen Avellana',
      contactChannel: 'andersen.avellana@cvsu.edu.ph | 09195050505'
    }
  },
  {
    title: 'Apple AirPods (2nd Gen) with Wireless Charging Case',
    category: 'Electronics',
    itemType: 'FOUND',
    description: 'Pair of authentic glossy white Apple AirPods earbuds resting next to their white charging case. In clean condition with no visible cracks.',
    locationFound: 'Student Center Cafeteria Table #8',
    dateFound: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'With Finder (Emmanuel Creo)',
    imageUrl: '/sample-items/airpods.jpg',
    deviceDetails: {
      brand: 'Apple',
      model: 'AirPods (2nd Gen)',
      color: 'Glossy White'
    },
    contactInfo: {
      founderName: 'Emmanuel Creo',
      contactChannel: 'emmanuel.creo@cvsu.edu.ph | 09171010101'
    }
  },
  {
    title: 'White Solar Electronic Desktop Calculator',
    category: 'Electronics',
    itemType: 'FOUND',
    description: 'Clean white angled electronic desk calculator featuring top solar strip, high-contrast LCD display, and full numeric keypad with memory keys.',
    locationFound: 'Computer Lab 3 (Room CL-302)',
    dateFound: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'Claimed',
    custodyLocation: 'Claimed by Owner',
    imageUrl: '/sample-items/calculator.jpg',
    deviceDetails: {
      brand: 'Electronic Solar',
      model: 'Desktop 12-Digit',
      color: 'White'
    },
    contactInfo: {
      founderName: 'Gabrielle Red Jeciel',
      contactChannel: 'gabrielle.jeciel@cvsu.edu.ph | 09196060606'
    },
    claimRecord: {
      claimantName: 'Von Arvin Apilado',
      studentId: '2024-10202',
      claimDate: new Date(),
      verificationNotes: 'Verified matching asset mark and test calculated basic ledger entries.'
    }
  },
  {
    title: 'Matte Olive Green Insulated Water Bottle (500ml)',
    category: 'Bottles & Tumblers',
    itemType: 'FOUND',
    description: 'Smooth matte olive/forest green stainless steel vacuum insulated water bottle with matching cylindrical screw cap and black rubber seal ring.',
    locationFound: 'Gymnasium Bleachers (Court A)',
    dateFound: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'Turned In to Office',
    custodyLocation: 'Campus Security Office (Officer Andersen Avellana)',
    imageUrl: '/sample-items/tumbler.jpg',
    contactInfo: {
      founderName: 'Officer Andersen Avellana',
      contactChannel: 'andersen.avellana@cvsu.edu.ph | 09195050505'
    }
  },
  {
    title: 'Car Key & Room Keys with White Tile Bluetooth Tracker',
    category: 'Keys & Wallets',
    itemType: 'FOUND',
    description: 'Steel split key ring containing a black vehicle key, silver serrated room key, textured red leather strap, and a white diamond-shaped Tile Mate bluetooth finder tag.',
    locationFound: 'Faculty Parking Lot (Near Gate 2)',
    dateFound: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'DCS Faculty Room (Prof. Adrian Sanchez)',
    imageUrl: '/sample-items/keys.jpg',
    deviceDetails: {
      brand: 'Tile / Yale',
      model: 'Tile Mate Keychain',
      color: 'White / Red / Silver'
    },
    contactInfo: {
      founderName: 'Prof. Adrian Sanchez',
      contactChannel: 'adrian.sanchez@cvsu.edu.ph | 09184040404'
    }
  },
  {
    title: 'Vintage Brown Distressed Leather Bi-Fold Wallet',
    category: 'Keys & Wallets',
    itemType: 'FOUND',
    description: 'Men genuine brown distressed leather bi-fold wallet. Shows natural vintage patina, heavy edge stitching, and card compartments.',
    locationFound: 'Admin Building 1st Floor Hallway',
    dateFound: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'Turned In to Office',
    custodyLocation: 'Campus Security & Lost/Found Desk (Officer Andersen Avellana)',
    imageUrl: '/sample-items/wallet.jpg',
    contactInfo: {
      founderName: 'Officer Andersen Avellana',
      contactChannel: 'andersen.avellana@cvsu.edu.ph | 09195050505'
    }
  },
  {
    title: 'Black Commuter Laptop Backpack with Yellow Patch',
    category: 'Bags & Apparel',
    itemType: 'FOUND',
    description: 'Structured black water-resistant canvas backpack with front horizontal zipper pocket, side sleeve, and a small yellow square rubber patch logo near the base.',
    locationFound: 'Computer Studies AVR 1 (Row 4)',
    dateFound: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'Computer Laboratory Prep Room (Gabrielle Red Jeciel)',
    imageUrl: '/sample-items/backpack.jpg',
    contactInfo: {
      founderName: 'Gabrielle Red Jeciel',
      contactChannel: 'gabrielle.jeciel@cvsu.edu.ph | 09196060606'
    }
  },
  {
    title: 'Light Grey Faux-Leather Mini Satchel with Gold Buckles',
    category: 'Bags & Apparel',
    itemType: 'FOUND',
    description: 'Pebbled light grey structured faux-leather mini satchel handbag featuring twin front vertical straps with polished gold buckles and top carry handle.',
    locationFound: 'Student Pavilion Bench (Near Gazebo)',
    dateFound: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'With Finder (Emmanuel Creo)',
    imageUrl: '/sample-items/satchel.jpg',
    contactInfo: {
      founderName: 'Emmanuel Creo',
      contactChannel: 'emmanuel.creo@cvsu.edu.ph | 09171010101'
    }
  },
  {
    title: 'Tortoiseshell Browline Prescription Eyeglasses',
    category: 'Others',
    itemType: 'FOUND',
    description: 'Classic Clubmaster browline eyeglasses with brown tortoiseshell upper frame, silver wire lens rims, clear prescription lenses, left on a study desk.',
    locationFound: 'Main Library 1st Floor Study Carrel #6',
    dateFound: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'Reported',
    custodyLocation: 'With Finder (Prof. Rai Acosta)',
    imageUrl: '/sample-items/eyeglasses.jpg',
    contactInfo: {
      founderName: 'Prof. Rai Acosta',
      contactChannel: 'rai.acosta@cvsu.edu.ph | 09183030303'
    }
  },
  {
    title: 'Hardcover University Study & Reference Textbook',
    category: 'Books & Stationery',
    itemType: 'FOUND',
    description: 'Thick hardcover academic reference volume with dark teal cloth spine binding and cream pages, left standing on library review desk.',
    locationFound: 'Main Library Reference Section (Shelf 12)',
    dateFound: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    status: 'Turned In to Office',
    custodyLocation: 'Campus Security & Lost/Found Office (Officer Andersen Avellana)',
    imageUrl: '/sample-items/textbook.jpg',
    contactInfo: {
      founderName: 'Officer Andersen Avellana',
      contactChannel: 'andersen.avellana@cvsu.edu.ph | 09195050505'
    }
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_lost_found';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    await User.deleteMany({});
    console.log('Cleared existing User records');

    for (const u of sampleUsers) {
      await User.create(u);
    }
    console.log(`Seeded ${sampleUsers.length} user accounts with requested names (Students: Emmanuel Creo, Von Arvin Apilado; Professors: Rai Acosta, Adrian Sanchez; Others: Andersen Avellana, Gabrielle Red Jeciel)`);

    await LostFoundItem.deleteMany({});
    console.log('Cleared existing LostFoundItem records');

    const created = await LostFoundItem.insertMany(sampleItems);
    console.log(`Successfully seeded ${created.length} lost and found items with verified realistic photos!`);

    await mongoose.disconnect();
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
