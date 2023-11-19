import { ThresholdMessageKit } from '@nucypher/taco';
import React, { useState  } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const apiKey = 'fe780ec7.6e84a2b70c234c218c5054f979c6029c';

interface Props {
  enabled: boolean;
  encryptedMessage?: ThresholdMessageKit;
  encrypt: (value: string) => void;
}

export const Encrypt = ({ encrypt, encryptedMessage, enabled }: Props) => {
  if (!enabled) {
    return <></>;
  }

  const [plaintext, setPlaintext] = useState('Content');
  const [filename, setFilename] = useState('Title');

  const onClickEncrypt = () => encrypt(plaintext);

  // const onClickUpload = async () => encrypt(plaintext);{
  //   if (!encryptedMessage) {
  //     return;
  //   }

  //   const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
  //     'base64',
  //   );

  //   const response = await lighthouse.uploadText(encodedCiphertext, apiKey, filename);
  //   console.log(response);
  // };

  const EncryptedMessageContent = () => {
    if (!encryptedMessage) {
      return <></>;
    }

    const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
      'base64',
    );
    const CID = 'QmRfZxLG3S885uwQxnXEGSMMvBLNA2cGqN1pT8qs42mLVR'
    return (
      <>
        <div>
          <h3>Encrypted invite/photos:</h3>
          <pre className="ciphertext">{encodedCiphertext}</pre>
          <CopyToClipboard text={encodedCiphertext}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>
          <h3>File CID:</h3>
          <pre className="CID">{CID}</pre>
          <CopyToClipboard text={CID}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Step 2 - Create a wedding invitation, add your file name, and encrypt the data</h2>
      <input
        type="string"
        value={plaintext}
        onChange={(e) => setPlaintext(e.currentTarget.value)}
      />
      <input
        type="string"
        value={filename}
        onChange={(e) => setFilename(e.currentTarget.value)}
      />
      <button onClick={onClickEncrypt}>Encrypt and Send</button>
      {/* <button onClick={onClickUpload}>Upload File</button> */}
      {EncryptedMessageContent()}
    </div>
  );
};