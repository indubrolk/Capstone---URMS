/**
 * seed.ts  (Supabase version)
 * ─────────────────────────────────────────────────────────────
 * Populates the Supabase database with sample data.
 * Run with: npm run seed
 *
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env
 * ─────────────────────────────────────────────────────────────
 */
import supabase from '../config/supabaseClient';

async function seed() {
    console.log('🌱 Starting Supabase seed...');

    try {
        // ── 1. Clear existing data (order respects FK constraints) ──
        console.log('Truncating existing data...');
        await supabase.from('maintenance_tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        console.log('✅ Existing data cleared.');

        // ── 2. Insert Resources ──────────────────────────────────────
        const { data: resources, error: resErr } = await supabase
            .from('resources')
            .insert([
                { name: 'Lecture Hall 01',  type: 'Lecture Halls', capacity: '150', location: 'Block B',       availability_status: 'Available', equipment: JSON.stringify(['Projector', 'Whiteboard', 'AC']) },
                { name: 'Physics Lab',      type: 'Labs',          capacity: '40',  location: 'Science Block', availability_status: 'Available', equipment: JSON.stringify(['Oscilloscopes', 'Multimeters']) },
                { name: 'Mini Auditorium',  type: 'Lecture Halls', capacity: '200', location: 'Main Building', availability_status: 'Available', equipment: JSON.stringify(['Sound System', 'Projector', 'Stage']) },
                { name: 'Meeting Room A',   type: 'Rooms',         capacity: '20',  location: 'Admin Block',   availability_status: 'Available', equipment: JSON.stringify(['Conference Phone', 'Display Screen']) },
                { name: 'Chemistry Lab',    type: 'Labs',          capacity: '50',  location: 'Science Block', availability_status: 'Available', equipment: JSON.stringify(['Fume Hoods', 'Microscopes']) },
                { name: 'Computer Lab 01',  type: 'Labs',          capacity: '60',  location: 'IT Center',     availability_status: 'Available', equipment: JSON.stringify(['60 PCs', 'Projector', 'High-Speed Internet']) },
                { name: 'Faculty Van',      type: 'Vehicles',      capacity: '14',  location: 'Transport Pool',availability_status: 'Available', equipment: JSON.stringify(['GPS', 'AC']) },
                { name: 'Projector X1',     type: 'Equipment',     capacity: '1',   location: 'IT Desk',       availability_status: 'Available', equipment: JSON.stringify([]) },
            ])
            .select();

        if (resErr) throw resErr;
        console.log(`✅ ${resources?.length} resources seeded.`);

        // ── 3. Insert Bookings using resource UUIDs ──────────────────
        const lh1        = resources?.find((r: any) => r.name === 'Lecture Hall 01')?.id;
        const physicsLab = resources?.find((r: any) => r.name === 'Physics Lab')?.id;
        const meetingRoom = resources?.find((r: any) => r.name === 'Meeting Room A')?.id;

        if (lh1 && physicsLab && meetingRoom) {
            const today    = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

            const { error: bookErr } = await supabase.from('bookings').insert([
                { resource_id: lh1,         start_time: yesterday.toISOString(),                                            end_time: new Date(yesterday.getTime() + 2 * 3600 * 1000).toISOString(), status: 'Completed' },
                { resource_id: physicsLab,  start_time: today.toISOString(),                                               end_time: new Date(today.getTime()    + 3 * 3600 * 1000).toISOString(), status: 'Approved' },
                { resource_id: lh1,         start_time: tomorrow.toISOString(),                                            end_time: new Date(tomorrow.getTime() + 1 * 3600 * 1000).toISOString(), status: 'Pending' },
            ]);
            if (bookErr) throw bookErr;
            console.log('✅ Bookings seeded.');

            // ── 4. Insert Maintenance Tickets ────────────────────────
            const { error: mErr } = await supabase.from('maintenance_tickets').insert([
                { resource_id: lh1,         title: 'AC Maintenance',        description: 'Blowing warm air',                    priority: 'Medium', status: 'IN_PROGRESS', created_by: 'staff-1',    assigned_to: 'tech-1' },
                { resource_id: physicsLab,  title: 'Projector Flickering',  description: 'Image drops out randomly',             priority: 'High',   status: 'OPEN',        created_by: 'lecturer-2', assigned_to: null },
                { resource_id: meetingRoom, title: 'Chair Repairs',         description: 'Multiple broken chairs in back row',   priority: 'Low',    status: 'OPEN',        created_by: 'student-3',  assigned_to: null },
            ]);
            if (mErr) throw mErr;
            console.log('✅ Maintenance tickets seeded.');
        }

        // ── 5. Insert sample notifications ──────────────────────────
        const { error: notifErr } = await supabase.from('notifications').insert([
            { user_id: 'dev-user', message: 'Your booking for Lecture Hall 01 was approved.',  type: 'info' },
            { user_id: 'dev-user', message: 'Maintenance ticket #2 has been assigned.',         type: 'info' },
        ]);
        if (notifErr) throw notifErr;
        console.log('✅ Notifications seeded.');

        console.log('\n🎉 Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();
