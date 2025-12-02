import noise from '@/assets/images/background/noise.png'
import wave from '@/assets/images/background/wave.webp'

export function NoiseBg() {
  return (
    <div
      className='fixed inset-0 z-[-1] hidden h-screen w-screen dark:block'
      id='noise-bg'
    >
      <div className='absolute inset-0 opacity-50'>
        <img
          src={wave}
          alt='wave'
          className='h-full w-full object-cover'
        />
      </div>

      <div className='absolute inset-0 opacity-5'>
        <img
          src={noise}
          alt='noise'
          className='h-full w-full object-cover'
        />
      </div>

      <div
        className='absolute inset-0 opacity-30'
        style={{
          background:
            'radial-gradient(56.32% 64.60% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
    </div>
  )
}
