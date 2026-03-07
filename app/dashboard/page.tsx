import React from "react";
import styles from "./dashboard.module.css";
import {
    Landmark, LayoutDashboard, Layers, Calendar,
    ShieldCheck, Wrench, Settings, LogOut,
    Search, Bell, MessageSquare, Download, Plus,
    ChevronDown, CheckCircle2, AlertCircle, Users,
    RefreshCw, Building2, FlaskConical, MoreHorizontal
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>
                        <Landmark size={20} />
                    </div>
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>UniLink</span>
                        <span className={styles.logoSubtitle}>Resource Admin</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <a href="#" className={`${styles.navItem} ${styles.active}`}>
                        <LayoutDashboard /> Dashboard
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Layers /> Resources
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Calendar /> Bookings
                    </a>
                    <a href="#" className={styles.navItem}>
                        <ShieldCheck /> Approvals
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Wrench /> Maintenance
                    </a>

                    <div className={styles.navSection}>
                        <a href="#" className={styles.navItem}>
                            <Settings /> Settings
                        </a>
                        <a href="/" className={styles.navItem}>
                            <LogOut /> Logout
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={styles.main}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <div className={styles.search}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search resources, bookings, or IDs..."
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.topbarRight}>
                        <button className={styles.iconButton}>
                            <Bell size={20} />
                            <span className={styles.notificationDot}></span>
                        </button>
                        <button className={styles.iconButton}>
                            <MessageSquare size={20} />
                        </button>
                        <div className={styles.profile}>
                            <div className={styles.avatar}>
                                SJ
                            </div>
                            <div className={styles.profileInfo}>
                                <span className={styles.profileName}>Dr. Sarah Jenkins</span>
                                <span className={styles.profileRole}>Admin Level 4</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.pageTitle}>Overview</h1>
                            <p className={styles.pageSubtitle}>Welcome back, Sarah. Here's a snapshot of the campus resources today.</p>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.btnOutline}>
                                <Download size={16} /> Export Report
                            </button>
                            <button className={styles.btnPrimary}>
                                <Plus size={16} /> New Resource
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <Layers className={styles.cardBgIcon} />
                            <div className={styles.statHeader}>
                                <div className={`${styles.statIconBox} ${styles.blue}`}>
                                    <Layers />
                                </div>
                                <div className={`${styles.badge} ${styles.positive}`}>+5.2%</div>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Total Resources</div>
                                <div className={styles.statValue}>1,248</div>
                                <div className={styles.statFooter}>ASSET POOL SYNC: ACTIVE</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <Calendar className={styles.cardBgIcon} />
                            <div className={styles.statHeader}>
                                <div className={`${styles.statIconBox} ${styles.blue}`}>
                                    <Calendar />
                                </div>
                                <div className={`${styles.badge} ${styles.positive}`}>+12.4%</div>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Active Bookings</div>
                                <div className={styles.statValue}>452</div>
                                <div className={styles.statFooter}>CONCURRENCY LOAD: 78%</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <ShieldCheck className={styles.cardBgIcon} />
                            <div className={styles.statHeader}>
                                <div className={styles.statIconBox}>
                                    <ShieldCheck />
                                </div>
                                <div className={`${styles.badge} ${styles.negative}`}>-3.1%</div>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Pending Approvals</div>
                                <div className={styles.statValue}>28</div>
                                <div className={styles.statFooter}>AVG. RESPONSE: 2.4H</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <Wrench className={styles.cardBgIcon} />
                            <div className={styles.statHeader}>
                                <div className={styles.statIconBox}>
                                    <Wrench />
                                </div>
                                <div className={`${styles.badge} ${styles.positive}`}>+2.0%</div>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Maintenance Alerts</div>
                                <div className={styles.statValue}>12</div>
                                <div className={styles.statFooter}>PRIORITY: HIGH</div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart and Activity */}
                    <div className={styles.middleGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2 className={styles.cardTitle}>Resource Availability</h2>
                                    <p className={styles.cardSubtitle}>Real-time status across major campus zones</p>
                                </div>
                                <div className={styles.dropdown}>
                                    This Week <ChevronDown size={14} />
                                </div>
                            </div>

                            <div className={styles.chartContainer}>
                                {[
                                    { label: 'HALLS', value: 85 },
                                    { label: 'LABS', value: 45 },
                                    { label: 'STUDIOS', value: 62 },
                                    { label: 'SPORTS', value: 90 },
                                    { label: 'EQUIP.', value: 30 },
                                    { label: 'OFFICES', value: 75 },
                                ].map((item) => (
                                    <div key={item.label} className={styles.chartColumn}>
                                        <div className={styles.barPercent}>{item.value}%</div>
                                        <div className={styles.bar} style={{ height: `100px` }}>
                                            <div className={styles.barFill} style={{ bottom: `${item.value}%`, position: 'absolute' }}></div>
                                        </div>
                                        <div className={styles.barLabel}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Recent Activity</h2>
                            </div>

                            <div className={styles.activityList}>
                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.iconSuccess}`}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>Auditorium B Booked</div>
                                        <div className={styles.activityDesc}>Approved by automatic policy</div>
                                        <div className={styles.activityTime}>12 mins ago</div>
                                    </div>
                                </div>

                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.iconWarning}`}>
                                        <AlertCircle size={16} />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>Lab 402 Maintenance</div>
                                        <div className={styles.activityDesc}>New service request submitted</div>
                                        <div className={styles.activityTime}>45 mins ago</div>
                                    </div>
                                </div>

                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.iconInfo}`}>
                                        <Users size={16} />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>Student Group Access</div>
                                        <div className={styles.activityDesc}>Granted to 'Debate Society'</div>
                                        <div className={styles.activityTime}>1 hour ago</div>
                                    </div>
                                </div>

                                <div className={styles.activityItem}>
                                    <div className={`${styles.activityIcon} ${styles.iconNeutral}`}>
                                        <RefreshCw size={14} />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <div className={styles.activityTitle}>System Sync Complete</div>
                                        <div className={styles.activityDesc}>Database reconciled with Registrar</div>
                                        <div className={styles.activityTime}>3 hours ago</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <button className={styles.btnFull}>
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Table Section */}
                    <div className={styles.card} style={{ marginBottom: '32px' }}>
                        <div className={styles.tableHeaderArea}>
                            <h2 className={styles.tableTitle}>Active High-Priority Bookings</h2>
                            <a href="#" className={styles.viewAll}>View All Bookings</a>
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>RESOURCE</th>
                                        <th>BOOKED BY</th>
                                        <th>STATUS</th>
                                        <th>TIME WINDOW</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className={styles.resourceCell}>
                                                <div className={styles.resourceIcon}>
                                                    <Building2 size={18} />
                                                </div>
                                                <span className={styles.resourceName}>Main Conference Hall</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <span className={styles.userName}>Prof. Alan Turing</span>
                                                <span className={styles.userDept}>Computer Science Dept.</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles.statusInfo}`}>IN PROGRESS</span>
                                        </td>
                                        <td className={styles.timeCell}>09:00 AM - 12:00 PM</td>
                                        <td>
                                            <button className={styles.actionBtn}><MoreHorizontal size={18} /></button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className={styles.resourceCell}>
                                                <div className={styles.resourceIcon}>
                                                    <FlaskConical size={18} />
                                                </div>
                                                <span className={styles.resourceName}>Chemistry Lab 202</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <span className={styles.userName}>Dr. Marie Curie</span>
                                                <span className={styles.userDept}>Science Faculty</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles.statusUpcoming}`}>UPCOMING</span>
                                        </td>
                                        <td className={styles.timeCell}>01:00 PM - 03:30 PM</td>
                                        <td>
                                            <button className={styles.actionBtn}><MoreHorizontal size={18} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
