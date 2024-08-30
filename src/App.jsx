import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./index.css";

function App() {
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem("tableRows");
    return savedRows
      ? JSON.parse(savedRows)
      : [
          { name: "John Doe", age: 28 },
          { name: "Jane Doe", age: 25 },
        ];
  });

  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tableRows", JSON.stringify(rows));
  }, [rows]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Генерация файла и создание ссылки для скачивания
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    // Создание ссылки для скачивания и клик по ней
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.xlsx";
    a.click();

    // Освобождение ресурсов
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRow = () => {
    setRows([...rows, { name: formData.name, age: formData.age }]);
    setFormData({ name: "", age: "" });
    setFormVisible(false);
  };

  const handleEditRow = (index) => {
    setFormData(rows[index]);
    setEditIndex(index);
    setFormVisible(true);
  };

  const handleSaveEdit = () => {
    const updatedRows = rows.map((row, index) => (index === editIndex ? formData : row));
    setRows(updatedRows);
    setFormData({ name: "", age: "" });
    setEditIndex(null);
    setFormVisible(false);
  };

  return (
    <div className="app-container">
      <button className="toggle-form-button" onClick={() => setFormVisible(!isFormVisible)}>
        {isFormVisible ? "Close Form" : "Add New Row"}
      </button>

      {isFormVisible && (
        <div className="form-container">
          <h3>{editIndex !== null ? "Edit Data" : "Add New Data"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
            className="input-field"
          />
          {editIndex !== null ? (
            <button className="add-row-button" onClick={handleSaveEdit}>
              Save Changes
            </button>
          ) : (
            <button className="add-row-button" onClick={handleAddRow}>
              Add to Table
            </button>
          )}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} onClick={() => handleEditRow(index)}>
              <td>{row.name}</td>
              <td>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="export-button" onClick={handleExport}>
        Export to Excel
      </button>
    </div>
  );
}

export default App;
