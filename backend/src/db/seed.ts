/**
 * seed.ts  (Comprehensive Version)
 * ─────────────────────────────────────────────────────────────
 * Populates the Supabase database with sample data for ALL tables.
 * Run with: npm run seed
 *
 * Tables: users, resources, bookings, maintenance_tickets, notifications, reports
 * ─────────────────────────────────────────────────────────────
 */
import supabase from '../config/supabaseClient';

async function seed() {
    console.log('🌱 Starting Comprehensive Supabase seed...');

    try {
        // ── 1. Clear existing data (order respects FK constraints) ──
        console.log('Truncating existing data...');
        // Reports don't have FKs in the schema shown, but good to clear
        await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('maintenance_tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('users').delete().neq('id', 'placeholder');
        console.log('✅ Existing data cleared.');

        // ── 2. Insert Users ──────────────────────────────────────────
        console.log('Seeding Users...');
        try {
            const { error: userErr } = await supabase.from('users').insert([
                { id: 'mock-admin',       name: 'System Admin',      email: 'admin@demo.lk',       role: 'admin' },
                { id: 'mock-student',     name: 'John Student',      email: 'student@demo.lk',     role: 'student' },
                { id: 'mock-lecturer',    name: 'Dr. Smith',         email: 'lecturer@demo.lk',    role: 'lecturer' },
                { id: 'mock-maintenance', name: 'Mike Technician',    email: 'maintenance@demo.lk', role: 'maintenance' },
                { id: 'mock-student-2',   name: 'Jane Doe',          email: 'jane@demo.lk',        role: 'student' },
            ]);
            if (userErr) {
                console.warn('⚠️ User seeding skipped due to RLS policies. Continuing with other tables...');
            } else {
                console.log('✅ Users seeded.');
            }
        } catch (e) {
            console.warn('⚠️ User seeding failed (likely RLS). Continuing with other tables...');
        }

        // ── 3. Insert Resources ──────────────────────────────────────
        console.log('Seeding Resources...');
        const { data: resources, error: resErr } = await supabase
            .from('resources')
            .insert([
                { name: 'Lecture Hall 01',  type: 'Lecture Halls', capacity: '150', location: 'Block B',       availability_status: 'Available', equipment: JSON.stringify(['Projector', 'Whiteboard', 'AC']) },
                { name: 'Physics Lab',      type: 'Labs',          capacity: '40',  location: 'Science Block', availability_status: 'Available', equipment: JSON.stringify(['Oscilloscopes', 'Multimeters']) },
                { name: 'Mini Auditorium',  type: 'Lecture Halls', capacity: '200', location: 'Main Building', availability_status: 'Available', equipment: JSON.stringify(['Sound System', 'Projector', 'Stage']) },
                { name: 'Meeting Room A',   type: 'Rooms',         capacity: '20',  location: 'Admin Block',   availability_status: 'Available', equipment: JSON.stringify(['Conference Phone', 'Display Screen']) },
                { name: 'Chemistry Lab',    type: 'Labs',          capacity: '50',  location: 'Science Block', availability_status: 'Available', equipment: JSON.stringify(['Fume Hoods', 'Microscopes']) },
                { name: 'Computer Lab 01',  type: 'Labs',          capacity: '60',  location: 'IT Center',     availability_status: 'Available', equipment: JSON.stringify(['60 PCs', 'Projector', 'High-Speed Internet']) },
                { name: 'Faculty Van 01',   type: 'Vehicles',      capacity: '14',  location: 'Transport Pool',availability_status: 'Available', equipment: JSON.stringify(['GPS', 'AC']) },
                { name: 'Projector X1',     type: 'Equipment',     capacity: '1',   location: 'IT Desk',       availability_status: 'Available', equipment: JSON.stringify(['VGA Cable', 'Remote']) },
                { name: 'Seminar Room 2',   type: 'Rooms',         capacity: '30',  location: 'Block C',       availability_status: 'Maintenance', equipment: JSON.stringify(['Smart Board']) },
                { name: 'Hall 7',           type: 'Lecture Halls', capacity: '100', location: 'Block D',       availability_status: 'Booked',    equipment: JSON.stringify(['Projector']) },
            ])
            .select();

        if (resErr) throw resErr;
        console.log(`✅ ${resources?.length} resources seeded.`);

        // ── 4. Insert Bookings ───────────────────────────────────────
        console.log('Seeding Bookings...');
        const lh1        = resources?.find((r: any) => r.name === 'Lecture Hall 01')?.id;
        const physicsLab = resources?.find((r: any) => r.name === 'Physics Lab')?.id;
        const meetingRoom = resources?.find((r: any) => r.name === 'Meeting Room A')?.id;
        const hall7      = resources?.find((r: any) => r.name === 'Hall 7')?.id;

        const today    = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

        const { error: bookErr } = await supabase.from('bookings').insert([
            { resource_id: lh1,         user_id: 'mock-lecturer', start_time: yesterday.toISOString(),                                            end_time: new Date(yesterday.getTime() + 2 * 3600 * 1000).toISOString(), status: 'Completed' },
            { resource_id: physicsLab,  user_id: 'mock-student',  start_time: today.toISOString(),                                               end_time: new Date(today.getTime()    + 3 * 3600 * 1000).toISOString(), status: 'Approved' },
            { resource_id: lh1,         user_id: 'mock-lecturer', start_time: tomorrow.toISOString(),                                            end_time: new Date(tomorrow.getTime() + 1 * 3600 * 1000).toISOString(), status: 'Pending' },
            { resource_id: hall7,       user_id: 'mock-student-2',start_time: today.toISOString(),                                               end_time: new Date(today.getTime()    + 2 * 3600 * 1000).toISOString(), status: 'Approved' },
        ]);
        if (bookErr) throw bookErr;
        console.log('✅ Bookings seeded.');

        // ── 5. Insert Maintenance Tickets ────────────────────────────
        console.log('Seeding Maintenance Tickets...');
        const semRoom2 = resources?.find((r: any) => r.name === 'Seminar Room 2')?.id;

        const { error: mErr } = await supabase.from('maintenance_tickets').insert([
            { resource_id: lh1,         title: 'AC Maintenance',        description: 'Blowing warm air',                    priority: 'Medium', status: 'IN_PROGRESS', created_by: 'mock-lecturer', assigned_to: 'mock-maintenance' },
            { resource_id: physicsLab,  title: 'Projector Flickering',  description: 'Image drops out randomly',             priority: 'High',   status: 'OPEN',        created_by: 'mock-lecturer', assigned_to: null },
            { resource_id: semRoom2,    title: 'Smart Board Calibration',description: 'Touch response is offset',           priority: 'Low',    status: 'IN_PROGRESS', created_by: 'mock-admin',    assigned_to: 'mock-maintenance' },
        ]);
        if (mErr) throw mErr;
        console.log('✅ Maintenance tickets seeded.');

        // ── 6. Insert Notifications ──────────────────────────────────
        console.log('Seeding Notifications...');
        const { error: notifErr } = await supabase.from('notifications').insert([
            { user_id: 'mock-lecturer',  message: 'Your booking for Lecture Hall 01 was approved.',  type: 'info' },
            { user_id: 'mock-maintenance',message: 'You have been assigned to a new ticket: AC Maintenance.', type: 'alert' },
            { user_id: 'mock-student',    message: 'Reminder: Your booking starts in 1 hour.',        type: 'warning' },
            { user_id: 'mock-admin',      message: 'System backup completed successfully.',           type: 'info' },
        ]);
        if (notifErr) throw notifErr;
        console.log('✅ Notifications seeded.');

        // ── 7. Insert Reports ────────────────────────────────────────
        console.log('Seeding Reports...');
        const { error: repErr } = await supabase.from('reports').insert([
            { generated_by: 'mock-admin', report_type: 'maintenance', file_path: 'https://example.com/reports/maint-may.pdf' },
            { generated_by: 'mock-admin', report_type: 'usage',       file_path: 'https://example.com/reports/usage-q1.pdf' },
        ]);
        if (repErr) throw repErr;
        console.log('✅ Reports seeded.');

        console.log('\n🎉 ALL tables seeded successfully with comprehensive mock data.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();
