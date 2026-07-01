interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const SectionHeader = ({ title, subtitle, action }: Props) => {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default SectionHeader