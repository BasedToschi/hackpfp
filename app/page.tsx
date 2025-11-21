'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

// ICC Profile (Rec2020 with PQ) as base64
const ICC_PROFILE_BASE64 = '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GBdnPoAAGBeAAIAAIe0AAIAAIe0EcIAAIe0JwIAAIe0QL4AAIe0YF4AAIe0h7YAAIe0uRIAAIe09vYAAIe1QyoAAIe1nPoAAIe2AAIAALkQAAIAALkQEcIAALkQJwIAALkQQL4AALkQYF4AALkQh7YAALkQuRIAALkQ9vYAALkRQyoAALkRnPoAALkSAAIAAPb0AAIAAPb0EcIAAPb0JwIAAPb0QL4AAPb0YF4AAPb0h7YAAPb0uRIAAPb09vYAAPb1QyoAAPb1nPoAAPb2AAIAAUMoAAIAAUMoEcIAAUMoJwIAAUMoQL4AAUMoYF4AAUMoh7YAAUMouRIAAUMo9vYAAUMpQyoAAUMpnPoAAUMqAAIAAZz4AAIAAZz4EcIAAZz4JwIAAZz4QL4AAZz4YF4AAZz4h7YAAZz4uRIAAZz49vYAAZz5QyoAAZz5nPoAAZz6AAIAAgAAAAIAAgAAEcIAAgAAJwIAAgAAQL4AAgAAYF4AAgAAh7YAAgAAuRIAAgAA9vYAAgABQyoAAgABnPoAAgACAAAAAY3VydgAAAAAAAABBAAAAAgAHABEAIAA4AFgAhAC/AQoBaQHhAnYDLQQKBRUGVAfPCY8LnA4DEMQT+hefG8UgZSWeK3cx5DjQQIRItlF+WrdkfG56eNuDio5UmUOkSK8yukPFVNBn27HnHPK9/t7//////////////////////////////////////////wAAY3VydgAAAAAAAABBAAAAAgAHABEAIAA4AFgAhAC/AQoBaQHhAnYDLQQKBRUGVAfPCY8LnA4DEMQT+hefG8UgZSWeK3cx5DjQQIRItlF+WrdkfG56eNuDio5UmUOkSK8yukPFVNBn27HnHPK9/t7//////////////////////////////////////////wAAY3VydgAAAAAAAABBAAAAAgAHABEAIAA4AFgAhAC/AQoBaQHhAnYDLQQKBRUGVAfPCY8LnA4DEMQT+hefG8UgZSWeK3cx5DjQQIRItlF+WrdkfG56eNuDio5UmUOkSK8yukPFVNBn27HnHPK9/t7//////////////////////////////////////////wAAAACsaAAAKmkAACAHAABHbwAArOMAAAuu////gQAAB60AAMwTAAAAAAAAAAAAAAAAcGFyYQAAAAAAAAAAAAEAAHBhcmEAAAAAAAAAAAABAABwYXJhAAAAAAAAAAAAAQAAbUJBIAAAAAADAwAAAAAAIAAAAAAAAAAAAAAAAAAAAABwYXJhAAAAAAAAAAAAAQAAcGFyYQAAAAAAAAAAAAEAAHBhcmEAAAAAAAAAAAABAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADY=';

// Hacker jokes
const JOKES = [
  "⚡ You just successfully exploited our color palette algorithm! Now exploit your wallet (optional but appreciated). Works on any EVM chain!",
  "🔓 Access Granted! Your image has been hacked. Consider dropping some crypto to support our underground operation. ETH, Polygon, Base - we accept all EVM chains!",
  "🎯 Mission Complete! Your picture shines... literally! Donations on any EVM chain power our quantum chromatic filters.",
  "⚙️ Hack executed flawlessly! If you enjoyed this free exploit, consider fueling our caffeine-to-code converter. Same address, any EVM chain!",
  "🚀 Image transformation successful! Help us keep the servers running and the memes flowing with a donation. ETH, Arbitrum, Optimism - all welcome!",
  "🔥 Your image is fire! Keep our blockchain dreams alive with some sweet crypto. Works across all EVM chains!",
  "💎 Diamond hands deserved! If this tool made you smile, consider sharing some love on any EVM chain you prefer.",
  "🎨 Artistic exploit complete! Support the cypherpunk movement, one donation at a time. Multi-chain friendly!",
  "⭐ You're a star! This hack was brought to you by coffee, code, and community support. Crypto accepted on all EVM chains!"
];

