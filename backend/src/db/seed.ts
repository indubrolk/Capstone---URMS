import db from "./db";

async function seed() {
  try {
    console.log("Seeding data...");

    // Disable foreign key checks to truncate tables
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE bookings');
    await db.query('TRUNCATE TABLE maintenance_tickets');
    await db.query('TRUNCATE TABLE resources');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert Resources
    await db.query(`
      INSERT INTO resources (name, type, capacity, location, availability_status, equipment)
      VALUES 
        ('Lecture Hall 01', 'Lecture Halls', '150', 'Block B', 'Available', '["Projector", "Whiteboard", "AC"]'),
        ('Physics Lab', 'Labs', '40', 'Science Block', 'Available', '["Oscilloscopes", "Multimeters"]'),
        ('Mini Auditorium', 'Lecture Halls', '200', 'Main Building', 'Available', '["Sound System", "Projector", "Stage"]'),
        ('Meeting Room A', 'Rooms', '20', 'Admin Block', 'Available', '["Conference Phone", "Display Screen"]'),
        ('Chemistry Lab', 'Labs', '50', 'Science Block', 'Available', '["Fume Hoods", "Microscopes"]'),
        ('Computer Lab 01', 'Labs', '60', 'IT Center', 'Available', '["60 PCs", "Projector", "High-Speed Internet"]'),
        ('Faculty Van', 'Vehicles', '14', 'Transport Pool', 'Available', '["GPS", "AC"]'),
        ('Projector X1', 'Equipment', '1', 'IT Desk', 'Available', '[]')
    `);

    console.log("Resources seeded.");

    const [resources]: any = await db.query('SELECT id, name FROM resources');
    
    if (resources && resources.length > 0) {
      const lh1 = resources.find((r: any) => r.name === 'Lecture Hall 01')?.id;
      const physicsLab = resources.find((r: any) => r.name === 'Physics Lab')?.id;
      const meetingRoom = resources.find((r: any) => r.name === 'Meeting Room A')?.id;

      if (lh1 && physicsLab && meetingRoom) {
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

        // Insert Maintenance Tickets
        await db.query(`
          INSERT INTO maintenance_tickets (resourceId, title, description, priority, status, createdBy, assignedTo)
          VALUES 
            (?, 'AC Maintenance', 'Blowing warm air', 'Medium', 'IN_PROGRESS', 'staff-1', 'tech-1'),
            (?, 'Projector Flickering', 'Image drops out randomly', 'High', 'OPEN', 'lecturer-2', NULL),
            (?, 'Chair Repairs', 'Multiple broken chairs in back row', 'Low', 'OPEN', 'student-3', NULL)
        `, [lh1, physicsLab, meetingRoom]);
        console.log("Maintenance tickets seeded.");
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
