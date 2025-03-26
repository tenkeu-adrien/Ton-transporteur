import React from 'react';

const PhoneLink = ({ phoneNumber }) => {
  return (
    <div>
      <p>Cliquez sur le numéro pour appeler :</p>
      <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
    </div>
  );
};

export default PhoneLink;
