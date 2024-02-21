import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import EditPopUpForStockIn from '/Users/samli/test/frontend/src/components/popUps/EditPopUpForStockIn.js'; // Adjust the import path as necessary

const StockInRecordPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    const handleSubmit = async () => {
        try {
            const response = await axios.get('http://localhost:8080/stock-in-statistics', {
                params: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                }
            });
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const handleDelete = async (recordId) => {
        try {
            await axios.delete(`http://localhost:8080/stock-in-record/${recordId}`);
            setRecords(records.filter(record => record.recordId !== recordId));
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setShowEditPopup(true);
    };

    const handleSaveEdit = async (editedRecord) => {
        try {
            await axios.put(`http://localhost:8080/stock-in-record/${editedRecord.recordId}`, editedRecord);
            setRecords(records.map(record => record.recordId === editedRecord.recordId ? editedRecord : record));
            setShowEditPopup(false);
            setCurrentRecord(null);
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const datePickerStyle = {
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '40px'
    };

    const firstDatePickerStyle = {
        ...datePickerStyle,
        marginRight: '20px'
    };

    const buttonStyle = {
        ...datePickerStyle,
        cursor: 'pointer',
        backgroundColor: '#d4ebf2',
        color: 'black',
        fontWeight: 'bold'
    };

    const labelStyle = {
        color: '#00008B',
        marginRight: '5px',
        fontWeight: 'bold'
    };

    const tableStyle = {
        width: 'calc(100% - 80px)',
        margin: '20px 40px',
        borderCollapse: 'collapse',
        backgroundColor: '#d4ebf2',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    };

    const cellStyle = {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        color: 'black'
    };

    const headerStyle = {
        ...cellStyle,
        backgroundColor: '#00008B',
        color: 'white',
        textAlign: 'left'
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', color: '#00008B' }}>入库记录表</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label style={labelStyle}>开始日期</label>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} style={firstDatePickerStyle} />
                <div style={{ width: '20px' }}></div>
                <label style={labelStyle}>结束日期</label>
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} style={datePickerStyle} />
                <button onClick={handleSubmit} style={buttonStyle}>确认</button>
            </div>
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={headerStyle}>日期</th>
                    <th style={headerStyle}>货品ID</th>
                    <th style={headerStyle}>名称</th>
                    <th style={headerStyle}>数量</th>
                    <th style={headerStyle}>单价</th>
                    <th style={headerStyle}>总价</th>
                    <th style={headerStyle}>操作</th>
                </tr>
                </thead>
                <tbody>
                {records.map(record => (
                    <tr key={record.recordId}>
                        <td style={cellStyle}>{record.date}</td>
                        <td style={cellStyle}>{record.itemId}</td>
                        <td style={cellStyle}>{record.itemName}</td>
                        <td style={cellStyle}>{record.stockInAmount}</td>
                        <td style={cellStyle}>${record.unitPrice.toFixed(2)}</td>
                        <td style={cellStyle}>${record.totalPrice.toFixed(2)}</td>
                        <td style={cellStyle}>
                            <button onClick={() => handleEdit(record)} style={buttonStyle}>Edit</button>
                            <button onClick={() => handleDelete(record.recordId)} style={buttonStyle}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showEditPopup && (
                <EditPopUpForStockIn
                    record={currentRecord}
                    show={showEditPopup}
                    onSave={handleSaveEdit}
                    onClose={() => setShowEditPopup(false)}
                />
            )}
        </div>
    );
};

export default StockInRecordPage;
