import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

// config.supabase 에 url/anonKey 가 채워져 있을 때만 클라이언트를 생성합니다.
// 비어 있으면 null → store.js 가 localStorage 로 폴백합니다.
const url = config.supabase?.url?.trim()
const anonKey = config.supabase?.anonKey?.trim()

export const supabase = url && anonKey ? createClient(url, anonKey) : null
