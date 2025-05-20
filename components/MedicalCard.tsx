"use client";

import { useState, useEffect } from "react";
import { MAX_SESSIONS, MAX_THERAPIES } from "@/lib/constants";
import { Save, Printer, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { calculateAge } from "@/lib/utils";
import FormField from "./FormField";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

export default function MedicalCard() {
  const [numTherapies, setNumTherapies] = useState(MAX_THERAPIES);
  const [numSessions, setNumSessions] = useState(MAX_SESSIONS);
  const [formData, setFormData] = useState({
    patientName: "",
    clinicalHistory: "",
    rehabRoom: "",
    state: "",
    birthDate: "",
    age: "",
    sex: "",
    idCard: "",
    healthConditions: "",
    therapies: Array(MAX_THERAPIES).fill(""),
    sessionDates: Array(MAX_SESSIONS).fill(""),
  });

  useEffect(() => {
    const savedData = localStorage.getItem("medicalCardData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setNumTherapies(parsedData.therapies.length);
        setNumSessions(parsedData.sessionDates.length);
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.birthDate) {
      const age = calculateAge(new Date(formData.birthDate));
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("therapy")) {
      const index = parseInt(name.replace("therapy", ""), 10);
      const newTherapies = [...formData.therapies];
      newTherapies[index] = value;
      setFormData({ ...formData, therapies: newTherapies });
    } else if (name.startsWith("session")) {
      const index = parseInt(name.replace("session", ""), 10);
      const newSessionDates = [...formData.sessionDates];
      newSessionDates[index] = value;
      setFormData({ ...formData, sessionDates: newSessionDates });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateSelect = (date: Date | undefined, field: string) => {
    if (date) {
      if (field === "birthDate") {
        setFormData(prev => ({
          ...prev,
          [field]: format(date, "yyyy-MM-dd"),
        }));
      } else {
        const sessionIndex = parseInt(field.replace("session", ""), 10);
        const newSessionDates = [...formData.sessionDates];
        newSessionDates[sessionIndex] = format(date, "yyyy-MM-dd");
        setFormData(prev => ({
          ...prev,
          sessionDates: newSessionDates,
        }));
      }
    }
  };

  const addTherapyRow = () => {
    const newCount = numTherapies + 1;
    setNumTherapies(newCount);
    setFormData(prev => ({
      ...prev,
      therapies: [...prev.therapies, ""]
    }));
  };

  const deleteTherapyRow = (index: number) => {
    if (numTherapies > 1) {
      const newTherapies = formData.therapies.filter((_, i) => i !== index);
      setNumTherapies(newTherapies.length);
      setFormData(prev => ({
        ...prev,
        therapies: newTherapies
      }));
    }
  };

  const addSessionColumn = () => {
    const newCount = numSessions + 1;
    setNumSessions(newCount);
    setFormData(prev => ({
      ...prev,
      sessionDates: [...prev.sessionDates, ""]
    }));
  };

  const deleteSessionColumn = (index: number) => {
    if (numSessions > 1) {
      const newSessionDates = formData.sessionDates.filter((_, i) => i !== index);
      setNumSessions(newSessionDates.length);
      setFormData(prev => ({
        ...prev,
        sessionDates: newSessionDates
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("medicalCardData", JSON.stringify(formData));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="medical-card">
      <div className="medical-card-header">
        <div>REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
        <div>MISIÓN MÉDICA CUBANA</div>
        <div>TARJETA DE TRATAMIENTO EN REHABILITACIÓN</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="medical-card-field">
          <label>Nombre y Apellidos:</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
          />
        </div>
        <div className="medical-card-field">
          <label>Número de Historia Clínica:</label>
          <input
            type="text"
            name="clinicalHistory"
            value={formData.clinicalHistory}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="medical-card-field">
          <label>Sala de Rehabilitación:</label>
          <input
            type="text"
            name="rehabRoom"
            value={formData.rehabRoom}
            onChange={handleInputChange}
          />
        </div>
        <div className="medical-card-field">
          <label>Estado:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="medical-card-field">
          <label>Fecha Nacimiento:</label>
          <FormField
            label=""
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            type="date"
            className="compact-field"
          />
        </div>
        <div className="medical-card-field">
          <label>Edad:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            readOnly
            className="compact-field"
          />
        </div>
        <div className="medical-card-field">
          <label>Sexo:</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
            className="compact-field"
          >
            <option value="">--</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </div>
        <div className="medical-card-field">
          <label>Cédula de Identidad:</label>
          <input
            type="text"
            name="idCard"
            value={formData.idCard}
            onChange={handleInputChange}
            className="no-print"
          />
          <div className="print-only full-width-print print-id">
            {formData.idCard}
          </div>
        </div>
      </div>

      <div className="medical-card-field">
        <label>Condiciones de Salud:</label>
        <input
          type="text"
          name="healthConditions"
          value={formData.healthConditions}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-between items-center mb-2 no-print">
        <span>Terapias</span>
        <Button onClick={addTherapyRow} size="sm" className="h-6">
          <Plus className="h-3 w-3 mr-1" /> Agregar fila
        </Button>
      </div>

      <table>
        <thead>
          <tr>
            <th className="w-1/6">Terapias</th>
            <th colSpan={numSessions}>
              <div className="flex justify-between items-center">
                <span>SESIONES DE TRATAMIENTO</span>
                <Button onClick={addSessionColumn} size="sm" className="h-6 no-print">
                  <Plus className="h-3 w-3 mr-1" /> Agregar sesión
                </Button>
              </div>
            </th>
          </tr>
          <tr>
            <th></th>
            {Array(numSessions).fill(0).map((_, i) => (
              <th key={i} className="date-cell p-0">
                <div className="flex items-center justify-center gap-1">
                  <div className="text-xs">{i + 1}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 no-print text-red-500 hover:text-red-700"
                    onClick={() => deleteSessionColumn(i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="date-button no-print">
                      {formData.sessionDates[i] ? 
                        format(new Date(formData.sessionDates[i]), "dd/MM") : "Fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CustomDatePicker
                      selected={formData.sessionDates[i] ? new Date(formData.sessionDates[i]) : undefined}
                      onSelect={(date) => handleDateSelect(date, `session${i}`)}
                      fromYear={2000}
                    />
                  </PopoverContent>
                </Popover>
                <div className="print-only date-input">
                  {formData.sessionDates[i] ? 
                    format(new Date(formData.sessionDates[i]), "dd/MM") : ""}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(numTherapies).fill(0).map((_, i) => (
            <tr key={i}>
              <td className="flex items-center gap-2">
                <input
                  type="text"
                  name={`therapy${i}`}
                  value={formData.therapies[i]}
                  onChange={handleInputChange}
                  className="w-full text-xs p-0 border-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 no-print text-red-500 hover:text-red-700"
                  onClick={() => deleteTherapyRow(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </td>
              {Array(numSessions).fill(0).map((_, j) => (
                <td key={j}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-2 mt-4 no-print">
        <Button onClick={handleSave} variant="outline" size="sm">
          <Save className="h-4 w-4 mr-1" />
          Guardar
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-1" />
          Imprimir
        </Button>
      </div>
    </div>
  );
}