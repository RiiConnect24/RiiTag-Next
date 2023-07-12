import { ncWithSession } from '@/lib/routing'
import HTTP_CODE from '@/lib/constants/httpStatusCodes'

const handler = ncWithSession().post((request, response) => {
  request.session.destroy()
  return response.status(HTTP_CODE.NO_CONTENT).send(null)
})

export default handler
