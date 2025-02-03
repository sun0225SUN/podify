import Script from 'next/script'

export const Analytics = () => {
  return (
    <>
      {/* Umami Analytics */}
      <Script
        defer
        src='https://umami.createwise.ai/script.js'
        data-website-id='9f769fa7-a229-45f1-84ed-bbd671b4bcd1'
      />
    </>
  )
}
