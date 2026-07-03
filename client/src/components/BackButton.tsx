import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Props {
  label?: string
  className?: string
}

const BackButton = ({ label = 'Back', className = 'mb-4' }: Props) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}

export default BackButton
