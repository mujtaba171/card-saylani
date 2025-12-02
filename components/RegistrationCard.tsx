import React from 'react';
import { CheckCircle, Download } from 'lucide-react';

interface RegistrationCardProps {
  content: string;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({ content }) => {
  // Helper to extract value based on key
  const getValue = (key: string) => {
    const regex = new RegExp(`${key}:\\s*(.*)`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const regId = getValue('Registration ID');
  const name = getValue('Name');
  const fatherName = getValue('Father Name');
  const cnic = getValue('CNIC');
  const phone = getValue('Phone');
  const course = getValue('Course');
  const batch = getValue('Batch');
  const date = getValue('Date');

  if (!regId) return null;

  return (
    <div className="mt-4 mb-6 bg-white border-2 border-green-600 rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto transform transition-all hover:scale-102">
      <div className="bg-green-600 text-white p-4 text-center">
        <div className="flex justify-center mb-2">
           <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Saylani-logo.png" alt="Saylani Logo" className="h-12 w-auto bg-white rounded p-1" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=SMIT')} />
        </div>
        <h3 className="font-bold text-lg">Saylani Mass IT Training</h3>
        <p className="text-sm opacity-90">Quetta Campus</p>
        <p className="text-xs mt-1 font-semibold tracking-wider uppercase">Student Registration Card</p>
      </div>
      
      <div className="p-6 space-y-3 text-sm text-gray-700">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-500">ID:</span>
          <span className="font-mono font-bold text-green-700">{regId}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Name:</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Father Name:</span>
          <span className="font-medium">{fatherName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">CNIC:</span>
          <span className="font-medium">{cnic}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Phone:</span>
          <span className="font-medium">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Course:</span>
          <span className="font-medium text-blue-600">{course}</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="font-semibold text-gray-500">Batch:</span>
          <span className="font-medium">{batch}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Date:</span>
          <span className="font-medium">{date}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex justify-center items-center gap-2 text-green-700 text-sm font-medium border-t">
        <CheckCircle size={16} />
        <span>Registration Confirmed</span>
      </div>
    </div>
  );
};
