const Pizza = require('../models/Pizza');
const User = require('../models/User');

const pizzas = [
  {
    name: 'Margherita Classic',
    description: 'The timeless Italian classic — rich tomato sauce, fresh mozzarella, and fragrant basil leaves on a perfectly baked thin crust.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    category: 'Classic',
    rating: 4.7,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Pepperoni Supreme',
    description: 'Loaded with premium pepperoni slices on a tangy tomato base with melted mozzarella. A crowd favourite that never disappoints.',
    price: 949,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    category: 'Classic',
    rating: 4.8,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Four Cheese Fiesta',
    description: 'An indulgent blend of mozzarella, cheddar, parmesan, and gorgonzola — a cheese lover\'s dream with a golden, bubbling top.',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    category: 'Cheese Lovers',
    rating: 4.9,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Triple Cheese Melt',
    description: 'Three layers of cheese — ricotta base, mozzarella middle, and parmesan crust finish — for an unbeatable creamy texture.',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    category: 'Cheese Lovers',
    rating: 4.6,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Garden Veggie Delight',
    description: 'A colourful medley of bell peppers, mushrooms, black olives, red onions, and cherry tomatoes on herbed tomato sauce.',
    price: 849,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80',
    category: 'Vegetarian',
    rating: 4.5,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Paneer Tikka Pizza',
    description: 'Marinated paneer cubes, capsicum, and onions in a spiced tikka sauce — the perfect East-meets-West fusion pizza.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',
    category: 'Vegetarian',
    rating: 4.7,
    isVegetarian: true,
    isSpicy: true,
  },
  {
    name: 'Spicy Inferno',
    description: 'Jalapeños, ghost pepper sauce, red chillies, and spicy sausage for the true heat seekers. Not for the faint-hearted!',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600&q=80',
    category: 'Spicy',
    rating: 4.4,
    isVegetarian: false,
    isSpicy: true,
  },
  {
    name: 'Diavola Fire',
    description: 'Spicy salami, Calabrian chilli, red onions, and a fiery arrabbiata base — a bold, Italian-inspired spicy pizza.',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80',
    category: 'Spicy',
    rating: 4.5,
    isVegetarian: false,
    isSpicy: true,
  },
  {
    name: 'Chicken Jalapeño Kick',
    description: 'Grilled chicken, pickled jalapeños, roasted corn, and ranch drizzle — a tangy, spicy combo bursting with flavour.',
    price: 1149,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&q=80',
    category: 'Spicy',
    rating: 4.6,
    isVegetarian: false,
    isSpicy: true,
  },
  {
    name: 'Truffle Mushroom Royale',
    description: 'Wild porcini mushrooms, truffle oil, caramelised onions, and parmesan on a white cream base — pure gourmet luxury.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    category: 'Premium',
    rating: 4.9,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Smoked Salmon Luxury',
    description: 'Cream cheese base, smoked Norwegian salmon, capers, red onion, and fresh dill — a premium seafood pizza experience.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80',
    category: 'Premium',
    rating: 4.8,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'BBQ Chicken Ranch',
    description: 'Smoky BBQ sauce, grilled chicken strips, red onions, cheddar, and a ranch drizzle — your go-to comfort pizza.',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=600&q=80',
    category: 'Classic',
    rating: 4.7,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Mediterranean Dream',
    description: 'Sun-dried tomatoes, kalamata olives, artichoke hearts, feta cheese, and oregano on olive oil base.',
    price: 1149,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    category: 'Vegetarian',
    rating: 4.6,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Loaded Meat Feast',
    description: 'A carnivore\'s paradise — pepperoni, sausage, bacon, grilled chicken, and beef mince loaded on a rich tomato base.',
    price: 1349,
    image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=80',
    category: 'Premium',
    rating: 4.8,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Buffalo Chicken Blaze',
    description: 'Crispy buffalo chicken, blue cheese crumble, celery, and a drizzle of hot sauce — bold, tangy, and addictive.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&q=80',
    category: 'Spicy',
    rating: 4.5,
    isVegetarian: false,
    isSpicy: true,
  },
];

const seedData = async () => {
  // 1. Seed Pizzas
  let addedPizzas = 0;
  for (const pizzaData of pizzas) {
    const exists = await Pizza.findOne({ name: pizzaData.name });
    if (!exists) {
      await Pizza.create(pizzaData);
      console.log(`  ➕ Added Pizza: ${pizzaData.name}`);
      addedPizzas++;
    }
  }

  // 2. Seed Default Admin Account
  const adminEmail = 'admin@pizzahub.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: 'PizzaHub Admin',
      email: adminEmail,
      password: 'Admin@12345',
      phone: '+92 300 1234567',
      role: 'admin',
    });
    console.log(`  👑 Created Admin: ${adminEmail} / Admin@12345`);
  }

  // 3. Seed Demo Customer Account
  const customerEmail = 'customer@pizzahub.com';
  const customerExists = await User.findOne({ email: customerEmail });
  if (!customerExists) {
    await User.create({
      name: 'Demo Customer',
      email: customerEmail,
      password: 'Customer@12345',
      phone: '+92 321 9876543',
      role: 'customer',
    });
    console.log(`  👤 Created Customer: ${customerEmail} / Customer@12345`);
  }

  console.log(`🎉 Seed complete! ${addedPizzas} pizzas added.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' Demo Credentials:');
  console.log('   Admin:    admin@pizzahub.com    / Admin@12345');
  console.log('   Customer: customer@pizzahub.com / Customer@12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

// If run directly: node scripts/seed.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedData();
    process.exit(0);
  }).catch(err => {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  });
}

// If imported: require('./scripts/seed')
module.exports = seedData;
