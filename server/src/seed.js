require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Instructor = require('./models/Instructor');
const Session = require('./models/Session');
const Booking = require('./models/Booking');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Start fresh so the script can be run again safely
  await Booking.deleteMany({});
  await Session.deleteMany({});
  await Service.deleteMany({});
  await Instructor.deleteMany({});


  const [asha, daniel] = await Instructor.insertMany([
    { name: 'Asha Rivera', bio: 'Yoga teacher focused on gentle, beginner-friendly flows.', specialties: ['yoga', 'beginners'] },
    { name: 'Daniel Brooks', bio: 'Meditation guide focused on calm and focus.', specialties: ['meditation', 'stress relief'] },
  ]);

  const [groupYoga, groupMed, privYoga, privMed, intro] = await Service.insertMany([
    { name: 'Group Yoga Class', category: 'yoga', type: 'group', durationMinutes: 60, description: 'A relaxed group flow over Zoom, suitable for all levels.' },
    { name: 'Group Guided Meditation', category: 'meditation', type: 'group', durationMinutes: 30, description: 'A guided group meditation to slow down and refocus.' },
    { name: 'Private Yoga Session', category: 'yoga', type: 'one-on-one', durationMinutes: 60, description: 'A one-on-one session tailored to your pace and goals.' },
    { name: 'Private Meditation Coaching', category: 'meditation', type: 'one-on-one', durationMinutes: 30, description: 'One-on-one coaching to build a meditation habit.' },
    { name: 'Intro Consultation', category: 'meditation', type: 'one-on-one', durationMinutes: 20, description: 'A short chat to talk through your goals and find the right fit.' },
  ]);

  const sessions = [];
  const add = (day, hour, minute, service, instructor, capacity) => {
    const startsAt = new Date(day);
    startsAt.setHours(hour, minute, 0, 0);
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60000);
    sessions.push({
      serviceId: service._id,
      instructorId: instructor._id,
      startsAt,
      endsAt,
      capacity,
      meetingLink: 'https://zoom.us/j/0000000000', // placeholder link for the demo
    });
  };

  for (let i = 1; i <= 14; i++) {
    const day = new Date();
    day.setDate(day.getDate() + i);
    const dow = day.getDay(); // 0 = Sunday

    if ([1, 3, 5].includes(dow)) add(day, 18, 0, groupYoga, asha, 12);
    if ([2, 4, 6].includes(dow)) add(day, 8, 0, groupMed, daniel, 15);
    if (dow >= 1 && dow <= 5) {
      add(day, 10, 0, privYoga, asha, 1);
      add(day, 14, 0, privYoga, asha, 1);
      add(day, 11, 0, privMed, daniel, 1);
      add(day, 15, 0, intro, daniel, 1);
    }
  }

  await Session.insertMany(sessions);
  console.log(`Seeded 5 services, 2 instructors, and ${sessions.length} sessions.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});