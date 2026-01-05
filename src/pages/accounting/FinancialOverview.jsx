import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const FinancialOverview = () => {
    const [summary, setSummary] = useState({ total_revenue: 0, total_liabilities: 0, net_profit: 0 });

    useEffect(() => {
        api.get('/admin/accounting/report').then(res => setSummary(res.data.summary));
    }, []);

    return (
        <div style={{padding: '30px', background: '#fff'}}>
            <h2 style={{marginBottom: '30px'}}>Money Summary</h2>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '10px'}}>
                    <div style={{fontSize: '12px', color: '#999'}}>TOTAL MONEY EARNED</div>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#27ae60'}}>{summary?.total_revenue || 0}</div>
                </div>
                <div style={{flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '10px'}}>
                    <div style={{fontSize: '12px', color: '#999'}}>TOTAL MONEY PAID OUT</div>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#e74c3c'}}>{summary?.total_liabilities || 0}</div>
                </div>
                <div style={{flex: 1, padding: '20px', background: '#f0f7ff', borderRadius: '10px'}}>
                    <div style={{fontSize: '12px', color: '#0056b3'}}>SYSTEM PROFIT</div>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#0056b3'}}>{summary?.net_profit || 0}</div>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;