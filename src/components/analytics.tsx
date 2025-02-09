import Script from 'next/script'

export const Analytics = () => {
  return (
    <>
      {/* Umami Analytics */}
      <Script
        defer
        src='https://umami.guoqi.dev/script.js'
        data-website-id='0fb9ee66-0aa7-4c78-acc2-7650ec3fbbe7'
      />
    </>
  )
}
