// Import React and useState from 'react', and axios for making HTTP requests
import React, { useState } from 'react';
import axios from 'axios';
// Import Modal component from './popUps/Modal'
import Modal from './popUps/Modal';

// Define a functional component called StockOutForm, which takes props item and currentStock
const StockOutForm = ({ item, currentStock }) => {
    // Define state variables using useState hook
    const [stockOutAmount, setStockOutAmount] = useState("");
    const [currencyUnit, setCurrencyUnit] = useState("CAD");
    const [note, setNote] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Styles for labels, inputs, selects, and buttons
    const labelStyle = {
        backgroundColor: '#00008B',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        marginBottom: '5px',
        width: '100px',
        display: 'inline-block',
        marginRight: '10px',
        textAlign: 'left',
        height: '25px',
    };

    const inputStyle = {
        width: '200px',
        height: '10px',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '3px solid #00008B',
        backgroundColor: '#fff',
        color: '#000',
    };

    const selectStyle = {
        width: '226px',
        height: '37px',
        padding: '8px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '3px solid #00008B',
        backgroundColor: '#fff',
        color: '#000',
    };

    const buttonStyle = {
        margin: '10px 0',
        padding: '10px',
        width: '100px',
        backgroundColor: '#00008B',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '0.2s',
    };

    const rowContainerStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        margin: '10px 0',
    };

    // Function to save the record
    const saveRecord = async () => {
        // Check if stockOutAmount is an integer
        if (!Number.isInteger(Number(stockOutAmount))) {
            setResponseMessage("出库数量必须是整数");
            setShowModal(true);
            return;
        }

        // Check if sellPrice is a number
        if (isNaN(Number(sellPrice))) {
            setResponseMessage("售价必须是数字");
            setShowModal(true);
            return;
        }

        // Check if stockOutAmount exceeds current stock
        if (Number(stockOutAmount) > currentStock) {
            setResponseMessage("Error: Stock out amount exceeds current stock");
            setShowModal(true);
            return;
        }

        // Create a record object with input values and item details
        const record = {
            itemId: item.itemId,
            itemName: item.itemName,
            brand: item.brand,
            itemSize: item.itemSize,
            unit: item.unit,
            stockOutAmount: Number(stockOutAmount),
            currencyUnit,
            note,
            sellPrice: sellPrice === "" ? 0 : Number(sellPrice)
        };

        try {
            // Send a POST request to the backend to save the record
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/stock-out-record`, record);
            // Set response message based on backend response
            setResponseMessage(res.data.startsWith("Stock-out record saved!") ? "记录保存成功!" : "库存不足，无法出库!");
            // Display modal
            setShowModal(true);
        } catch (error) {
            // Log error message if saving record fails
            console.error("Error saving record:", error);
            // Set response message to display error message
            setResponseMessage("运算出错，请联系工作人员");
            // Display modal
            setShowModal(true);
        }
    };

    // Return JSX for the StockOutForm component
    return (
        <div style={{ backgroundColor: '#d4ebf2', padding: '10px' }}>
            {/* Row 1: Input field for stockOutAmount */}
            <div style={rowContainerStyle}>
                <label style={labelStyle}>出库数量</label>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="出库数量"
                    value={stockOutAmount}
                    onChange={e => setStockOutAmount(e.target.value)}
                />
            </div>
            {/* Row 2: Input field for sellPrice */}
            <div style={rowContainerStyle}>
                <label style={labelStyle}>价格/{item.unit}</label>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder={`价格/${item.unit}`}
                    value={sellPrice}
                    onChange={e => setSellPrice(e.target.value)}
                />
            </div>
            {/* Row 3: Select field for currencyUnit */}
            <div style={rowContainerStyle}>
                <label style={labelStyle}>货币单位</label>
                <select
                    style={selectStyle}
                    value={currencyUnit}
                    onChange={e => setCurrencyUnit(e.target.value)}
                >
                    <option value="CAD">CAD</option>
                    <option value="CNY">CNY</option>
                </select>
            </div>
            {/* Row 4: Input field for note */}
            <div style={rowContainerStyle}>
                <label style={labelStyle}>备注</label>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="备注"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </div>
            {/* Submit Button */}
            <button style={buttonStyle} onClick={saveRecord}>确认</button>
            {/* Modal */}
            {showModal && <Modal onClose={() => setShowModal(false)} message={responseMessage} />}
        </div>
    );
};

// Export the StockOutForm component as default
export default StockOutForm;
