import nextConnect from 'next-connect'
import { session } from '@/lib/iron-session'

export function nc () {
  return nextConnect()
}

export function ncWithSession () {
  return nextConnect().use(session)
}
