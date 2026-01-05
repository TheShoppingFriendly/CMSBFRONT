import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const GlobalLedger = ({ setActiveTab, setSelectedUserId }) => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("all");

    useEffect(() => {
        api.get('/admin/accounting/report').then(res => setLogs(res.data.logs));
    }, []);

    const filtered = logs.filter(l => {
        const matchesSearch = l.note?.toLowerCase().includes(search.toLowerCase()) || 
                             l.user_name?.toLowerCase().includes(search.toLowerCase());
        const matchesView = view === "all" ? true : 
                           view === "in" ? l.credit > 0 : l.debit > 0;
        return matchesSearch && matchesView;
    });

    return (
        <div className="simple-acc-wrapper">
            <style>{`
                .simple-acc-wrapper { display: flex; padding: 20px; gap: 20px; background: #f9f9f9; min-height: 100vh; font-family: sans-serif; }
                .sidebar { width: 260px; background: white; padding: 20px; border-radius: 12px; height: fit-content; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .content { flex: 1; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                
                .side-box { margin-bottom: 20px; }
                .side-box label { display: block; font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; text-transform: uppercase; }
                .input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
                
                .main-table { width: 100%; border-collapse: collapse; }
                .main-table th { text-align: left; padding: 12px; font-size: 12px; color: #999; border-bottom: 1px solid #eee; }
                .main-table td { padding: 15px; border-bottom: 1px solid #f9f9f9; font-size: 14px; }
                
                .green { color: #27ae60; font-weight: bold; }
                .red { color: #e74c3c; font-weight: bold; }
                .user-link { color: #3498db; cursor: pointer; border: none; background: none; font-weight: bold; padding: 0; text-decoration: underline; }
            `}</style>

            {/* SIDEBAR FILTERS */}
            <aside className="sidebar">
                <div className="side-box">
                    <label>Search Records</label>
                    <input type="text" className="input" placeholder="Name or Note..." onChange={(e)=>setSearch(e.target.value)} />
                </div>
                <div className="side-box">
                    <label>View Mode</label>
                    <select className="input" onChange={(e)=>setView(e.target.value)}>
                        <option value="all">Show All</option>
                        <option value="in">Money Coming In</option>
                        <option value="out">Money Going Out</option>
                    </select>
                </div>
                <hr style={{border: '0', borderTop: '1px solid #eee', margin: '20px 0'}} />
                <button onClick={() => window.print()} className="input" style={{cursor:'pointer', background:'#eee'}}>Print Page</button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="content">
                <h2 style={{marginTop: 0}}>Activity Log</h2>
                <table className="main-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Person/Store</th>
                            <th>Amount</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(l => (
                            <tr key={l.id}>
                                <td>{new Date(l.created_at).toLocaleDateString()}</td>
                                <td>
                                    {l.wp_user_id ? (
                                        <button className="user-link" onClick={() => { setSelectedUserId(l.wp_user_id); setActiveTab('user-details'); }}>
                                            {l.user_name || `User ${l.wp_user_id}`}
                                        </button>
                                    ) : (l.store_name || 'System')}
                                </td>
                                <td className={l.credit > 0 ? 'green' : 'red'}>
                                    {l.credit > 0 ? `+ ${l.credit}` : `- ${l.debit}`}
                                </td>
                                <td style={{color: '#666', fontSize: '13px'}}>{l.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default GlobalLedger;