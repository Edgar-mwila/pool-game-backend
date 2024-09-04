export const calculateShot = (
  cuePosition: { x: number, y: number, z: number },
  ballPosition: { x: number, y: number, z: number },
  aiDifficulty: 'easy' | 'medium' | 'hard'
) => {
  const dx = ballPosition.x - cuePosition.x
  const dy = ballPosition.y - cuePosition.y

  // Calculate angle based on vector between cue and ball
  const cueAngle = Math.atan2(dy, dx)

  // Power depends on AI difficulty
  let power: number
  switch (aiDifficulty) {
    case 'easy':
      power = Math.random() * 0.3 + 0.5 // Lower, less accurate power
      break
    case 'medium':
      power = Math.random() * 0.2 + 0.7 // Medium power
      break
    case 'hard':
      power = Math.random() * 0.1 + 0.9 // More precise, higher power
      break
    default:
      power = 0.7
  }

  return { cueAngle, power }
}
