import { useState, useEffect } from 'react';
import { FaCopy, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import '../styles/AdvanceMode.css';

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
        backgroundColor: '#112240',
        color: '#e6f1ff',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '14px',
        pointerEvents: 'none',
        position: 'absolute',
        border: '1px solid #64ffda'
      }}
    >
      {text}
    </div>,
    document.body
  );
};

const AdvancedMode = () => {
  const [target, setTarget] = useState('');
  const [wordlist, setWordlist] = useState('');
  const [customWordlist, setCustomWordlist] = useState('');
  const [extensions, setExtensions] = useState('');
  const [threads, setThreads] = useState(10);
  const [timeout, setTimeout] = useState(10);
  const [statusCodes, setStatusCodes] = useState('200,204,301,302,307,401,403');
  const [hideCodes, setHideCodes] = useState('404');
  const [showFullUrl, setShowFullUrl] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [noProgress, setNoProgress] = useState(false);
  const [followRedirect, setFollowRedirect] = useState(false);
  const [skipSSL, setSkipSSL] = useState(false);
  const [outputFile, setOutputFile] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [proxy, setProxy] = useState('');
  const [command, setCommand] = useState('');
  const [notification, setNotification] = useState('');
  const [tooltip, setTooltip] = useState({ text: "", position: null });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const gobusterWordlists = {
    // Dirb
    dirbCommon: '/usr/share/wordlists/dirb/common.txt',
    dirbSmall: '/usr/share/wordlists/dirb/small.txt',

    // Dirbuster
    dirbusterSmall: '/usr/share/wordlists/dirbuster/directory-list-1.0.txt',
    dirbusterMedium: '/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt',
    dirbusterLarge: '/usr/share/wordlists/dirbuster/directory-list-2.3-big.txt',

    // SecLists - Web Content
    seclistsCommon: '/usr/share/seclists/Discovery/Web-Content/common.txt',
    seclistsBig: '/usr/share/seclists/Discovery/Web-Content/big.txt',
    seclistsMedium: '/usr/share/seclists/Discovery/Web-Content/medium.txt',
    seclistsCGI: '/usr/share/seclists/Discovery/Web-Content/CGIs.txt',
    seclistsAdminPanels: '/usr/share/seclists/Discovery/Web-Content/admin-panels.txt',
    seclistsExtensions: '/usr/share/seclists/Discovery/Web-Content/extensions-common.txt',

    // API & Special Targets
    apiCommon: '/usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt',
    joomla: '/usr/share/seclists/Discovery/Web-Content/CMS/joomla.txt',
    wordpress: '/usr/share/seclists/Discovery/Web-Content/CMS/wordpress.txt'
  };

  useEffect(() => {
    generateCommand();
  }, [
    target, wordlist, customWordlist, extensions, threads, timeout, 
    statusCodes, hideCodes, showFullUrl, quietMode, noProgress,
    followRedirect, skipSSL, outputFile, userAgent, customHeaders, proxy
  ]);

  const generateCommand = () => {
    let cmd = 'gobuster';

    // Mode selection (dir/vhost/dns)
    cmd += ' dir'; // Default to directory brute-forcing

    // Required parameters
    if (!target) {
      setCommand('');
      return;
    }
    cmd += ` -u ${target}`;

    // Wordlist selection
    if (customWordlist) {
      cmd += ` -w ${customWordlist}`;
    } else if (wordlist) {
      cmd += ` -w ${wordlist}`;
    } else {
      setCommand('');
      return;
    }

    // Extensions
    if (extensions) {
      cmd += ` -x ${extensions}`;
    }

    // Performance options
    cmd += ` -t ${threads}`;
    cmd += ` --timeout ${timeout}s`;

    // Status code filtering
    if (statusCodes) {
      cmd += ` -s ${statusCodes}`;
    }
    if (hideCodes) {
      cmd += ` -b ${hideCodes}`;
    }

    // Output options
    if (showFullUrl) cmd += ' -e';
    if (quietMode) cmd += ' -q';
    if (noProgress) cmd += ' -z';
    if (outputFile) cmd += ` -o ${outputFile}`;

    // Advanced options
    if (followRedirect) cmd += ' -r';
    if (skipSSL) cmd += ' -k';
    if (userAgent) cmd += ` -a "${userAgent}"`;
    if (customHeaders) {
      const headers = customHeaders.split('\n').filter(h => h.trim());
      headers.forEach(header => cmd += ` -H "${header.trim()}"`);
    }
    if (proxy) cmd += ` --proxy ${proxy}`;

    setCommand(cmd);
  };

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

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  return (
    <div className="advanced-mode-container">
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="advanced-mode-content">
        <h2 className="mode-title">
          Advanced <span style={{ color: '#64ffda', fontWeight: 'bold' }}>Gobuster</span> Generator
        </h2>
        <p className="mode-description">
          Customize your Gobuster command with advanced options for directory, vhost, and DNS brute-forcing.
        </p>

        <div className="form-grid">
          {/* Basic Options */}
          <div className="form-group">
            <label>
              Target URL
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "The target URL to scan (e.g., http://example.com)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="http://example.com"
            />
          </div>

          <div className="form-group">
            <label>
              Predefined Wordlists
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Select from common wordlists or specify a custom path below")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <select
              value={wordlist}
              onChange={(e) => setWordlist(e.target.value)}
              disabled={!!customWordlist}
            >
              <option value="">Select a wordlist</option>
              <optgroup label="Dirb Wordlists">
                <option value={gobusterWordlists.dirbCommon}>Dirb Common</option>
                <option value={gobusterWordlists.dirbSmall}>Dirb Small</option>
              </optgroup>
              <optgroup label="Dirbuster Wordlists">
                <option value={gobusterWordlists.dirbusterSmall}>Dirbuster Small</option>
                <option value={gobusterWordlists.dirbusterMedium}>Dirbuster Medium</option>
                <option value={gobusterWordlists.dirbusterLarge}>Dirbuster Large</option>
              </optgroup>
              <optgroup label="SecLists Wordlists">
                <option value={gobusterWordlists.seclistsCommon}>SecLists Common</option>
                <option value={gobusterWordlists.seclistsMedium}>SecLists Medium</option>
                <option value={gobusterWordlists.seclistsBig}>SecLists Big</option>
                <option value={gobusterWordlists.seclistsCGI}>CGIs List</option>
                <option value={gobusterWordlists.seclistsAdminPanels}>Admin Panels</option>
                <option value={gobusterWordlists.apiCommon}>API Endpoints</option>
                <option value={gobusterWordlists.wordpress}>WordPress</option>
                <option value={gobusterWordlists.joomla}>Joomla</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>
              Custom Wordlist Path
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Specify a custom wordlist path (overrides predefined selection)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="text"
              value={customWordlist}
              onChange={(e) => setCustomWordlist(e.target.value)}
              placeholder="/path/to/wordlist.txt"
            />
          </div>

          <div className="form-group">
            <label>
              File Extensions
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Comma-separated list of extensions to check (e.g., php,html,txt)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="text"
              value={extensions}
              onChange={(e) => setExtensions(e.target.value)}
              placeholder="php,html,txt"
            />
          </div>

          {/* Performance Options */}
          <div className="form-group">
            <label>
              Threads
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Number of concurrent threads (default: 10)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={threads}
              onChange={(e) => setThreads(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              Timeout (seconds)
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Timeout for requests in seconds (default: 10)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
            />
          </div>

          {/* Status Code Filtering */}
          <div className="form-group">
            <label>
              Show Status Codes
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Comma-separated status codes to show (default: 200,204,301,302,307,401,403)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="text"
              value={statusCodes}
              onChange={(e) => setStatusCodes(e.target.value)}
              placeholder="200,301,302"
            />
          </div>

          <div className="form-group">
            <label>
              Hide Status Codes
              <FaInfoCircle 
                className="info-icon"
                onMouseEnter={(e) => showTooltip(e, "Comma-separated status codes to hide (default: 404)")}
                onMouseLeave={hideTooltip}
              />
            </label>
            <input
              type="text"
              value={hideCodes}
              onChange={(e) => setHideCodes(e.target.value)}
              placeholder="404"
            />
          </div>

          {/* Toggle for Advanced Options */}
          <div className="advanced-toggle" onClick={toggleAdvancedOptions}>
            <span>Advanced Options</span>
            {showAdvancedOptions ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={showFullUrl}
                    onChange={(e) => setShowFullUrl(e.target.checked)}
                  />
                  Show Full URLs
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Show full URLs in output (-e flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={quietMode}
                    onChange={(e) => setQuietMode(e.target.checked)}
                  />
                  Quiet Mode
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Don't print banner and progress (-q flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={noProgress}
                    onChange={(e) => setNoProgress(e.target.checked)}
                  />
                  No Progress
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Don't display progress (-z flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={followRedirect}
                    onChange={(e) => setFollowRedirect(e.target.checked)}
                  />
                  Follow Redirects
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Follow redirects (-r flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={skipSSL}
                    onChange={(e) => setSkipSSL(e.target.checked)}
                  />
                  Skip SSL Verification
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Skip SSL certificate verification (-k flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  Output File
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "File to write output to (-o flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
                <input
                  type="text"
                  value={outputFile}
                  onChange={(e) => setOutputFile(e.target.value)}
                  placeholder="results.txt"
                />
              </div>

              <div className="form-group">
                <label>
                  User Agent
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Set custom User-Agent (-a flag)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
                <input
                  type="text"
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  placeholder="Custom User Agent"
                />
              </div>

              <div className="form-group">
                <label>
                  Custom Headers
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "One header per line (e.g., X-API-Key: value)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
                <textarea
                  value={customHeaders}
                  onChange={(e) => setCustomHeaders(e.target.value)}
                  placeholder="X-API-Key: value\nAuthorization: Bearer token"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  Proxy
                  <FaInfoCircle 
                    className="info-icon"
                    onMouseEnter={(e) => showTooltip(e, "Proxy to use for requests (e.g., http://proxy:8080)")}
                    onMouseLeave={hideTooltip}
                  />
                </label>
                <input
                  type="text"
                  value={proxy}
                  onChange={(e) => setProxy(e.target.value)}
                  placeholder="http://proxy:8080"
                />
              </div>
            </>
          )}
        </div>

        {/* Generated Command */}
        <div className="command-display">
          <h3>Generated Gobuster Command:</h3>
          <div className="command-container">
            <code>{command || "Fill in required fields to generate command"}</code>
            {command && (
              <button className="copy-button" onClick={copyToClipboard}>
                <FaCopy /> Copy
              </button>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h3>Advanced Gobuster Tips:</h3>
          <ul>
            <li>Use <code>-m dns</code> for DNS subdomain brute-forcing (requires DNS wordlist)</li>
            <li>For vhost enumeration, use <code>-m vhost</code> mode</li>
            <li>Combine with <code>-k</code> for HTTPS targets with self-signed certificates</li>
            <li>Use <code>-p</code> to specify a delay between requests (in seconds)</li>
            <li>For API testing, use specialized wordlists targeting common endpoints</li>
            <li>Adjust threads based on target server capacity to avoid overwhelming it</li>
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

export default AdvancedMode;