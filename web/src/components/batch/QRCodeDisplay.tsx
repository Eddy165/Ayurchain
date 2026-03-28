import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '../ui/Button'
import { Download, Printer } from 'lucide-react'

interface QRCodeDisplayProps {
  url: string
  batchId: string
  herbName: string
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, batchId, herbName }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const downloadQR = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const urlBlob = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = urlBlob
    link.download = `ayurchain-qr-${batchId}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient flex flex-col items-center max-w-sm mx-auto">
      <h3 className="font-display text-h3 text-forest mb-2">Scan & Verify</h3>
      <p className="font-ui text-caption text-gray-500 mb-8 text-center">
        Consumers can scan this QR code to view the complete {herbName} journey.
      </p>
      
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-surface-container-high">
        <QRCodeSVG
          value={url}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#012D1D"}
          level={"H"}
          includeMargin={false}
          imageSettings={{
            src: "/logo-white.svg",
            x: undefined,
            y: undefined,
            height: 48,
            width: 48,
            excavate: true,
          }}
          ref={svgRef}
        />
      </div>

      <div className="flex gap-3 w-full">
        <Button variant="secondary" onClick={downloadQR} fullWidth leftIcon={<Download className="w-4 h-4" />}>
          Download
        </Button>
        <Button variant="ghost" fullWidth leftIcon={<Printer className="w-4 h-4" />}>
          Print
        </Button>
      </div>
    </div>
  )
}
