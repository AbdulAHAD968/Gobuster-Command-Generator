import { FaCopy } from 'react-icons/fa';
import { useIp } from '../contexts/IpContext';
import { useState, useEffect } from 'react';
import '../styles/ip-input.css';

const IPInputComponent = () => {
  const { ip, setIp } = useIp();
  const [copied, setCopied] = useState(false);
  const [ipVersion, setIpVersion] = useState('v4'); // 'v4' or 'v6'

  const handleIpChange = (e) => {
    setIp(e.target.value);
  };

  const copyToClipboard = () => {
    if (ip) {
      navigator.clipboard.writeText(ip);
      setCopied(true);
    }
  };

  const handleVersionChange = (version) => {
    setIpVersion(version);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="ip-input-component">
      <div className="ip-input-group">
        <span className="ip-input-label">Target IP</span>
        <input
          type="text"
          className="ip-input-field"
          id="IP"
          placeholder={`Enter ${ipVersion === 'v4' ? 'IPv4' : 'IPv6'} address or hostname`}
          value={ip}
          onChange={handleIpChange}
          aria-label="IP address input"
        />
        <div className="ip-version-toggle">
          <button
            type="button"
            className={`ip-version-btn ${ipVersion === 'v4' ? 'ip-version-active' : 'ip-version-inactive'}`}
            onClick={() => handleVersionChange('v4')}
          >
            IPv4
          </button>
          <button
            type="button"
            className={`ip-version-btn ${ipVersion === 'v6' ? 'ip-version-active' : 'ip-version-inactive'}`}
            onClick={() => handleVersionChange('v6')}
          >
            IPv6
          </button>
        </div>
        <div className="ip-copy-tooltip">
          <button 
            className="ip-copy-btn" 
            onClick={copyToClipboard}
            disabled={!ip}
            aria-label="Copy IP address"
          >
            <FaCopy className="ip-copy-icon" /> 
            <span className="ip-copy-text">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <span className="ip-tooltip-text">Copy to clipboard</span>
        </div>
      </div>
    </div>
  );
};

export default IPInputComponent;
