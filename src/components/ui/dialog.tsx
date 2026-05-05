import React, { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-lg">{children}</div>
    </div>
  )
}

interface DialogContentProps {
  children: ReactNode
}

export function DialogContent({ children }: DialogContentProps) {
  return <div className="p-6 min-w-[400px]">{children}</div>
}

interface DialogHeaderProps {
  children: ReactNode
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="mb-4">{children}</div>
}

interface DialogTitleProps {
  children: ReactNode
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

interface DialogTriggerProps {
  children: ReactNode
  onClick?: () => void
}

export function DialogTrigger({ children, onClick }: DialogTriggerProps) {
  return <button onClick={onClick}>{children}</button>
}
