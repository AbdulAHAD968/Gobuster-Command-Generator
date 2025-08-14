import { useState } from 'react';
import { FaCopy, FaInfoCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { useIp } from '../contexts/IpContext';
import '../styles/SimpleMode.css';

// Tooltip component (unchanged from your original)
const Tooltip = ({ text, position }) => {
  if (!position) return null;

  return createPortal(
    <div
      className="tooltip-portal"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
        maxWidth: '250px',
        wordWrap: 'break-word',
        zIndex: 9999,
        backgroundColor: '#333',
        color: '#fff',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '14px',
        pointerEvents: 'none',
        position: 'absolute'
      }}
    >
      {text}
    </div>,
    document.body
  );
};

// CommandCard component (unchanged from your original)
const CommandCard = ({ command, onCopy, onTooltipShow, onTooltipHide }) => {
  return (
    <div className="command-card">
      <div className="command-header">
        <h4>{command.label}</h4>
        <FaInfoCircle
          className="info-icon"
          onMouseEnter={(e) => onTooltipShow(e, command.explanation)}
          onMouseLeave={onTooltipHide}
          style={{ cursor: 'pointer', marginLeft: '8px' }}
        />
      </div>
      <div className="command-body">
        <div className="command-text-container">
          <code className="command-text">{command.getCommand()}</code>
        </div>
        <button
          className="copy-button"
          onClick={() => onCopy(command.getCommand())}
          aria-label="Copy command"
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
};

const SimpleMode = () => {
  const { ip } = useIp();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [notification, setNotification] = useState("");
  const [tooltip, setTooltip] = useState({ text: "", position: null });

  // Common wordlists that users might have
  const commonWordlists = {
    directory: '/usr/share/wordlists/dirb/common.txt',
    big: '/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt',
    small: '/usr/share/wordlists/dirb/small.txt'
  };

  const commands = [
    {
      id: 'dir-basic',
      label: 'Basic Directory Scan',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory}`,
      explanation: 'Basic directory brute-forcing using common wordlist'
    },
    {
      id: 'dir-extensions',
      label: 'Directory Scan with Extensions',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -x php,html,txt`,
      explanation: 'Scan for directories and files with common web extensions'
    },
    {
      id: 'dir-big',
      label: 'Comprehensive Directory Scan',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.big}`,
      explanation: 'More thorough scan using a larger wordlist (slower but more comprehensive)'
    },
    {
      id: 'dir-quick',
      label: 'Quick Directory Scan',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.small} -q`,
      explanation: 'Fast scan with small wordlist and quiet output'
    },
    {
      id: 'dir-no-status',
      label: 'Directory Scan (Hide 404s)',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -n`,
      explanation: 'Hides status codes from output for cleaner results'
    },
    {
      id: 'vhost-basic',
      label: 'VHost Enumeration',
      getCommand: () => `gobuster vhost -u http://${ip} -w ${commonWordlists.directory}`,
      explanation: 'Virtual host brute-forcing (useful for web servers hosting multiple sites)'
    },
    {
      id: 'dir-full-urls',
      label: 'Directory Scan (Show Full URLs)',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -e`,
      explanation: 'Shows full URLs instead of just paths'
    },
    {
      id: 'dir-with-status',
      label: 'Directory Scan (Filter Status)',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -s 200,301,302`,
      explanation: 'Only shows responses with these status codes'
    },
    {
      id: 'dir-with-threads',
      label: 'Directory Scan (Multi-threaded)',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -t 50`,
      explanation: 'Uses 50 threads for faster scanning (adjust based on server capability)'
    },
    {
      id: 'dir-with-output',
      label: 'Directory Scan (Save Results)',
      getCommand: () => `gobuster dir -u http://${ip} -w ${commonWordlists.directory} -o results.txt`,
      explanation: 'Saves output to a file for later analysis'
    }
  ];

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setNotification("Command copied to clipboard!");
    setTimeout(() => {
      setCopiedIndex(null);
      setNotification("");
    }, 2000);
  };

  const showTooltip = (event, text) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      text,
      position: {
        top: rect.top - 10 + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      }
    });
  };

  const hideTooltip = () => {
    setTooltip({ text: "", position: null });
  };

  return (
    <div className="simple-mode-container">
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="simple-mode-content">
        <h2 className="mode-title">
          Simple <span style={{ color: 'orange', fontWeight: 'bold' }}>Gobuster</span> Commands
        </h2>
        <p className="mode-description">
          Pre-configured Gobuster commands for directory and vhost brute-forcing. 
          Click any command to copy it to your clipboard.
        </p>

        <div className="commands-grid">
          {commands.map((cmd, index) => (
            <CommandCard
              key={cmd.id}
              command={cmd}
              onCopy={(text) => copyToClipboard(text, index)}
              onTooltipShow={showTooltip}
              onTooltipHide={hideTooltip}
            />
          ))}
        </div>

        <div className="tips-section">
          <h3>Gobuster Tips:</h3>
          <ul>
            <li>Use <code>-w</code> to specify your wordlist path</li>
            <li>Add <code>-x php,html,txt</code> to check for files with these extensions</li>
            <li><code>-t 50</code> increases threads for faster scanning (default 10)</li>
            <li><code>-q</code> for quiet mode (less output)</li>
            <li><code>-e</code> shows full URLs instead of just paths</li>
            <li>For HTTPS sites, add <code>-k</code> to skip SSL certificate verification</li>
          </ul>
        </div>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <Tooltip text={tooltip.text} position={tooltip.position} />
    </div>
  );
};

export default SimpleMode;