import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

// Icons (You can replace these with actual icon components if you want)
const Icons = {
  type: '📝',
  content: '✏️',
  customize: '🎨',
  size: '📏',
  color: '🎭',
  advanced: '⚙️',
  logo: '🖼️',
  download: '💾',
  reset: '🔄',
  scan: '📱',
  help: '❓',
  error: '⚠️'
};

function App() {
  // State variables
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrLevel, setQrLevel] = useState('L');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [qrStyle, setQrStyle] = useState('squares');
  const [qrType, setQrType] = useState('text');
  const [logoImage, setLogoImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  
  const qrRef = useRef(null);
  
  // Check system dark mode preference
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);
  
  // Handle input change
  const handleTextChange = (e) => {
    setText(e.target.value);
    setError('');
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle logo upload
  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove logo
  const removeLogo = () => {
    setLogoImage(null);
  };
  
  // Download QR code as image
  const downloadQRCode = (format) => {
    if (!text.trim()) {
      setError('Please enter some content for the QR code');
      return;
    }
    
    const canvas = qrRef.current?.querySelector('canvas');
    
    if (!canvas) {
      setError('Could not generate QR code. Please try again.');
      return;
    }
    
    // Convert canvas to data URL based on selected format
    let dataURL;
    let fileExt;
    
    switch (format) {
      case 'png':
        dataURL = canvas.toDataURL('image/png');
        fileExt = 'png';
        break;
      case 'jpg':
        dataURL = canvas.toDataURL('image/jpeg', 0.8);
        fileExt = 'jpg';
        break;
      case 'svg':
        // For SVG we'd need a more complex conversion
        // This is a simplified version
        const svgData = new XMLSerializer().serializeToString(
          qrRef.current?.querySelector('svg') || new XMLDocument()
        );
        dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        fileExt = 'svg';
        break;
      default:
        dataURL = canvas.toDataURL('image/png');
        fileExt = 'png';
    }
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `qrcode.${fileExt}`;
    link.click();
  };
  
  // Reset form
  const resetForm = () => {
    setText('');
    setQrSize(200);
    setQrFgColor('#000000');
    setQrBgColor('#ffffff');
    setQrLevel('L');
    setIncludeMargin(true);
    setQrStyle('squares');
    setQrType('text');
    setLogoImage(null);
    setError('');
  };
  
  // Generate QR code value based on type
  const getQRValue = () => {
    switch (qrType) {
      case 'url':
        return text;
      case 'email':
        return `mailto:${text}`;
      case 'tel':
        return `tel:${text}`;
      case 'sms':
        return `sms:${text}`;
      case 'wifi':
        try {
          const [ssid, password, type = 'WPA'] = text.split(',');
          return `WIFI:S:${ssid};T:${type};P:${password};;`;
        } catch (e) {
          return text;
        }
      default:
        return text;
    }
  };
  
  const AdContainer = () => {
    React.useEffect(() => {
      // This tries to load an ad when the component mounts
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, []);

    return (
      <div className="ad-container">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4382992337001515"
          data-ad-slot="YOUR_AD_SLOT_ID" // Replace with your actual ad slot ID
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>
    );
  };
  
  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <h1>QR Code Generator</h1>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <AdContainer />
      
      <main className="container">
        <section className="qr-generator">
          {/* QR Input Area */}
          <div className="qr-input-area">
            <div className="qr-type-selector">
              <label htmlFor="qr-type">QR Code Type:</label>
              <select 
                id="qr-type" 
                value={qrType} 
                onChange={(e) => setQrType(e.target.value)}
              >
                <option value="text">Plain Text</option>
                <option value="url">Website URL</option>
                <option value="email">Email Address</option>
                <option value="tel">Phone Number</option>
                <option value="sms">SMS Message</option>
                <option value="wifi">WiFi Network</option>
              </select>
            </div>
            
            <div className="qr-content-input">
              <label htmlFor="qr-content">
                {qrType === 'url' ? 'Enter URL:' : 
                 qrType === 'email' ? 'Enter Email:' :
                 qrType === 'tel' ? 'Enter Phone Number:' :
                 qrType === 'sms' ? 'Enter Phone Number:' :
                 qrType === 'wifi' ? 'Enter SSID, Password, Type:' :
                 'Enter Text:'}
              </label>
              <input
                type="text"
                id="qr-content"
                value={text}
                onChange={handleTextChange}
                placeholder={
                  qrType === 'url' ? 'https://example.com' : 
                  qrType === 'email' ? 'user@example.com' :
                  qrType === 'tel' ? '+1234567890' :
                  qrType === 'sms' ? '+1234567890' :
                  qrType === 'wifi' ? 'MyNetwork,password,WPA' :
                  'Enter content here'
                }
              />
              {qrType === 'wifi' && (
                <div className="helper-text">
                  Format: NetworkName,Password,EncryptionType
                </div>
              )}
            </div>
          </div>
          
          {/* QR Preview and Options */}
          <div className="qr-preview-options">
            {/* QR Preview */}
            <div className="qr-preview">
              <div className="qr-code-container" ref={qrRef}>
                {text ? (
                  <QRCodeCanvas
                    value={getQRValue()}
                    size={qrSize}
                    bgColor={qrBgColor}
                    fgColor={qrFgColor}
                    level={qrLevel}
                    includeMargin={includeMargin}
                    renderAs="canvas"
                    imageSettings={
                      logoImage ? {
                        src: logoImage,
                        x: undefined,
                        y: undefined,
                        height: qrSize * 0.2,
                        width: qrSize * 0.2,
                        excavate: true,
                      } : undefined
                    }
                  />
                ) : (
                  <div className="placeholder">
                    Enter content to generate QR code
                  </div>
                )}
              </div>
              
              <div className="download-options">
                <button 
                  className="download-btn" 
                  onClick={() => downloadQRCode('png')}
                  disabled={!text}
                >
                  PNG
                </button>
                <button 
                  className="download-btn" 
                  onClick={() => downloadQRCode('jpg')}
                  disabled={!text}
                >
                  JPG
                </button>
                <button 
                  className="download-btn" 
                  onClick={() => downloadQRCode('svg')}
                  disabled={!text}
                >
                  SVG
                </button>
              </div>
            </div>
            
            {/* QR Options */}
            <div className="qr-options">
              <div className="tabs">
                <button 
                  className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                  onClick={() => handleTabChange('appearance')}
                >
                  <span className="button-icon">{Icons.customize}</span>
                  Appearance
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                  onClick={() => handleTabChange('advanced')}
                >
                  <span className="button-icon">{Icons.advanced}</span>
                  Advanced
                </button>
              </div>
              
              <div className="tab-content">
                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div className="appearance-options">
                    <div className="option-row">
                      <div className="option">
                        <label htmlFor="qr-size">Size: {qrSize}px</label>
                        <input
                          type="range"
                          id="qr-size"
                          min="100"
                          max="400"
                          value={qrSize}
                          onChange={(e) => setQrSize(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="option-row">
                      <div className="option">
                        <label htmlFor="qr-fg-color">Foreground Color:</label>
                        <div className="color-input">
                          <div 
                            className="color-preview" 
                            style={{ backgroundColor: qrFgColor }}
                          ></div>
                          <input
                            type="color"
                            id="qr-fg-color"
                            value={qrFgColor}
                            onChange={(e) => setQrFgColor(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="option">
                        <label htmlFor="qr-bg-color">Background Color:</label>
                        <div className="color-input">
                          <div 
                            className="color-preview" 
                            style={{ backgroundColor: qrBgColor }}
                          ></div>
                          <input
                            type="color"
                            id="qr-bg-color"
                            value={qrBgColor}
                            onChange={(e) => setQrBgColor(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="option-row">
                      <div className="option">
                        <label htmlFor="qr-style">Pattern Style:</label>
                        <select 
                          id="qr-style" 
                          value={qrStyle} 
                          onChange={(e) => setQrStyle(e.target.value)}
                        >
                          <option value="squares">Squares (Default)</option>
                          <option value="dots">Dots (Rounded)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                  <div className="advanced-options">
                    <div className="option-row">
                      <div className="option">
                        <label htmlFor="qr-level">Error Correction:</label>
                        <select 
                          id="qr-level" 
                          value={qrLevel} 
                          onChange={(e) => setQrLevel(e.target.value)}
                        >
                          <option value="L">Low (7%)</option>
                          <option value="M">Medium (15%)</option>
                          <option value="Q">Quartile (25%)</option>
                          <option value="H">High (30%) - Best for logos</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="option-row">
                      <div className="option checkbox">
                        <input
                          type="checkbox"
                          id="qr-margin"
                          checked={includeMargin}
                          onChange={(e) => setIncludeMargin(e.target.checked)}
                        />
                        <label htmlFor="qr-margin">Include Margin (Quiet Zone)</label>
                      </div>
                    </div>
                    
                    <div className="option-row">
                      <div className="option">
                        <label htmlFor="logo-upload">Add Logo Image:</label>
                        <div className="logo-upload">
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                          {logoImage && (
                            <button 
                              className="remove-logo" 
                              onClick={removeLogo}
                            >
                              <span className="button-icon">{Icons.reset}</span>
                              Remove Logo
                            </button>
                          )}
                          {logoImage && qrLevel !== 'H' && (
                            <div className="helper-text warning">
                              High error correction recommended for logos
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button 
              className="reset-btn" 
              onClick={resetForm}
            >
              <span className="button-icon">{Icons.reset}</span>
              Reset All
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">{Icons.error}</span>
              {error}
            </div>
          )}
        </section>
      </main>
      
      <AdContainer />
      
      <footer>
        <div className="help-section">
          <div className="option-group-title">
            <span className="option-group-icon">{Icons.help}</span>
            How to Use
          </div>
          <ol>
            <li>Choose the QR code type (URL, text, etc.)</li>
            <li>Enter your content in the input field</li>
            <li>Customize the appearance (colors, size, etc.)</li>
            <li>Add a logo image (optional)</li>
            <li>Download in your preferred format</li>
          </ol>
        </div>
        <p>© QR Code Generator - Pranjal Doshi</p>
      </footer>
    </div>
  );
}

export default App;
