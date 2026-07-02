import { useState } from 'react'
import { config } from '../config'

// 축의금 계좌 노출 여부 결정
// -----------------------------------------------------------------
//  URL 쿼리로 두 버전을 구분합니다 (버튼 노출 없이 링크만 다르게 공유).
//    · 계좌 없음:  ...?account=off   또는 파라미터 없음(기본값)
//    · 계좌 있음:  ...?account=on
//  파라미터가 없으면 config.account.defaultVisible 값을 따릅니다.
export function readAccountVisible() {
  if (typeof window === 'undefined') return config.account.defaultVisible
  const v = new URLSearchParams(window.location.search).get('account')
  if (v === null) return config.account.defaultVisible
  return ['on', '1', 'true', 'yes'].includes(v.toLowerCase())
}

export function useAccountVisible() {
  const [visible, setVisible] = useState(readAccountVisible)
  return [visible, setVisible]
}
