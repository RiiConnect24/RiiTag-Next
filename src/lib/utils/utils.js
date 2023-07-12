import React from 'react'

export function isBlank (string_) {
  if (Array.isArray(string_)) {
    if (string_.length === 0) {
      return true
    }
    string_ = string_.join('')
  }
  return !string_ || string_.trim().length === 0
}

export function isBoolean (value) {
  return typeof value === 'boolean'
}

export function setFileHeaders (response, filename) {
  response.setHeader('Content-Disposition', `inline; filename="${filename}"`)

  // This value is considered fresh for ten seconds (s-maxage=10).
  // If a request is repeated within the next 10 seconds, the previously
  // cached value will still be fresh. If the request is repeated before 59 seconds,
  // the cached value will be stale but still render (stale-while-revalidate=59).
  //
  // In the background, a revalidation request will be made to populate the cache
  // with a fresh value. If you refresh the page, you will see the new value.
  //
  // This only works with CDN that support "edge caching"
  // See: https://nextjs.org/docs/going-to-production#caching
  response.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
}

export function generateRandomKey (keyLength) {
  const chars =
    'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890'
  let key = ''
  let lastChar = ''

  for (let index = 0; index < keyLength; index += 1) {
    let char = chars.charAt(Math.floor(Math.random() * chars.length))
    while (char === lastChar) {
      char = chars.charAt(Math.floor(Math.random() * chars.length))
    }
    key += char
    lastChar = char
  }

  return key
}

export const createOptionNodes = (objectArray) =>
  objectArray.map((object) => (
    // eslint-disable-next-line react/jsx-filename-extension
    <option key={object.value} value={object.value}>
      {object.label}
    </option>
  ))
