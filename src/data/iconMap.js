import { CandleIcon, PotionIcon, SparklesIcon, ShieldIcon, MoonIcon, CrystalIcon } from '../components/Icons'

const iconMap = {
  candle: CandleIcon,
  potion: PotionIcon,
  sparkles: SparklesIcon,
  shield: ShieldIcon,
  moon: MoonIcon,
  crystal: CrystalIcon,
}

export function getProductIcon(iconId) {
  return iconMap[iconId] || null
}
