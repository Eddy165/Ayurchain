import React from 'react'
import { Role } from '../../types/batch.types'
import { cn } from '../../lib/utils'
import { Sprout, Factory, FlaskConical, ShieldCheck, Package } from 'lucide-react'

interface RoleSelectorProps {
  value: Role
  onChange: (role: Role) => void
}

const ROLES: { id: Role, label: string, icon: any, desc: string }[] = [
  { id: 'Farmer', label: 'Farmer', icon: Sprout, desc: 'Register harvests' },
  { id: 'Processor', label: 'Processor', icon: Factory, desc: 'Process raw batches' },
  { id: 'LabTester', label: 'Lab Tester', icon: FlaskConical, desc: 'Upload verified reports' },
  { id: 'Certifier', label: 'Certifier', icon: ShieldCheck, desc: 'Issue AYUSH certs' },
  { id: 'Brand', label: 'Brand', icon: Package, desc: 'Manage products & QRs' },
]

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ROLES.map((r) => {
        const isSelected = r.id === value
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className={cn(
              "p-4 rounded-xl text-left border transition-all relative overflow-hidden",
              isSelected 
                ? "border-gold bg-gold/5 shadow-[0_4px_16px_rgba(212,160,23,0.1)]" 
                : "border-surface-container-high bg-surface-container-lowest hover:border-gold/30 hover:bg-surface-container-low"
            )}
          >
            <r.icon className={cn("w-6 h-6 mb-3 transition-colors", isSelected ? "text-gold" : "text-gray-400")} />
            <h4 className={cn("font-medium text-body mb-1", isSelected ? "text-forest" : "text-on-surface")}>{r.label}</h4>
            <p className="text-[11px] leading-tight text-gray-500 font-ui">{r.desc}</p>
            {isSelected && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
