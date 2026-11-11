const QRCode = require('qrcode');

const generateQRCode = async (req, res) => {
  try {
    const { url, tableNumber, format } = req.query;
    
    // Default URL to request host / referer if not specified
    let targetUrl = url;
    if (!targetUrl) {
      const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
      targetUrl = tableNumber ? `${clientUrl}/?table=${encodeURIComponent(tableNumber)}` : clientUrl;
    }

    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      color: {
        dark: '#0B0B0C',
        light: '#FAF6EE'
      },
      width: 500
    };

    if (format === 'svg') {
      const svgString = await QRCode.toString(targetUrl, { ...options, type: 'svg' });
      res.type('image/svg+xml');
      return res.send(svgString);
    }

    // Default to DataURL
    const dataUrl = await QRCode.toDataURL(targetUrl, options);
    return res.json({
      success: true,
      targetUrl,
      tableNumber: tableNumber || null,
      qrDataUrl: dataUrl
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({ success: false, message: 'Server error generating QR code.' });
  }
};

module.exports = { generateQRCode };
