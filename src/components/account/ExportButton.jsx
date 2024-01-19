import { React, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function ExportButton () {
  const [exportUrl, setExportUrl] = useState('#')
  const dlButton = useRef()

  const download = async () => {
    if (exportUrl !== '#') {
      // Already exported, do not re-export, but download again
      dlButton.current.click()
      return
    }

    const response = await fetch('/api/account/export-data', {
      method: 'POST'
    })

    if (response.status === 200) {
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      setExportUrl(blobUrl)
      setTimeout(() => {
        dlButton.current.click()
      })
      toast.success('You can download your data now!')
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
    <>
      <a
        ref={dlButton}
        className='d-none'
        href={exportUrl}
        download='riitag-export.json'
        rel='external'
      >
        Download exported data
      </a>
      <Button variant='success' onClick={download}>
        Export your Data
      </Button>
    </>
  )
}
