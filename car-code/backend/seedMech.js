const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  const User = require('./models/User');
  const Mechanic = require('./models/Mechanic');
  const AvailableSlot = require('./models/AvailableSlot');
  const connectDB = require('./config/db');

  const seedMech = async () => {
    try {
      await connectDB();
    //   await User.deleteMany({ role: 'mechanic' });
    //   await Mechanic.deleteMany({});
    //   await AvailableSlot.deleteMany({});

      const users = [
        {
          name: 'كريم محمد',
          email: 'kareem@gmail.com',
          password: await bcrypt.hash('123456', 10),
          phone: '0791234567',
          location: 'عمان',
          image: '/uploads/kareem.png',
          role: 'mechanic',
        },
      ];

      const createdUsers = await User.insertMany(users);
      console.log('Users created:', createdUsers.map((u) => u.email));

      const mechanics = [
        {
          user: createdUsers[0]._id,
          workshopName: 'ورشة كريم',
          workSchedule: [
            { day: 'sunday', hours: [{ start: '09:00', end: '17:00' }] },
            { day: 'monday', hours: [{ start: '09:00', end: '17:00' }] },
            { day: 'tuesday', hours: [{ start: '09:00', end: '17:00' }] },
            { day: 'wednesday', hours: [{ start: '09:00', end: '17:00' }] },
            { day: 'thursday', hours: [{ start: '09:00', end: '17:00' }] },
          ],
          ratings: [],
          bookings: [],
          available: true,
        },
      ];

      const createdMechanics = await Mechanic.insertMany(mechanics);
      console.log('Mechanics created:', createdMechanics.map((m) => m.workshopName));

      const slots = [
        {
          mechanic: createdMechanics[0]._id,
          date: new Date('2025-04-27T00:00:00.000Z'),
          time: '15:14',
          isBooked: false,
        },
        {
          mechanic: createdMechanics[0]._id,
          date: new Date('2025-04-28T00:00:00.000Z'),
          time: '10:00',
          isBooked: false,
        },
        {
          mechanic: createdMechanics[0]._id,
          date: new Date('2025-04-28T00:00:00.000Z'),
          time: '14:00',
          isBooked: false,
        },
      ];

      const createdSlots = await AvailableSlot.insertMany(slots);
      console.log('Available slots created:', createdSlots.length);

      console.log('Seeding completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Seeding error:', error.message);
      process.exit(1);
    }
  };

  seedMech();