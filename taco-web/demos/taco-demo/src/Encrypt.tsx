import { ThresholdMessageKit } from '@nucypher/taco';
import React, { useState  } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import lighthouse from '@lighthouse-web3/sdk';

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

  const [plaintext, setPlaintext] = useState('plaintext');
  const [filename, setFilename] = useState('filename');

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
          <h3>Encrypted ciphertext:</h3>
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
      <h2>Step 2 - Set conditions, add IPFS name, and Encrypt a message</h2>
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
      <button onClick={onClickEncrypt}>Encrypt</button>
      {/* <button onClick={onClickUpload}>Upload File</button> */}
      {EncryptedMessageContent()}
    </div>
  );
};

// export const Encrypt = ({ encrypt, encryptedMessage, enabled }: Props) => {
//   if (!enabled) {
//     return <></>;
//   }

//   const [plaintext, setPlaintext] = useState('plaintext');
  
//   const [filename, setFilename] = useState('filename');

//   const onClick = () => encrypt(plaintext);

//   const EncryptedMessageContent = () => {
//     if (!encryptedMessage) {
//       return <></>;
//     }

//     const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
//       'base64',
//     );

//     const response = await lighthouse.uploadText(encodedCiphertext, apiKey, filename)
//     console.log(response)
    
//     return (
//       <>
//         <div>
//           <h3>Encrypted ciphertext:</h3>
//           <pre className="ciphertext">{encodedCiphertext}</pre>
//           <CopyToClipboard text={encodedCiphertext}>
//             <button>Copy to clipboard</button>
//           </CopyToClipboard>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div>
//       <h2>Step 2 - Set conditions, add IPFS name, and Encrypt a message</h2>
//       <input
//         type="string"
//         value={plaintext}
//         onChange={(e) => setPlaintext(e.currentTarget.value)}
//       />
//       <input
//         type="string"
//         value={filename}
//         onChange={(e) => setFilename(e.currentTarget.value)}
//       />
//       <button onClick={onClick}>Encrypt</button>
//       {EncryptedMessageContent()}
//       <button onClick={onClick}>Upload</button>
//       {EncryptedMessageContent()}
//     </div>
//   );
// };

// export const Encrypt = ({ encrypt, encryptedMessage, enabled }: Props) => {
//   const [plaintext, setPlaintext] = useState('plaintext');
//   const [filename, setFilename] = useState('filename');
//   const [encryptedContent, setEncryptedContent] = useState<React.ReactNode | null>(null);

//   const onClick = async () => {
//     await encrypt(plaintext);
//     await uploadEncryptedText();
//   };

//   const uploadEncryptedText = async () => {
//     if (!encryptedMessage) {
//       return;
//     }

//     const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
//       'base64',
//     );

//     const response = await lighthouse.uploadText(encodedCiphertext, apiKey, filename);
//     console.log(response);

//     const content = (
//       <div>
//         <h3>Encrypted ciphertext:</h3>
//         <pre className="ciphertext">{encodedCiphertext}</pre>
//         <CopyToClipboard text={encodedCiphertext}>
//           <button>Copy to clipboard</button>
//         </CopyToClipboard>
//       </div>
//     );

//     setEncryptedContent(content);
//   };

//   useEffect(() => {
//     if (encryptedMessage) {
//       uploadEncryptedText();
//     }
//   }, [encryptedMessage]);

//   return (
//     <div>
//       <h2>Step 2 - Set conditions, add IPFS name, and Encrypt a message</h2>
//       <input
//         type="string"
//         value={plaintext}
//         onChange={(e) => setPlaintext(e.currentTarget.value)}
//       />
//       <input
//         type="string"
//         value={filename}
//         onChange={(e) => setFilename(e.currentTarget.value)}
//       />
//       <button onClick={onClick}>Encrypt</button>
//       {encryptedContent}
//     </div>
//   );
// };


// export const Encrypt = ({ encrypt, encryptedMessage, enabled }: Props) => {
//   if (!enabled) {
//     return <></>;
//   }

//   const [plaintext, setPlaintext] = useState('plaintext');
//   const [filename, setFilename] = useState('filename');

//   const onClick = () => {
//     await encrypt(plaintext);
//     await uploadEncryptedText(plaintext, filename);
//   };

//   const uploadEncryptedText = async (plaintext: String, filename: string) => {
//     console.log("inside", filename)
//     if (!plaintext) {
//       return;
//     }
//     console.log("not anymore")
//     const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
//       'base64',
//     );
//     console.log(encodedCiphertext, filename)
//     const response = await uploadTextToLighthouse(encodedCiphertext, filename);
//     console.log(response);
//   };

//   const uploadEncryptedText = async () => {
//     console.log("inside")
//     if (!encryptedMessage) {
//       return;
//     }
//     console.log("not anymore")
//     const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
//       'base64',
//     );
//     console.log(encodedCiphertext, filename)
//     const response = await uploadTextToLighthouse(encodedCiphertext, filename);
//     console.log(response);
//   };

//   const uploadTextToLighthouse = async (text: string, filename: string) => {
//     console.log(text, filename)
//     return lighthouse.uploadText(text, apiKey, filename);
//   };

//   const EncryptedMessageContent = () => {
//     if (!encryptedMessage) {
//       return <></>;
//     }

//     const encodedCiphertext = Buffer.from(encryptedMessage.toBytes()).toString(
//       'base64',
//     );
//     const cid = "QmPQKunkFa5QNmtmaThuMuU1kG3466EZuv1ZZ1RFSqv6Da"
//     return (
//       <>
//         <div>
//           <h3>Encrypted ciphertext:</h3>
//           <pre className="ciphertext">{encodedCiphertext}</pre>
//           <h3>CID of the file:</h3>
//           <pre className="CID">{cid}</pre>
//           <CopyToClipboard text={cid}>
//             <button>Copy to clipboard</button>
//           </CopyToClipboard>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div>
//       <h2>Step 2 - Set conditions, add IPFS name, and Encrypt a message</h2>
//       <input
//         type="string"
//         value={plaintext}
//         onChange={(e) => setPlaintext(e.currentTarget.value)}
//       />
//       <input
//         type="string"
//         value={filename}
//         onChange={(e) => setFilename(e.currentTarget.value)}
//       />
//       <button onClick={onClick}>Encrypt</button>
//       {EncryptedMessageContent()}
//     </div>
//   );
// };