// Color palette
const PALETTE = [
  { r: 10, g: 10, b: 10 },
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 170, b: 120 },
  { r: 255, g: 80, b: 100 },
  { r: 255, g: 220, b: 120 },
  { r: 170, g: 100, b: 200 },
  { r: 220, g: 200, b: 180 },
];

const ETH_ADDRESS = "0x63428e70a8016d10E8e2f7da440c898063afA299";

declare global {
  interface Window {
    pako: any;
    QRCode: any;
  }
}

export default function Home() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('⚡ HACKING IN PROGRESS...');
  const [showDownload, setShowDownload] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showHdrModal, setShowHdrModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joke, setJoke] = useState('');
  const [scriptsLoaded, setScriptsLoaded] = useState({ pako: false, qrcode: false });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if scripts are already loaded
    if (typeof window !== 'undefined') {
      if (window.pako) setScriptsLoaded(prev => ({ ...prev, pako: true }));
      if (window.QRCode) setScriptsLoaded(prev => ({ ...prev, qrcode: true }));
    }
  }, []);

  // Redraw original canvas when image changes
  useEffect(() => {
    if (originalImage && originalCanvasRef.current) {
      requestAnimationFrame(() => {
        drawOriginal(originalImage);
      });
    }
  }, [originalImage]);

  const colorDistance = (c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}) => {
    const rmean = (c1.r + c2.r) / 2;
    const r = c1.r - c2.r;
    const g = c1.g - c2.g;
    const b = c1.b - c2.b;
    return Math.sqrt((2 + rmean/256) * r * r + 4 * g * g + (2 + (255-rmean)/256) * b * b);
  };

  const findClosestColor = (r: number, g: number, b: number) => {
    let minDist = Infinity;
    let closestColor = PALETTE[0];
    
    for (const color of PALETTE) {
      const dist = colorDistance({ r, g, b }, color);
      if (dist < minDist) {
        minDist = dist;
        closestColor = color;
      }
    }
    
    return closestColor;
  };

  const drawOriginal = (img: HTMLImageElement) => {
    if (!originalCanvasRef.current) return;
    
    const canvas = originalCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling to fit within canvas while maintaining aspect ratio
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    
    // Draw with a slight delay to ensure canvas is ready
    requestAnimationFrame(() => {
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    });
  };

  const handleImageUpload = (file: File) => {
    // Reset states first
    setShowDownload(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Ensure image is fully loaded before processing
        setTimeout(() => {
          setOriginalImage(img);
          setShowPreview(true);
          setShowControls(true);
          // Draw after state updates
          requestAnimationFrame(() => {
            drawOriginal(img);
          });
        }, 100);
      };
      img.onerror = () => {
        alert('Failed to load image. Please try again.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleHack = () => {
    if (!originalImage || !outputCanvasRef.current) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const canvas = outputCanvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setLoading(false);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
      const x = (canvas.width - originalImage.width * scale) / 2;
      const y = (canvas.height - originalImage.height * scale) / 2;
      
      ctx.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const closest = findClosestColor(r, g, b);
        
        data[i] = closest.r;
        data[i + 1] = closest.g;
        data[i + 2] = closest.b;
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      setLoading(false);
      setShowDownload(true);
    }, 1000);
  };

  const calculateCRC32 = (data: Uint8Array): number => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = crc ^ data[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
      }
    }
    return crc ^ 0xFFFFFFFF;
  };

  const embedICCProfile = async (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const reader = new FileReader();
        reader.onload = function() {
          const arrayBuffer = this.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const iccProfileData = atob(ICC_PROFILE_BASE64);
          const iccBytes = new Uint8Array(iccProfileData.length);
          for (let i = 0; i < iccProfileData.length; i++) {
            iccBytes[i] = iccProfileData.charCodeAt(i);
          }
          
          const compressed = window.pako.deflate(iccBytes);
          
          const profileName = 'Rec2020-PQ';
          const nameBytes = new TextEncoder().encode(profileName);
          
          const iccpData = new Uint8Array(nameBytes.length + 1 + 1 + compressed.length);
          iccpData.set(nameBytes, 0);
          iccpData[nameBytes.length] = 0;
          iccpData[nameBytes.length + 1] = 0;
          iccpData.set(compressed, nameBytes.length + 2);
          
          const insertPos = 33;
          const newSize = uint8Array.length + iccpData.length + 12;
          const newPng = new Uint8Array(newSize);
          
          newPng.set(uint8Array.subarray(0, insertPos), 0);
          
          let pos = insertPos;
          const length = iccpData.length;
          newPng[pos++] = (length >> 24) & 0xFF;
          newPng[pos++] = (length >> 16) & 0xFF;
          newPng[pos++] = (length >> 8) & 0xFF;
          newPng[pos++] = length & 0xFF;
          
          newPng[pos++] = 0x69;
          newPng[pos++] = 0x43;
          newPng[pos++] = 0x43;
          newPng[pos++] = 0x50;
          
          newPng.set(iccpData, pos);
          pos += iccpData.length;
          
          const crcData = new Uint8Array(4 + iccpData.length);
          crcData[0] = 0x69;
          crcData[1] = 0x43;
          crcData[2] = 0x43;
          crcData[3] = 0x50;
          crcData.set(iccpData, 4);
          const crc = calculateCRC32(crcData);
          newPng[pos++] = (crc >> 24) & 0xFF;
          newPng[pos++] = (crc >> 16) & 0xFF;
          newPng[pos++] = (crc >> 8) & 0xFF;
          newPng[pos++] = crc & 0xFF;
          
          newPng.set(uint8Array.subarray(insertPos), pos);
          
          const newBlob = new Blob([newPng], { type: 'image/png' });
          resolve(newBlob);
        };
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  };

  const handleDownload = async () => {
    if (!outputCanvasRef.current) return;
    
    setLoading(true);
    setLoadingText('⚡ EMBEDDING HDR PROFILE...');
    
    try {
      const blob = await embedICCProfile(outputCanvasRef.current);
      
      const link = document.createElement('a');
      link.download = 'x-profile-hacked-hdr.png';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setLoading(false);
      setLoadingText('⚡ HACKING IN PROGRESS...');
      
      setTimeout(() => {
        const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        setJoke(randomJoke);
        setShowDonationModal(true);
        generateQRCode();
      }, 500);
    } catch (error) {
      console.error('Error embedding ICC profile:', error);
      setLoading(false);
      alert('Error embedding ICC profile. Downloading without HDR...');
      
      outputCanvasRef.current.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = 'x-profile-hacked.png';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    }
  };

  const generateQRCode = () => {
    if (!qrContainerRef.current || !window.QRCode) return;
    if (qrContainerRef.current.hasChildNodes()) return;
    
    new window.QRCode(qrContainerRef.current, {
      text: `ethereum:${ETH_ADDRESS}`,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ETH_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = ETH_ADDRESS;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('Failed to copy. Please copy manually: ' + ETH_ADDRESS);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js" 
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, pako: true }))}
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" 
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, qrcode: true }))}
      />
      
      <div className="scanlines"></div>
      
      <div className="container">
        <div className="header">
          <h1 className="glitch" data-text="X PROFILE HACKER">X PICTURE HACKER</h1>
          <div className="subtitle">v1.337 // Makes Your Picture Shine... Literally</div>
        </div>
        
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dot dot-red"></div>
            <div className="terminal-dot dot-yellow"></div>
            <div className="terminal-dot dot-green"></div>
            <div className="terminal-title">root@x-hacker:~/image-transform</div>
          </div>
          
          <div className="command-line">Initializing color palette exploit...</div>
          <div className="command-line">Loading quantum chromatic filters...</div>
          <div className="command-line">Ready to hack your profile pic!</div>
        </div>
        
        <div className="terminal">
          <div 
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="upload-icon">📁</div>
            <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
              DROP YOUR IMAGE HERE
            </div>
            <div style={{ color: '#00aa00', fontSize: '0.9em' }}>
              or click to select from your files
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          {showControls && (
            <div className="controls-container">
              <button 
                onClick={handleHack} 
                disabled={loading}
              >
                🔓 EXECUTE HACK
              </button>
              {showDownload && (
                <button onClick={handleDownload}>
                  💾 DOWNLOAD HDR
                </button>
              )}
            </div>
          )}
          
          {loading && (
            <div className="loading">
              {loadingText}
            </div>
          )}
        </div>
        
        {showPreview && (
          <div className="preview-container">
            <div className="preview-box">
              <h3>// ORIGINAL</h3>
              <canvas ref={originalCanvasRef} width="300" height="300"></canvas>
            </div>
            <div className="preview-box">
              <h3>// HACKED</h3>
              <canvas ref={outputCanvasRef} width="300" height="300"></canvas>
            </div>
          </div>
        )}
        
        <div className="footer">
          <div>▲ Powered by Terminal Wizardry ▲</div>
          <div style={{ marginTop: '10px', fontSize: '0.8em' }}>
            Warning: This tool may cause extreme coolness
          </div>
          <div style={{ marginTop: '15px' }}>
            Built with ⚡ by <a href="https://x.com/0xdanya_xo" target="_blank" rel="noopener noreferrer">0xdanya_xo</a>
          </div>
        </div>
      </div>
      
      <button 
        className="info-button" 
        onClick={() => setShowHdrModal(!showHdrModal)}
        title="HDR Information"
      >
        ?
      </button>
      
      <div className={`hdr-modal ${showHdrModal ? 'active' : ''}`}>
        <button className="close-hdr" onClick={() => setShowHdrModal(false)}>×</button>
        <h3>⚡ HDR DISPLAY INFO</h3>
        <p>This hack makes your picture <strong>shine... literally!</strong></p>
        <p>Downloaded images include <strong>Rec2020-PQ HDR color profile</strong>!</p>
        <p>The vibrant color palette and transformation work best on:</p>
        <div className="command-line" style={{ fontSize: '0.9em' }}>For the best results, upload square images</div>
        <div className="command-line" style={{ fontSize: '0.9em' }}>Modern smartphones with OLED/AMOLED screens</div>
        <div className="command-line" style={{ fontSize: '0.9em' }}>HDR-capable monitors and laptops</div>
        <div className="command-line" style={{ fontSize: '0.9em' }}>Tablets with HDR support</div>
        <p style={{ marginTop: '15px', fontSize: '0.9em' }}>Your transformed image will display HDR colors that truly <em>pop</em>! ✨</p>
      </div>
      
      <div className={`modal-overlay ${showDonationModal ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setShowDonationModal(false);
      }}>
        <div className="modal-content">
          <button className="close-modal" onClick={() => setShowDonationModal(false)}>×</button>
          
          <div className="modal-header">
            <div className="crypto-icon">💎</div>
            <h2 className="glitch" data-text="HACK SUCCESSFUL!">HACK SUCCESSFUL!</h2>
          </div>
          
          <div className="modal-joke">
            {joke}
          </div>
          
          <div className="eth-address-container">
            <div className="eth-label">// EVM DONATION ADDRESS (ETH, BSC, POLYGON, ARBITRUM, BASE, etc.)</div>
            <div className="eth-address" onClick={copyAddress} title="Click to copy">
              {ETH_ADDRESS}
            </div>
            <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={copyAddress}>
              {copied ? '✅ COPIED!' : '📋 COPY ADDRESS'}
            </button>
          </div>
          
          <div className="qr-code-container">
            <div className="qr-code">
              <div ref={qrContainerRef}></div>
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="command-line">No pressure, but your donation helps keep this hack alive!</div>
            <div style={{ marginTop: '10px' }}>
              Built with ⚡ by <a href="https://x.com/0xdanya_xo" target="_blank" rel="noopener noreferrer">0xdanya_xo</a>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}
