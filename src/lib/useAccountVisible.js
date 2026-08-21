import { useState } from 'react'
import { config } from '../config'

// 초대용 / 소식용 두 버전 결정
// -----------------------------------------------------------------
//  URL 쿼리로 두 버전을 구분합니다 (버튼 노출 없이 링크만 다르게 공유).
//    · 소식용(계좌·참석여부 없음):  ...?account=off  또는 파라미터 없음(기본값)
//    · 초대용(계좌·참석여부 있음):  ...?account=on
//  파라미터가 없으면 config.account.defaultVisible 값을 따릅니다.
//
//  이 값 하나가 "축의금 계좌" 와 "참석 여부(섹션 · 첫 화면 팝업)" 를 함께 켜고 끕니다.
//  결혼 소식만 알릴 분들께는 기본 링크를, 실제로 모실 분들께는 ?account=on 링크를
//  보내면 됩니다.
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
