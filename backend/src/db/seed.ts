import db from "./db";

async function seed() {
  try {
    console.log("Seeding data...");

    // Insert Resources
    await db.query(`
      INSERT INTO resources (name, type, capacity, location, availability_status, equipment)
      VALUES 
        ('Lecture Hall 01', 'Lecture Halls', '150', 'Block B', 'Available', 'Projector, Whiteboard, AC'),
        ('Physics Lab', 'Laboratories', '40', 'Science Block', 'In Use', 'Oscilloscopes, Multimeters'),
        ('Mini Auditorium', 'Auditoriums', '200', 'Main Building', 'Available', 'Sound System, Projector, Stage'),
        ('Meeting Room A', 'Meeting Rooms', '20', 'Admin Block', 'Under Maintenance', 'Conference Phone, Display Screen'),
        ('Chemistry Lab', 'Laboratories', '50', 'Science Block', 'Available', 'Fume Hoods, Microscopes'),
        ('Computer Lab 01', 'Computer Labs', '60', 'IT Center', 'Available', '60 PCs, Projector, High-Speed Internet')
    `);

    console.log("Resources seeded.");

    const [resources]: any = await db.query('SELECT id, name FROM resources');
    
    if (resources && resources.length > 0) {
      const lh1 = resources.find((r: any) => r.name === 'Lecture Hall 01')?.id;
      const physicsLab = resources.find((r: any) => r.name === 'Physics Lab')?.id;

      if (lh1 && physicsLab) {
        // Insert some past and future bookings
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const fDate = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ');

        await db.query(`
          INSERT INTO bookings (resource_id, start_time, end_time, status)
          VALUES 
            (?, ?, ?, 'Completed'),
            (?, ?, ?, 'Approved'),
            (?, ?, ?, 'Pending')
        `, [
          lh1, fDate(yesterday), fDate(new Date(yesterday.getTime() + 2 * 60 * 60 * 1000)),
          physicsLab, fDate(today), fDate(new Date(today.getTime() + 3 * 60 * 60 * 1000)),
          lh1, fDate(tomorrow), fDate(new Date(tomorrow.getTime() + 1 * 60 * 60 * 1000))
        ]);
        console.log("Bookings seeded.");
      }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
