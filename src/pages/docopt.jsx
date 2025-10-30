{/* Records + Prescriptions */}
<div className="space-y-12">

  {/* 🩺 Medical Records */}
  <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
    <h2 className="text-2xl font-semibold text-blue-700 flex items-center mb-6">
      <FaFileMedical className="mr-2 text-blue-500" /> Medical Records
    </h2>

    {/* Patient Search */}
    <div className="flex items-center mb-6 space-x-2">
      <select
        value={searchPatientId}
        onChange={(e) => {
          setSearchPatientId(e.target.value);
          fetchRecordsForPatient(e.target.value);
        }}
        className="border rounded-lg p-2 w-full max-w-sm focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <FaSearch className="text-gray-500" />
    </div>

    {/* Records Table */}
    {records.length === 0 ? (
      <p className="text-gray-500 italic flex items-center mb-4">
        <FaClipboardList className="mr-2" /> No records found.
      </p>
    ) : (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm border">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-2">Doctor</th>
              <th className="p-2">Diagnosis</th>
              <th className="p-2">Treatment</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {r.doctor ? r.doctor.name : "—"}
                  {r.doctor?.specialization && (
                    <span className="block text-xs text-gray-500 italic">
                      {r.doctor.specialization}
                    </span>
                  )}
                </td>
                <td className="p-2">{r.diagnosis}</td>
                <td className="p-2">{r.treatment}</td>
                <td className="p-2">{r.notes}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setEditingRecord(r);
                      setEditValues({
                        diagnosis: r.diagnosis,
                        treatment: r.treatment,
                        notes: r.notes,
                      });
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Edit Record Form */}
    {editingRecord && (
      <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">Update Record</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Diagnosis"
            value={editValues.diagnosis}
            onChange={(e) =>
              setEditValues({ ...editValues, diagnosis: e.target.value })
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Treatment"
            value={editValues.treatment}
            onChange={(e) =>
              setEditValues({ ...editValues, treatment: e.target.value })
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            placeholder="Notes"
            value={editValues.notes}
            onChange={(e) =>
              setEditValues({ ...editValues, notes: e.target.value })
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={updateRecord}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setEditingRecord(null)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Add New Record Form */}
    <form onSubmit={handleAddRecord} className="max-w-2xl mx-auto bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-inner">
      <h3 className="font-semibold text-blue-700 text-lg mb-3 text-center">
        Add New Record
      </h3>
      <div className="space-y-3">
        <select
          value={newRecord.patient_id}
          onChange={(e) =>
            setNewRecord({ ...newRecord, patient_id: e.target.value })
          }
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Diagnosis"
          value={newRecord.diagnosis}
          onChange={(e) =>
            setNewRecord({ ...newRecord, diagnosis: e.target.value })
          }
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
          required
        />

        <input
          type="text"
          placeholder="Treatment"
          value={newRecord.treatment}
          onChange={(e) =>
            setNewRecord({ ...newRecord, treatment: e.target.value })
          }
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
        />

        <textarea
          placeholder="Notes"
          value={newRecord.notes}
          onChange={(e) =>
            setNewRecord({ ...newRecord, notes: e.target.value })
          }
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 min-h-[120px]"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
        >
          Add Record
        </button>
      </div>
    </form>
  </section>

  {/* 💊 Prescriptions */}
  <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-2xl mx-auto">
    <h2 className="text-2xl font-semibold text-blue-700 flex items-center mb-6 justify-center">
      <FaPrescriptionBottleAlt className="mr-2 text-blue-500" /> Create Prescription
    </h2>

    <form onSubmit={handleAddPrescription} className="space-y-4">
      <select
        value={newPrescription.patient_id}
        onChange={(e) =>
          setNewPrescription({ ...newPrescription, patient_id: e.target.value })
        }
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
        required
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Medication Details (e.g., medicine, dosage, instructions)"
        value={newPrescription.medication_details}
        onChange={(e) =>
          setNewPrescription({
            ...newPrescription,
            medication_details: e.target.value,
          })
        }
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 min-h-[120px]"
        required
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Create Prescription
      </button>
    </form>
  </section>
</div>
