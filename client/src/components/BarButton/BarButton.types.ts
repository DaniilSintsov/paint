export interface IBarButtonProps {
  image: string
  description: string
  onClick: (...args: any[]) => void
  tipAlign: 'left' | 'right'
}
