'use client'

import { ReactNode } from 'react'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { Button } from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success'
  icon?: ReactNode
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  icon
}: ConfirmModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const variantStyles = {
    danger: {
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      buttonClass: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700'
    },
    success: {
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      buttonClass: 'bg-green-600 hover:bg-green-700'
    }
  }

  const styles = variantStyles[variant]
  const defaultIcon = variant === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconColor}`}>
              {icon || defaultIcon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-neutral-300 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 bg-neutral-800/50 border-t border-neutral-800">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${styles.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
