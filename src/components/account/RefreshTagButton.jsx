import React from 'react'
import { toast } from 'react-toastify'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'
import { Button } from 'react-bootstrap'

async function refresh () {
  toast.promise(fetch('/api/account/refresh-tag', { method: 'POST' }), {
    pending: 'Refreshing your tag...',
    success: {
      render ({ data, toastProps }) {
        if (data.status === HTTP_CODE.TOO_MANY_REQUESTS) {
          toastProps.type = 'error'
          return 'You\'re being ratelimited. Please try again later.'
        }
        if (data.status !== 200) {
          toastProps.type = 'error'
          return 'An error occured, please try again later'
        }
        return 'Tag refreshed!'
      }
    },
    error: 'An error occured, please try again later.'
  })
}

export default function RefreshTagButton () {
  return (
    <Button variant='light' onClick={refresh}>
      Refresh Your Tag
    </Button>
  )
}
