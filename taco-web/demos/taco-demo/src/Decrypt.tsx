import { ThresholdMessageKit } from '@nucypher/taco';
import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  enabled: boolean;
  decrypt: (encryptedMessage: ThresholdMessageKit) => void;
  decryptedMessage?: string | undefined;
  decryptionErrors: string[];
}

const downloadFile = (cid: string): Promise<string> => {
  const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;

  return axios.get(url)
    .then(response => {
      if (response.status === 200) {
        return response.data; // Use response.data to get the content as a string
      } else {
        throw new Error(`Failed to download the file. Status: ${response.status}`);
      }
    })
    .catch(error => {
      throw new Error(`Failed to download the file: ${error.message}`);
    });
};

export const Decrypt = ({
  decrypt,
  decryptedMessage,
  decryptionErrors,
  enabled,
}: Props) => {
  const [encryptedMessage, setEncryptedMessage] = useState('');

  if (!enabled) {
    return <></>;
  }

  const onDecrypt = () => {
    if (!encryptedMessage) {
      return;
    }
    const cid = encryptedMessage  
    let encryptedData: string;
    downloadFile(cid)
    .then(content => {
      console.log('File content:', content);
      encryptedData = content;
      console.log(encryptedData)
      const mkBytes = Buffer.from(encryptedData, 'base64');
      console.log(mkBytes)
      const mk = ThresholdMessageKit.fromBytes(mkBytes);
      decrypt(mk);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });


    // console.log(encryptedData)
    // const mkBytes = Buffer.from(encryptedData, 'base64').toString('utf-8');
    // const mk = ThresholdMessageKit.fromBytes(mkBytes);
    // decrypt(mk);
  };

  const DecryptedMessage = () => {
    if (!decryptedMessage) {
      return <></>;
    }
    return (
      <>
        <h3>Decrypted Message:</h3>
        <p>{decryptedMessage}</p>
      </>
    );
  };

  const DecryptionErrors = () => {
    if (decryptionErrors.length === 0) {
      return null;
    }

    return (
      <div>
        <h2>Decryption Errors</h2>
        <p>Not enough decryption shares to decrypt the message.</p>
        <p>Some Ursulas have failed with errors:</p>
        <ul>
          {decryptionErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Step 3 - Fetch Encrypted Message</h2>
      <input
        value={encryptedMessage}
        placeholder="Enter CID of the file"
        onChange={(e) => setEncryptedMessage(e.currentTarget.value)}
      />
      <button onClick={onDecrypt}>Decrypt</button>
      {DecryptedMessage()}
      {DecryptionErrors()}
    </div>
  );
};
