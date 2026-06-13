import React from 'react';

const Badge = ({ status }) => {
  const labels = {
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    deficiente: 'Deficiente',
    en_revision: 'En Revisión'
  };

  const statusClass = status ? status.toLowerCase() : 'pendiente';
  const label = labels[statusClass] || status;

  return (
    <span className={`badge badge-${statusClass}`}>
      {label}
    </span>
  );
};

export default Badge;
