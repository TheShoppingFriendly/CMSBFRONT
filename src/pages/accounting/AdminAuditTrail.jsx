import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminAuditTrail = () => {
    const [audit, setAudit] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        api.get('/admin/accounting/report').then(res => {
            // We only show entries where an Admin was involved
            setAudit(res.data.logs.filter(l => l.admin_id));
        });
    }, []);

    return (
        <div className="audit-wrapper">
            <style>{`
                .audit-wrapper { padding: 20px; font-family: 'Inter', sans-serif; }
                .log-card { background: white; padding: 15px 25px; border-radius: 10px; border: 1px solid #eee; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                .log-card:hover { background: #fcfcfc; border-color: #3498db; }
                
                .admin-pill { background: #34495e; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                .amount-tag { font-family: monospace; font-size: 16px; font-weight: bold; }
                
                /* Modal Drawer */
                .drawer-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 1000; }
                .drawer { position: fixed; right: 0; top: 0; width: 450px; height: 100%; background: white; padding: 30px; box-shadow: -10px 0 30px rgba(0,0,0,0.1); overflow-y: auto; }
                
                .id-box { background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-top: 10px; }
                .id-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-family: monospace; font-size: 12px; }
                .id-label { color: #888; font-weight: bold; }
                .id-value { color: #2c3e50; background: #eef2f7; padding: 2px 6px; border-radius: 4px; }
                
                .section-title { font-size: 12px; color: #3498db; font-weight: bold; text-transform: uppercase; margin-top: 25px; display: block; }
                .info-text { font-size: 15px; margin-top: 5px; color: #333; }
                .close-drawer { background: none; border: 1px solid #ddd; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
            `}</style>

            <h2>🛡️ Admin Activity History</h2>
            <p style={{color: '#777', marginBottom: '20px'}}>Click any record to view technical IDs and linking info.</p>

            {audit.map(log => (
                <div className="log-card" key={log.id} onClick={() => setSelectedLog(log)}>
                    <div>
                        <span className="admin-pill">{log.admin_name || 'Admin'}</span>
                        <div style={{marginTop: '8px', fontWeight: '500'}}>{log.note}</div>
                        <div style={{fontSize: '12px', color: '#999'}}>{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                    <div className="amount-tag" style={{color: log.debit > 0 ? '#e74c3c' : '#27ae60'}}>
                        {log.debit > 0 ? `-${log.debit}` : `+${log.credit}`}
                    </div>
                </div>
            ))}

            {selectedLog && (
                <div className="drawer-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="drawer" onClick={e => e.stopPropagation()}>
                        <button className="close-drawer" onClick={() => setSelectedLog(null)}>✕ Close Details</button>
                        
                        <h3 style={{margin: '0 0 10px 0'}}>Transaction Evidence</h3>
                        <p style={{fontSize: '14px', color: '#666'}}>Full details and database linking for this action.</p>

                        <span className="section-title">Human Description</span>
                        <div className="info-text">{selectedLog.note}</div>

                        <span className="section-title">Technical Database Links</span>
                        <div className="id-box">
                            <div className="id-row">
                                <span className="id-label">Admin User ID:</span>
                                <span className="id-value">{selectedLog.admin_id}</span>
                            </div>
                            <div className="id-row">
                                <span className="id-label">Linked User ID:</span>
                                <span className="id-value">{selectedLog.wp_user_id || 'None'}</span>
                            </div>
                            <div className="id-row">
                                <span className="id-label">Campaign/Store ID:</span>
                                <span className="id-value">{selectedLog.store_id || 'N/A'}</span>
                            </div>
                            <div className="id-row">
                                <span className="id-label">Ref/Conversion ID:</span>
                                <span className="id-value">{selectedLog.ref_id || 'N/A'}</span>
                            </div>
                        </div>

                        <span className="section-title">Financial Impact</span>
                        <div style={{marginTop: '10px', display: 'flex', gap: '15px'}}>
                            <div style={{flex: 1, padding: '15px', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px'}}>
                                <div style={{fontSize: '11px', color: '#999'}}>TOTAL CHANGE</div>
                                <div style={{fontSize: '20px', fontWeight: 'bold'}}>{selectedLog.credit || selectedLog.debit}</div>
                            </div>
                            <div style={{flex: 1, padding: '15px', background: '#f0f7ff', border: '1px solid #d0e7ff', borderRadius: '8px'}}>
                                <div style={{fontSize: '11px', color: '#0056b3'}}>PROFIT AFTER</div>
                                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#0056b3'}}>{selectedLog.system_profit_snapshot}</div>
                            </div>
                        </div>

                        <span className="section-title">Full Timestamp</span>
                        <div className="info-text" style={{fontSize: '13px'}}>{new Date(selectedLog.created_at).toString()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAuditTrail;