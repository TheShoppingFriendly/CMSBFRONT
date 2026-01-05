import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminAuditTrail = () => {
    const [audit, setAudit] = useState([]);

    useEffect(() => {
        api.get('/admin/accounting/report').then(res => {
            setAudit(res.data.logs.filter(l => l.admin_id));
        });
    }, []);

    return (
        <div className="au-container">
            <style>{`
                .au-container { padding: 30px; }
                .au-item { background: white; border-radius: 8px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
                .au-admin-info { display: flex; align-items: center; gap: 15px; }
                .au-avatar { width: 40px; height: 40px; background: #374151; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
                .au-details h4 { margin: 0; font-size: 15px; color: #111827; }
                .au-details p { margin: 4px 0 0 0; font-size: 13px; color: #6b7280; }
                .au-money { text-align: right; }
                .au-money span { display: block; font-weight: 800; font-size: 16px; }
                .au-date { font-size: 11px; color: #9ca3af; text-transform: uppercase; }
            `}</style>

            <h1 style={{ marginBottom: '25px' }}>Security & Admin Audit</h1>

            {audit.map(log => (
                <div className="au-item" key={log.id}>
                    <div className="au-admin-info">
                        <div className="au-avatar">{log.admin_name?.charAt(0)}</div>
                        <div className="au-details">
                            <h4>{log.admin_name}</h4>
                            <p>{log.note}</p>
                        </div>
                    </div>
                    <div className="au-money">
                        <span className={log.debit > 0 ? 'amt-neg' : 'amt-pos'}>
                            {log.debit > 0 ? `-${log.debit}` : `+${log.credit}`}
                        </span>
                        <div className="au-date">{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminAuditTrail;